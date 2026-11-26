// Every screen and control speaks. Nothing is written as an instruction.
import { langById } from "./langs.js";
import { LINES } from "./lines.js";

/** The spoken line for a key in the person's language. English is the base when a language has no line yet. */
export function line(key, lang) {
  return LINES[lang]?.[key] ?? LINES.en[key] ?? "";
}

export function stop() {
  globalThis.speechSynthesis?.cancel();
}

/** Speak text aloud in the given language. Returns false when the phone cannot speak. */
export function say(text, lang = "en", onEnd) {
  const synth = globalThis.speechSynthesis;
  if (!synth || !text) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langById(lang).speech;
  u.rate = 0.95;
  if (onEnd) u.onend = u.onerror = onEnd;
  synth.cancel();
  synth.speak(u);
  return true;
}
export const sayLine = (key, lang) => say(line(key, lang), lang);
