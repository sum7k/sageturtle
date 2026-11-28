// GET /api/voice?lang=hi&who=woman&text=गाय     one recording, as MP3.
// GET /api/voice?lang=hi&who=woman&life=einstein  a whole life read aloud (lib/lives.js).
// GET /api/voice?lang=hi&who=woman&line=fire.2    one spoken line of a lesson (lib/lessons.js).
// The first time a recording is asked for it is made by Sarvam and saved in Cloudflare KV; after that it is only read.
// So each recording is paid for once. Only the app's own fixed words can be asked for.
import { SARVAM_LANG, SPEAKERS, spoken } from "../lib/voice.js";
import { lifeById } from "../lib/lives.js";
import { lineText } from "../lib/lessons.js";

const MAX = 2500; // the most Sarvam reads in one go
const mark = async (s) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].slice(0, 6).map((b) => b.toString(16).padStart(2, "0")).join("");

const VERSION = "v1"; // change it to make every recording again (new speakers, a new model)
const audio = (bytes) => new Response(bytes, { headers: { "content-type": "audio/mpeg", "cache-control": "public, max-age=31536000, immutable" } });
const none = (status, why) => new Response(why, { status, headers: { "cache-control": "no-store" } });

export async function voice(req, env, fetcher = fetch) {
  const q = new URL(req.url).searchParams;
  const lang = q.get("lang"), who = q.get("who");
  const life = q.has("life") ? lifeById(q.get("life")) : null;
  const line = q.has("line") ? q.get("line") : null;
  const text = q.has("life") ? (life?.text[lang] ?? "").slice(0, MAX) : line !== null ? lineText(line, lang).slice(0, MAX) : q.get("text") ?? "";
  const speakers = SPEAKERS[who];
  if (!speakers || !SARVAM_LANG[lang] || !text || (!life && line === null && !spoken(lang).includes(text))) return none(404, "no such recording");
  if (!env.VOICE) return none(503, "voices are not set up");
  const speaker = speakers[0];
  // A life is saved under its id and a mark of its text, so a corrected text is read afresh.
  // A lesson's line likewise, under its name.
  const key = life ? `${VERSION}/${lang}/${speaker}/life:${life.id}:${await mark(text)}`
    : line !== null ? `${VERSION}/${lang}/${speaker}/line:${line}:${await mark(text)}` : `${VERSION}/${lang}/${speaker}/${text}`;
  const saved = await env.VOICE.get(key, "arrayBuffer");
  if (saved) return audio(saved);
  if (!env.SARVAM_API_KEY) return none(503, "voices are not set up");
  const res = await fetcher("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: { "content-type": "application/json", "api-subscription-key": env.SARVAM_API_KEY },
    body: JSON.stringify({ text, language_code: SARVAM_LANG[lang], model: "bulbul:v3", speaker, pace: life ? 1 : 0.9, output_audio_codec: "mp3" }),
  });
  if (!res.ok) { console.error("sarvam", res.status, (await res.text()).slice(0, 200)); return none(502, "the voice could not be made"); }
  const b64 = (await res.json()).audios?.[0];
  if (!b64) return none(502, "the voice could not be made");
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  await env.VOICE.put(key, bytes);
  return audio(bytes);
}
