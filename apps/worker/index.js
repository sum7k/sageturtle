// The server side of BodhiLabs, one Cloudflare Worker. The app itself is static files; this answers only:
//   GET  /api/where     the Indian state the request comes from, to pre-select a language
//   POST /api/register  a phone chooses its language (or later adds its place and work)
//   POST /api/tap       taps on Home's buttons, and which pictures were shown
//   POST /api/count     a visit or an install, counted without knowing who
//   GET  /api/voice     one recorded word, letter or greeting (worker/voice.js)
//   POST /api/ask       a learner's question; GET /api/ask gives that phone's questions and answers (worker/ask.js)
//   POST /api/answer    an answer written from lines of our lessons by a model on Cloudflare (worker/answer.js)
//   GET  /admin         the admin panel, behind a passcode or Cloudflare Access (POST /admin signs in)
//   POST /admin/reply   the owner answers a question
import { TRACKED, COUNTED } from "../lib/buttons.js";
import { LANGS } from "../lib/langs.js";
import { VARIANTS, validCombo } from "../lib/variants.js";
import { accessEmail, passOk, passLogin } from "./access.js";
import { adminPage } from "./admin.js";
import { voice } from "./voice.js";
import { ask, mine, reply } from "./ask.js";
import { answer } from "./answer.js";

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
  // Where the phone is comes from Cloudflare (a state in India, else the country). Who sent it comes from the phone.
  const state = String((req.cf?.country === "IN" ? req.cf.regionCode : req.cf?.country) ?? "").slice(0, 8);
  const ref = typeof b.ref === "string" && /^[a-z0-9._-]{1,60}$/.test(b.ref) ? b.ref : "";
  await env.DB.prepare("INSERT INTO users (id, created_at, created_day, last_day, lang, pin, variants, state, ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, now, day, day, lang, pin, JSON.stringify(variants), state, ref).run();
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

async function count(req, env, now) {
  const b = await body(req);
  if (!b || !COUNTED.includes(b.name)) return bad("bad request");
  await env.DB.prepare("INSERT INTO counts (day, name, n) VALUES (?, ?, 1) ON CONFLICT (day, name) DO UPDATE SET n = n + 1").bind(istDay(now), b.name).run();
  return json({ ok: true });
}

/** Who is opening the admin panel: "passcode", the email from Cloudflare Access, or null. */
const owner = async (req, env, now) => ((await passOk(req, env)) ? "passcode" : accessEmail(req, env, now));

async function admin(req, env, now) {
  const email = await owner(req, env, now);
  if (!email && env.ADMIN_KEY) return passLogin(req, env, now);
  if (!email) return new Response("Not allowed. The admin panel is not set up yet.", { status: 403, headers: { "cache-control": "no-store" } });
  return new Response(await adminPage(env.DB, now, email), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}

/** Cloudflare knows roughly where a request comes from. Only the state code is passed on, and nothing is saved. */
const where = (req) => json({ state: req.cf?.country === "IN" ? String(req.cf.regionCode ?? "") : "" });

const POSTS = { "/api/register": register, "/api/tap": tap, "/api/count": count, "/api/ask": ask, "/api/answer": answer };

export async function handle(req, env, now = Date.now()) {
  const { pathname } = new URL(req.url);
  if (pathname === "/admin" || pathname === "/admin/") return req.method === "GET" ? admin(req, env, now) : req.method === "POST" ? passLogin(req, env, now) : bad("not allowed", 405);
  if (pathname === "/admin/reply") {
    if (req.method !== "POST") return bad("not allowed", 405);
    return (await owner(req, env, now)) ? reply(req, env, now) : bad("not allowed", 403);
  }
  if (pathname === "/api/where") return where(req);
  if (pathname === "/api/ask" && req.method === "GET") return mine(req, env);
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
