// Recorded voices. The words, letters, greetings, lesson lines and lives the app speaks are fixed, so each is made
// once by ElevenLabs (model Eleven v3, which speaks all twelve of our languages), saved on Cloudflare, and played
// from there ever after. Sarvam was used before; sumeet found its voice too poor (2026-11-28).
// The rule (sumeet, 2026-11-28): everything is heard in a man's voice and in a woman's.
// This file is read by the app and by the Worker.
import { WORDS, lettersFor } from "./book.js";
import { LANGS } from "./langs.js";

/** The model, and its code for each of our languages (ISO 639-1). Eleven v3 lists all twelve. */
export const MODEL = "eleven_v3";
export const VOICE_LANG = { hi: "hi", en: "en", bn: "bn", mr: "mr", te: "te", ta: "ta", gu: "gu", ur: "ur", kn: "kn", or: "or", ml: "ml", pa: "pa" };
/**
 * The two voices, from the ElevenLabs voice library: calm Indian teachers, used for every language (the model
 * carries a voice into each language). Prashant, "warm, clear Hindi explainer", and Anjali, "friendly EdTech
 * teacher". The Worker secrets ELEVENLABS_VOICE_MAN and ELEVENLABS_VOICE_WOMAN, when set, replace them.
 */
export const SPEAKERS = { man: ["j7yQHuKNC1hdt1LBPAks"], woman: ["Kfn3fYy8XcPyUvbTxn1H"] };
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
/** The address of one spoken line of a lesson, by its name such as "fire.2" (lib/lessons.js). */
export const lineUrl = (lang, who, id) => `/api/voice?lang=${lang}&who=${who}&line=${id}`;
