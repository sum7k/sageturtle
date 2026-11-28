// The app is read, not heard, with two exceptions for people who cannot read yet: a language tile on the first
// screen says hello in its language, and Gyan says a word or a letter, because hearing it is how reading is taught.
//
// The rule (sumeet, 2026-11-28): everything spoken is heard twice, once in a man's voice and once in a woman's,
// in an Indian accent, because hearing both pitches makes a word easier to catch. Which goes first is random.
// First choice: a recording made once by Sarvam (lib/voice.js). If there is none (no network, Urdu, not set up),
// the phone's own voice speaks instead. A phone does not say whether a voice is a man's or a woman's: where the
// voice's name tells, that voice is used; otherwise the same voice is played lower for the man and higher for the woman.
import { langById } from "./langs.js";
import { loadPrefs, sidesFor } from "./prefs.js";
import { SARVAM_LANG, clipUrl, lifeUrl, lineUrl } from "./voice.js";

const MAN = /\b(male|man|rishi|hemant|ravi|prabhat|madhur|valluvar|mohan|niranjan|manohar|gagan|sukant|midhun|salman|asad|bashkar)\b|-x-(hi[ce]|en[ce]|bn[b]|ta[d]|te[m]|gu[m]|kn[m]|ml[m]|mr[m]|ur[m])-/i;
const WOMAN = /\b(female|woman|lekha|veena|heera|kalpana|swara|neerja|pallavi|tanishaa|aarohi|shruti|dhwani|sapna|sobhana|subhasini|uzma|gul|sangeeta|kanya|isha)\b|-x-(hi[ad]|en[ad]|bn[a]|ta[c]|te[f]|gu[f]|kn[f]|ml[f]|mr[f]|ur[f])-/i;

/**
 * The two ways the phone's own voice speaks one text: a man's voice and a woman's. `voices` are the phone's voices;
 * only those of the language are used, the Indian ones first. With no named voice for a side, pitch stands in for it.
 */
export function pair(voices, locale, random = Math.random()) {
  const base = locale.slice(0, 2).toLowerCase();
  const tag = (v) => (v.lang || "").replace("_", "-").toLowerCase();
  const mine = voices.filter((v) => tag(v).startsWith(base));
  const indian = mine.filter((v) => tag(v).endsWith("-in"));
  const pool = indian.length ? indian : mine;
  const pick = (list) => (list.length ? list[Math.min(list.length - 1, Math.floor(random * list.length))] : null);
  const man = pick(pool.filter((v) => MAN.test(v.name)));
  const woman = pick(pool.filter((v) => WOMAN.test(v.name) && !MAN.test(v.name)));
  const any = pick(pool);
  const both = [
    { who: "man", voice: man ?? any, pitch: man ? 1 : 0.7 },
    { who: "woman", voice: woman ?? any, pitch: woman ? 1 : 1.35 },
  ];
  return random < 0.5 ? both : both.reverse();
}

let player = null; // one player for every recording, so a phone that allowed the first sound allows the next
let turn = 0; // a new call stops the one before it

function playClip(url) {
  return new Promise((done, fail) => {
    player ??= new Audio();
    player.onended = done;
    player.onerror = () => fail(new Error("no recording"));
    player.src = url;
    player.playbackRate = loadPrefs().speed; // after src: a new source sets the rate back to 1
    player.play().catch(fail);
  });
}
function speakPhone(text, locale, { voice, pitch }) {
  return new Promise((done) => {
    const synth = globalThis.speechSynthesis;
    if (!synth) return done();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale;
    if (voice) u.voice = voice;
    u.pitch = pitch;
    u.rate = 0.85 * loadPrefs().speed;
    // Some phones never say that the voice has ended; then the length of the text decides.
    const late = setTimeout(done, 4000 + text.length * 160);
    late.unref?.();
    u.onend = u.onerror = () => { clearTimeout(late); done(); };
    synth.speak(u);
  });
}

/**
 * Speak text aloud in the given language, in both voices. Returns false when nothing can be played.
 * `done` is called once both voices have finished (or at once when nothing can be played); it is not called
 * when a newer call cut this one short.
 */
export function say(text, lang = "en", done = () => {}) {
  if (!text || (typeof Audio === "undefined" && !globalThis.speechSynthesis)) { done(); return false; }
  const mine = ++turn;
  const locale = langById(lang).locale;
  player?.pause();
  globalThis.speechSynthesis?.cancel();
  // Both voices, unless the learner kept one in Settings.
  const sides = sidesFor(pair(globalThis.speechSynthesis?.getVoices?.() ?? [], locale), loadPrefs().voice);
  (async () => {
    for (const side of sides) {
      if (mine !== turn) return;
      try {
        if (!SARVAM_LANG[lang] || typeof Audio === "undefined") throw new Error("no recording");
        await playClip(clipUrl(lang, side.who, text));
      } catch {
        if (mine === turn) await speakPhone(text, locale, side);
      }
    }
    if (mine === turn) done();
  })();
  return true;
}

/** Stop whatever is being spoken. */
export function hush() {
  turn++;
  player?.pause();
  globalThis.speechSynthesis?.cancel();
}

/**
 * Read a whole life aloud, once, in a man's or a woman's voice (a random one). `done` is called when it ends or
 * is stopped. The recording first; the phone's own voice when there is none.
 */
export function sayLife(life, lang, done = () => {}) {
  hush();
  const mine = turn;
  const text = life.text[lang];
  if (!text || (typeof Audio === "undefined" && !globalThis.speechSynthesis)) { done(); return false; }
  const locale = langById(lang).locale;
  const side = sidesFor(pair(globalThis.speechSynthesis?.getVoices?.() ?? [], locale), loadPrefs().voice)[0];
  (async () => {
    try {
      if (!SARVAM_LANG[lang] || typeof Audio === "undefined") throw new Error("no recording");
      await playClip(lifeUrl(lang, side.who, life.id));
    } catch {
      if (mine === turn) await speakPhone(text, locale, { ...side, pitch: 1 });
    }
    if (mine === turn) done();
  })();
  return true;
}

/**
 * Speak one line of a lesson, once. `who` is "man" or "woman": a lesson keeps one voice from start to end.
 * `url` is the line's recording (lineUrl); the phone's own voice speaks `text` when there is none.
 * `done` is called when the line ends; not when a newer call or hush() cut it short.
 */
export function sayLine(id, text, lang, who, done = () => {}) {
  hush();
  const mine = turn;
  if (!text || (typeof Audio === "undefined" && !globalThis.speechSynthesis)) { done(); return false; }
  const locale = langById(lang).locale;
  const side = pair(globalThis.speechSynthesis?.getVoices?.() ?? [], locale, 0).find((s) => s.who === who);
  (async () => {
    try {
      if (!SARVAM_LANG[lang] || typeof Audio === "undefined") throw new Error("no recording");
      await playClip(lineUrl(lang, who, id));
    } catch {
      if (mine === turn) await speakPhone(text, locale, side);
    }
    if (mine === turn) done();
  })();
  return true;
}

/**
 * Speak a text that has no recording (an answer written on the phone, lib/mind.js), once, in the phone's own voice.
 * `done` is called when it ends; not when a newer call or hush() cut it short.
 */
export function sayOwn(text, lang, who = "woman", done = () => {}) {
  hush();
  const mine = turn;
  if (!text || !globalThis.speechSynthesis) { done(); return false; }
  const locale = langById(lang).locale;
  const side = pair(globalThis.speechSynthesis.getVoices?.() ?? [], locale, 0).find((s) => s.who === who);
  speakPhone(text, locale, side).then(() => { if (mine === turn) done(); });
  return true;
}
