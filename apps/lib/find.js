// Answers from our own lessons, found on the phone. The learner asks anything; the phone looks through the lines of
// the lessons (lib/lessons.js) and gives back the line that fits best, with its drawing and its recorded voice.
// Nothing is sent anywhere and nothing is downloaded: this is plain word matching, so it works on every phone and in
// every language the lessons are written in. It is the "retrieval" half of the plan; a small language model that
// puts the found lines into its own words (lib/mind.js) is the optional second half.
//
// How it matches: every line is cut into words, and every word into pieces of three letters, so that near spellings
// add to the score. A word that is in few lines counts for more than one that is in many (BM25). An answer is given
// only when a telling word of the question is in the line, as itself or in another form (जलती, जलता, जलने). It is
// "sure" when most of the telling words are there; otherwise it is only the nearest thing we know, and the question
// also goes to a person (lib/ask.js).
//
// Size: one line is about 100 bytes. A stage's lines are read into the index the first time a question is asked.
// When all twelve stages are written, the lines are loaded stage by stage (the learner's own stage and those below).
import { LESSONS, lessonLang, lineId } from "./lessons.js";

const K1 = 1.2, B = 0.75; // the usual BM25 numbers
const WORD_WEIGHT = 2; // a whole word that matches counts twice as much as one of its pieces
const COMMON = 0.34; // a word found in more than a third of the lines tells nothing (है, the, is)
const SURE = 0.6; // an answer is sure when this share of the question's telling words is in the line

/** The words of a text: letters and their marks only, lower case. Works for every script we use. */
export function words(text) {
  return String(text ?? "").normalize("NFC").toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
}
/** The pieces of three letters in a word, with its edges marked: "आग" gives "^आग", "आग$". */
export function pieces(word) {
  const w = [..."^" + word + "$"];
  if (w.length <= 3) return [w.join("")];
  const out = [];
  for (let i = 0; i + 3 <= w.length; i++) out.push(w.slice(i, i + 3).join(""));
  return out;
}
/** A word without its vowel signs: जलता and जलती both give जलत. Scripts with no such signs are left as they are. */
const bones = (word) => [...word.normalize("NFD").replace(/\p{M}/gu, "")];
/**
 * Are two words forms of one word (जलता, जलने; eat, eats; நெருப்பு, நெருப்பில்)? They are when they begin alike.
 * Where vowels are signs (the Indian scripts): all but the last letter of the shorter word, never fewer than two,
 * and four are always enough. Elsewhere (English): the whole of the shorter word, or five letters.
 * No dictionary, so it serves every language, and it errs now and then.
 */
export function same(a, b) {
  if (a === b) return true;
  const x = bones(a), y = bones(b);
  const plain = x.length === [...a].length && y.length === [...b].length;
  const shorter = Math.min(x.length, y.length);
  let n = 0;
  while (n < x.length && n < y.length && x[n] === y[n]) n++;
  return n >= (plain ? Math.min(5, shorter) : Math.min(4, Math.max(shorter - 1, 2)));
}

// Words that ask or join and tell nothing about the subject. Lines are few today, so counting cannot find these yet;
// as the lessons grow, COMMON does this work for every language and these two lists matter less.
const STOP = {
  hi: "क्या क्यों क्यूँ कैसे कैसा कैसी कब कहाँ कहां कौन कितना कितने कितनी किस है हैं था थे थी हो होता होती होते हूँ का की के को से में पर ने और भी तो ही यह वह ये वो हम मैं मुझे तुम आप एक बहुत नहीं कर करते करता करती बताओ बता मेरा मेरी मेरे होगा होगी".split(" "),
  en: "what why how when where who which is are was were be do does did the a an of to in on at for and or it its this that these those we i me my you your our us can have has had tell about with from not very many much".split(" "),
};
/** Every line a learner can be answered with, in one language. `upTo` leaves out the stages above the learner's. */
export function passages(lang, { lessons = LESSONS, upTo = Infinity } = {}) {
  const out = [];
  for (const lesson of lessons) {
    if (lesson.stage > upTo) continue;
    const heardIn = lessonLang(lesson, lang);
    if (heardIn !== lang) continue; // a question in Tamil cannot be matched to English lines by their words
    lesson.scenes.forEach((scene, i) => out.push({ id: lineId(lesson, i), lesson: lesson.id, scene: i, art: scene.art, prop: scene.prop, who: lesson.who, lang, text: scene.say[lang] }));
  }
  return out;
}

/** Make the index for a list of passages. */
export function index(list) {
  const docs = list.map((p) => {
    const ws = words(p.text);
    const terms = new Map();
    for (const w of ws) {
      terms.set(w, (terms.get(w) ?? 0) + WORD_WEIGHT);
      for (const piece of pieces(w)) terms.set(piece, (terms.get(piece) ?? 0) + 1);
    }
    return { passage: p, words: new Set(ws), terms, length: ws.length };
  });
  const seen = new Map(); // in how many lines a word or a piece is
  for (const d of docs) for (const t of d.terms.keys()) seen.set(t, (seen.get(t) ?? 0) + 1);
  const mean = docs.reduce((n, d) => n + d.length, 0) / (docs.length || 1);
  return { docs, seen, mean };
}

const weight = (ix, term) => {
  const n = ix.seen.get(term) ?? 0;
  return n ? Math.log(1 + (ix.docs.length - n + 0.5) / (n + 0.5)) : 0;
};

/**
 * The lines that fit a question, best first, at most `most`. Each is { passage, score, hit, sure }: `hit` are the
 * telling words of the question found in the line, and `sure` says that most of them were. Empty when none was.
 */
export function find(ix, question, most = 3, lang = ix.docs[0]?.passage.lang) {
  const stop = new Set(STOP[lang] ?? []);
  const telling = (w) => !stop.has(w) && (ix.seen.get(w) ?? 0) / ix.docs.length <= COMMON;
  const asked = [...new Set(words(question))].filter(telling);
  if (!asked.length || !ix.docs.length) return [];
  const out = [];
  for (const d of ix.docs) {
    let score = 0;
    const count = (term, times) => {
      const tf = d.terms.get(term);
      if (!tf) return;
      score += times * weight(ix, term) * (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * d.length / ix.mean));
    };
    const hit = [];
    for (const w of asked) {
      count(w, WORD_WEIGHT);
      for (const piece of pieces(w)) count(piece, 1);
      if ([...d.words].some((x) => telling(x) && same(x, w))) hit.push(w);
    }
    if (hit.length) out.push({ passage: d.passage, score: score * hit.length, hit, sure: hit.length / asked.length >= SURE });
  }
  return out.sort((a, b) => b.sure - a.sure || b.score - a.score).slice(0, most);
}

const made = new Map(); // one index per language and stage, made the first time it is needed
/**
 * Ask the lessons a question in the learner's language. Lessons not yet written in it are searched in English.
 * `upTo` is the learner's stage: only lines of that stage and the ones behind it can answer, never a stage ahead.
 */
export function answer(question, lang, most = 3, { lessons = LESSONS, upTo = Infinity } = {}) {
  for (const l of lang === "en" ? ["en"] : [lang, "en"]) {
    const key = lessons === LESSONS ? `${l}:${upTo}` : null; // only the app's own lessons are kept
    const ix = (key && made.get(key)) || index(passages(l, { lessons, upTo }));
    if (key) made.set(key, ix);
    const got = find(ix, question, most, l);
    if (got.length) return got;
  }
  return [];
}
