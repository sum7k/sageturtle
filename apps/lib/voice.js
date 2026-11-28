// Recorded voices. The words, letters and greetings the app speaks are fixed, so each is made once by Sarvam AI's
// Bulbul voices (an Indian company, Indian accents), saved on Cloudflare, and played from there ever after.
// The rule (sumeet, 2026-11-28): everything is heard in a man's voice and in a woman's.
// This file is read by the app and by the Worker.
import { WORDS, lettersFor } from "./book.js";
import { LANGS } from "./langs.js";

/** Sarvam's name for each of our languages. Urdu is missing: Sarvam does not speak it, so the phone's voice does. */
export const SARVAM_LANG = { hi: "hi-IN", en: "en-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", gu: "gu-IN", kn: "kn-IN", or: "od-IN", ml: "ml-IN", pa: "pa-IN" };
/** The speakers. These two are the ones Sarvam shows in all of its languages. More can be added to a list. */
export const SPEAKERS = { man: ["shubh"], woman: ["ishita"] };
export const WHO = Object.keys(SPEAKERS);

/** Everything the app may speak in a language. The Worker makes a recording only for these, never for other text. */
export function spoken(lang) {
  const l = LANGS.find((x) => x.id === lang);
  if (!l || !WORDS[lang]) return [];
  return [...new Set([l.hello, ...Object.values(WORDS[lang]), ...lettersFor(lang)])];
}

/** The address of one recording. */
export const clipUrl = (lang, who, text) => `/api/voice?lang=${lang}&who=${who}&text=${encodeURIComponent(text)}`;
/** The address of a whole life read aloud (lib/lives.js). */
export const lifeUrl = (lang, who, id) => `/api/voice?lang=${lang}&who=${who}&life=${id}`;
