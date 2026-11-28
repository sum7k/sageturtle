// Recorded voices (sumeet, 2026-11-28). The app calls no voice service while it runs, and holds no voice key.
// Fixed things (lesson lines, lives, words, letters, greetings) may have a recording made beforehand, once, and
// kept as a small file (AAC, .m4a) in public/voice; the app plays it when there is one. Everything else, and everything not
// recorded yet, is spoken by the phone's own voice (lib/speak.js). For testing they are made on a Mac with its own
// voices (`npm run voices -- make hi`); ElevenLabs is to be used once, in a final round, by the same script.
// The rule (sumeet, 2026-11-28): everything is heard in a man's voice and in a woman's.
// This file is read by the app and by the Worker.
import { WORDS, lettersFor } from "./book.js";
import { LANGS } from "./langs.js";
import RECORDED_LIST from "./recorded.js";

const RECORDED = new Set(RECORDED_LIST);

export const WHO = ["man", "woman"];

/** A short mark of a text (FNV-1a, 8 hex digits): a recording is named by it, so a changed text is not played with an old recording. */
export function mark(text) {
  let h = 0x811c9dc5;
  for (const c of new TextEncoder().encode(text)) { h ^= c; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

/**
 * Where the recording of a text is kept, under public/voice: `kind` is "line" (a lesson's line, by its id such as
 * fire.2), "life" (a whole life, by its id) or "word" (a word, letter or greeting, by its text alone).
 */
export const recordingPath = (lang, who, kind, id, text) =>
  `/voice/${lang}/${kind === "word" ? "word" : `${kind}-${id}`}.${who}.${mark(text)}.m4a`;

/** The recording to play, or null when none is made yet (then the phone's own voice speaks). */
export const recordingOf = (lang, who, kind, id, text) => {
  const path = recordingPath(lang, who, kind, id, text);
  return RECORDED.has(path) ? path : null;
};
/** Everything the app may speak in a language. The Worker makes a recording only for these, never for other text. */
export function spoken(lang) {
  const l = LANGS.find((x) => x.id === lang);
  if (!l || !WORDS[lang]) return [];
  return [...new Set([l.hello, ...Object.values(WORDS[lang]), ...lettersFor(lang)])];
}
