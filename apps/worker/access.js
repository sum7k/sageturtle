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
