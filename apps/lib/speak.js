// The app is read, not heard. The one place that speaks is Book, where hearing a letter is how reading is taught.
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
