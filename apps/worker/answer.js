// POST /api/answer {user, text, lang, lines}   one or two sentences that answer a learner's question, written by a
// language model on Cloudflare (Workers AI) from lines of our own lessons, and from nothing else.
// The phone finds the lines itself (lib/find.js) and sends only their names, such as "fire.4"; the words of the lines
// are read here from lib/lessons.js, so nothing but our own material can ever be put before the model.
// This is the stand-in for the small model on the phone (lib/mind.js) until that is downloaded, and on phones that
// cannot run one. An answer to the same question from the same lines is written once and kept, so it is paid for once.
// A phone may have ANSWERS_PER_DAY freshly written answers a day; past that, the phone shows the found line itself.
import { MAX_QUESTION } from "../lib/ask.js";
import { words } from "../lib/find.js";
import { LANGS } from "../lib/langs.js";
import { lineText } from "../lib/lessons.js";
import { prompt, tidy } from "../lib/mind.js";

// Gemma 3 12B: writes the Indian languages well for its price. About 250 words in and 60 out for one answer comes to
// about 11 neurons, a hundredth of a rupee; Cloudflare gives 10,000 neurons a day free, about 900 answers.
export const CLOUD_MODEL = "@cf/google/gemma-3-12b-it";
export const ANSWERS_PER_DAY = 20;
const MAX_LINES = 5;
const COUNT = "cloud"; // the name these are counted under in `taps`; only the server writes it
const VERSION = "v1"; // change it to write every kept answer again (a new model, a new prompt)
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const day = (now) => new Date(now + 19800000).toISOString().slice(0, 10);
const mark = async (s) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");

export async function answer(req, env, now) {
  let b = null;
  try { const raw = await req.text(); if (raw.length <= 4096) b = JSON.parse(raw); } catch {}
  const text = typeof b?.text === "string" ? b.text.trim() : "";
  const lang = LANGS.some((l) => l.id === b?.lang) ? b.lang : null;
  const ids = Array.isArray(b?.lines) ? b.lines.filter((x) => typeof x === "string").slice(0, MAX_LINES) : [];
  const lines = ids.map((id) => lineText(id, lang)).filter(Boolean);
  if (!text || text.length > MAX_QUESTION || !lang || !lines.length) return json({ error: "bad request" }, 400);
  const who = typeof b.user === "string" && b.user.length === 36 ? await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(b.user).first() : null;
  if (!who) return json({ error: "unknown user" }, 404);

  // The same words asked of the same lines have the same answer, whoever asks.
  const key = `answer/${VERSION}/${lang}/${await mark([words(text).join(" "), ...ids, ...lines].join("|"))}`;
  const kept = await env.VOICE?.get(key);
  if (kept !== null && kept !== undefined) return json({ text: kept });

  if (!env.AI) return json({ error: "answers are not set up" }, 503);
  const today = day(now);
  const used = await env.DB.prepare("SELECT count FROM taps WHERE day = ? AND button = ? AND user_id = ?").bind(today, COUNT, who.id).first();
  if ((used?.count ?? 0) >= ANSWERS_PER_DAY) return json({ error: "too many today" }, 429);
  await env.DB.prepare("INSERT INTO taps (day, button, user_id, count) VALUES (?, ?, ?, 1) ON CONFLICT (day, button, user_id) DO UPDATE SET count = count + 1").bind(today, COUNT, who.id).run();

  let out;
  try {
    out = await env.AI.run(CLOUD_MODEL, { messages: prompt(text, lines, lang), max_tokens: 120, temperature: 0.2 });
  } catch (e) {
    console.error("workers ai", e);
    return json({ error: "the answer could not be written" }, 502);
  }
  const written = tidy(out?.response ?? out?.choices?.[0]?.message?.content);
  await env.VOICE?.put(key, written); // "" is kept too: the lines did not answer it, and will not the next time either
  return json({ text: written });
}
