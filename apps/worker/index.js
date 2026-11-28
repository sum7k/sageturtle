// The server side of BodhiLabs, one Cloudflare Worker. The app itself is static files; this answers only:
//   GET  /api/where     the Indian state the request comes from, to pre-select a language
//   POST /api/register  a phone chooses its language (or later adds its place and work)
//   POST /api/tap       taps on Home's buttons, and which pictures were shown
//   GET  /api/voice     one recorded word, letter or greeting (worker/voice.js)
//   GET  /admin         the admin panel, behind Cloudflare Access
import { TRACKED } from "../lib/buttons.js";
import { LANGS } from "../lib/langs.js";
import { VARIANTS, validCombo } from "../lib/variants.js";
import { accessEmail } from "./access.js";
import { adminPage } from "./admin.js";
import { voice } from "./voice.js";

const MAX_BODY = 4096;
const MAX_TAPS = 500; // the most taps on one button that one message may carry

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const bad = (error, status = 400) => json({ error }, status);

/** Today in India, as YYYY-MM-DD. `back` is how many days ago. */
export const istDay = (now = Date.now(), back = 0) => new Date(now + 19800000 - back * 86400000).toISOString().slice(0, 10);

async function body(req) {
  const text = await req.text();
  if (text.length > MAX_BODY) return null;
  try {
    const b = JSON.parse(text);
    return b && typeof b === "object" && !Array.isArray(b) ? b : null;
  } catch {
    return null;
  }
}

const knownUser = (db, id) => (typeof id === "string" && id.length === 36 ? db.prepare("SELECT id FROM users WHERE id = ?").bind(id).first() : null);

async function register(req, env, now) {
  const b = await body(req);
  if (!b) return bad("bad request");
  const lang = LANGS.some((l) => l.id === b.lang) ? b.lang : null;
  // There is no login at the start, so a phone first has only a language. Place and work arrive with registration.
  const pin = !b.pin ? "" : /^\d{6}$/.test(b.pin) ? b.pin : null;
  const none = !Array.isArray(b.variants) || !b.variants.length;
  const variants = none ? [] : validCombo(b.variants) && b.variants.every((v) => VARIANTS.find((x) => x.id === v)?.adult) ? b.variants : null;
  if (!lang || pin === null || !variants) return bad("bad profile");
  const day = istDay(now);
  // A phone that already has an id is changing its profile, not registering again.
  if (b.id && (await knownUser(env.DB, b.id))) {
    await env.DB.prepare("UPDATE users SET lang = ?, pin = ?, variants = ? WHERE id = ?").bind(lang, pin, JSON.stringify(variants), b.id).run();
    return json({ id: b.id });
  }
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO users (id, created_at, created_day, last_day, lang, pin, variants) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(id, now, day, day, lang, pin, JSON.stringify(variants)).run();
  return json({ id });
}

async function tap(req, env, now) {
  const b = await body(req);
  if (!b || !b.taps || typeof b.taps !== "object") return bad("bad request");
  if (!(await knownUser(env.DB, b.user))) return bad("unknown user", 404);
  const day = istDay(now);
  const rows = Object.entries(b.taps).filter(([button, n]) => TRACKED.includes(button) && Number.isInteger(n) && n > 0);
  if (!rows.length) return bad("no taps");
  const add = env.DB.prepare("INSERT INTO taps (day, button, user_id, count) VALUES (?, ?, ?, ?) ON CONFLICT (day, button, user_id) DO UPDATE SET count = count + excluded.count");
  await env.DB.batch([
    ...rows.map(([button, n]) => add.bind(day, button, b.user, Math.min(n, MAX_TAPS))),
    env.DB.prepare("UPDATE users SET last_day = ? WHERE id = ?").bind(day, b.user),
  ]);
  return json({ ok: true });
}

async function admin(req, env, now) {
  const email = await accessEmail(req, env, now);
  if (!email) return new Response("Not allowed. The admin panel opens only through Cloudflare Access.", { status: 403, headers: { "cache-control": "no-store" } });
  return new Response(await adminPage(env.DB, now, email), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}

/** Cloudflare knows roughly where a request comes from. Only the state code is passed on, and nothing is saved. */
const where = (req) => json({ state: req.cf?.country === "IN" ? String(req.cf.regionCode ?? "") : "" });

const POSTS = { "/api/register": register, "/api/tap": tap };

export async function handle(req, env, now = Date.now()) {
  const { pathname } = new URL(req.url);
  if (pathname === "/admin" || pathname === "/admin/") return req.method === "GET" ? admin(req, env, now) : bad("not allowed", 405);
  if (pathname === "/api/where") return where(req);
  if (pathname === "/api/voice") return req.method === "GET" ? voice(req, env) : bad("not allowed", 405);
  if (POSTS[pathname]) return req.method === "POST" ? POSTS[pathname](req, env, now) : bad("not allowed", 405);
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin/")) return bad("not found", 404);
  return env.ASSETS.fetch(req);
}

export default {
  async fetch(req, env) {
    try {
      return await handle(req, env);
    } catch (e) {
      console.error(e);
      return bad("server error", 500);
    }
  },
};
