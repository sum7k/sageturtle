// Who is looking at the admin panel. Cloudflare Access sits in front of /admin and signs every request it lets through.
// The Worker checks that signature itself, so the panel stays shut even if Access is switched off or the route is wrong.
// Needs two settings: ACCESS_TEAM_DOMAIN (such as bodhilabs.cloudflareaccess.com) and ACCESS_AUD (the Access app's tag).
const decode = (s) => Uint8Array.from(atob(s.replaceAll("-", "+").replaceAll("_", "/")), (c) => c.charCodeAt(0));
const parse = (s) => JSON.parse(new TextDecoder().decode(decode(s)));

let cache = { team: "", at: 0, keys: [] };
async function keysFor(team, now, fetcher) {
  if (cache.team === team && now - cache.at < 3600000) return cache.keys;
  const res = await fetcher(`https://${team}/cdn-cgi/access/certs`);
  if (!res.ok) return [];
  cache = { team, at: now, keys: (await res.json()).keys ?? [] };
  return cache.keys;
}

/** The email of the signed-in admin, or null when the request did not come through Access. */
export async function accessEmail(req, env, now = Date.now(), fetcher = fetch) {
  // On a developer's own machine only (.dev.vars), the panel opens without Access.
  if (env.ADMIN_DEV === "yes" && ["localhost", "127.0.0.1"].includes(new URL(req.url).hostname)) return "dev@localhost";
  const team = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  const token = req.headers.get("cf-access-jwt-assertion");
  if (!team || !aud || !token) return null;
  try {
    const [h, p, s] = token.split(".");
    const head = parse(h);
    const claims = parse(p);
    if (head.alg !== "RS256") return null;
    const jwk = (await keysFor(team, now, fetcher)).find((k) => k.kid === head.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decode(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    if (![].concat(claims.aud).includes(aud) || claims.iss !== `https://${team}` || !(claims.exp * 1000 > now)) return null;
    return claims.email || null;
  } catch {
    return null;
  }
}

// The passcode way in, made for a phone: the owner sets a passcode as the Worker secret ADMIN_KEY, types it once,
// and the phone keeps a cookie for a year. Changing the passcode signs every phone out.
const COOKIE = "bl_admin";
const TRIES = 20; // wrong passcodes allowed per day, over all phones, before the door stays shut until tomorrow
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, "0")).join("");
const same = (a, b) => { let d = a.length ^ b.length; for (let i = 0; i < a.length && i < b.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
const usable = (env) => typeof env.ADMIN_KEY === "string" && env.ADMIN_KEY.length >= 8;
const token = (env) => sha(`bodhilabs-admin|${env.ADMIN_KEY}`);

/** True when the request carries the cookie that a right passcode gave. */
export async function passOk(req, env) {
  if (!usable(env)) return false;
  const got = (req.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? "";
  return same(got, await token(env));
}

const page = (note = "", status = 200) => new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>CubeGullak admin</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#eaf4ff;color:#14174a;font:18px system-ui,sans-serif}form{display:flex;flex-direction:column;gap:14px;width:min(320px,86vw)}
input,button{font:inherit;padding:16px;border-radius:16px;border:2px solid #14174a}button{background:#ffc531;font-weight:700}p{margin:0;color:#a11}</style></head>
<body><form method="post" action="/admin"><b>CubeGullak admin</b><input type="password" name="key" placeholder="Passcode" autocomplete="current-password" required autofocus><button>Open</button><p>${note}</p></form></body></html>`,
  { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });

/** GET shows the passcode box. POST checks the passcode and, when right, gives the cookie and opens the panel. */
export async function passLogin(req, env, now = Date.now()) {
  if (!usable(env)) return new Response("Not allowed.", { status: 403, headers: { "cache-control": "no-store" } });
  if (req.method !== "POST") return page();
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return page("", 403);
  const key = `admin/fail/${new Date(now + 19800000).toISOString().slice(0, 10)}`;
  const fails = Number((await env.VOICE?.get(key)) ?? 0);
  if (fails >= TRIES) return page("Too many wrong tries. Try again tomorrow.", 429);
  const typed = String((await req.formData().catch(() => null))?.get("key") ?? "");
  if (!same(await sha(`bodhilabs-admin|${typed}`), await token(env))) {
    await env.VOICE?.put(key, String(fails + 1), { expirationTtl: 172800 });
    return page("Wrong passcode.", 401);
  }
  return new Response(null, { status: 303, headers: { location: "/admin", "cache-control": "no-store", "set-cookie": `${COOKIE}=${await token(env)}; Path=/admin; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax` } });
}
