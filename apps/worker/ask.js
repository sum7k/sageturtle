// The "?" box.
//   POST /api/ask {user, text}     a learner sends a question (at most five a day)
//   GET  /api/ask?user=<id>        that phone's questions and their answers, newest first
//   POST /admin/reply (form)       the owner answers one, from the admin panel
import { MAX_QUESTION } from "../lib/ask.js";

const PER_DAY = 5;
const MAX_REPLY = 2000;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const day = (now) => new Date(now + 19800000).toISOString().slice(0, 10);
const user = (db, id) => (typeof id === "string" && id.length === 36 ? db.prepare("SELECT id, lang FROM users WHERE id = ?").bind(id).first() : null);

export async function ask(req, env, now) {
  let b = null;
  try { const raw = await req.text(); if (raw.length <= 4096) b = JSON.parse(raw); } catch {}
  const text = typeof b?.text === "string" ? b.text.trim() : "";
  if (!text || text.length > MAX_QUESTION) return json({ error: "bad request" }, 400);
  const who = await user(env.DB, b.user);
  if (!who) return json({ error: "unknown user" }, 404);
  const today = day(now);
  const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM questions WHERE user_id = ? AND day = ?").bind(who.id, today).first();
  if (n >= PER_DAY) return json({ error: "too many today" }, 429);
  await env.DB.prepare("INSERT INTO questions (created_at, day, user_id, lang, text) VALUES (?, ?, ?, ?, ?)").bind(now, today, who.id, who.lang, text).run();
  return json({ ok: true });
}

export async function mine(req, env) {
  const who = await user(env.DB, new URL(req.url).searchParams.get("user"));
  if (!who) return json({ error: "unknown user" }, 404);
  const { results } = await env.DB.prepare("SELECT id, day, text, reply FROM questions WHERE user_id = ? ORDER BY id DESC LIMIT 20").bind(who.id).all();
  return json({ questions: results });
}

/** The owner's answer. The caller has already checked that this is the owner. An empty answer takes an answer back. */
export async function reply(req, env, now) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return new Response("Not allowed", { status: 403 });
  const form = await req.formData().catch(() => null);
  const id = Number(form?.get("id"));
  const text = String(form?.get("reply") ?? "").trim().slice(0, MAX_REPLY);
  if (!Number.isInteger(id) || id < 1) return new Response("Bad request", { status: 400 });
  await env.DB.prepare("UPDATE questions SET reply = ?, replied_at = ? WHERE id = ?").bind(text, text ? now : 0, id).run();
  return new Response(null, { status: 303, headers: { location: "/admin#questions", "cache-control": "no-store" } });
}
