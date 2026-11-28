// The app is read, not heard, with two exceptions for people who cannot read yet: a language tile on the first
// screen says hello in its language, and Book says a word or a letter, because hearing it is how reading is taught.
// It uses the phone's own voice, which costs nothing and needs no network.
import { langById } from "./langs.js";

/** Speak text aloud in the given language. Returns false when the phone cannot speak. */
export function say(text, lang = "en") {
  const synth = globalThis.speechSynthesis;
  if (!synth || !text) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langById(lang).locale;
  u.rate = 0.85;
  synth.cancel();
  synth.speak(u);
  return true;
}
