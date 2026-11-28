// What can be counted. A tap is sent to the server only under one of these names (lib/track.js, worker/index.js).
import { SUBJECTS } from "./subjects.js";
import { WORD_HOUSES } from "./word.js";
import { CENTRE } from "./grid.js";
import { LIFE_IDS } from "./lives.js";

export const BOOK = { id: "book", href: "/book" }; // the word game, house 3 of Word
export const WORD = { id: "word", href: "/word" }; // Word, the subject
export const LIFE = { id: "lives" }; // Lives (जीवनी), the twelfth subject

/** The name a press on a box is counted under. `level` is "home" or "word". */
export function tapName(level, box) {
  if (level === "home") return box.id === "word" ? WORD.id : box.id === LIFE.id ? LIFE.id : `subject:${box.id}`;
  return box.open === BOOK.href ? BOOK.id : `word:${box.id}`;
}

export const TRACKED = [
  ...SUBJECTS.map((s) => tapName("home", s)),
  ...WORD_HOUSES.map((h) => tapName("word", h)),
  ...CENTRE.map((c) => `centre:${c.id}`),
  ...LIFE_IDS.map((l) => `life:${l}`),
  "heard", "answer", "right",
];
export const COUNTED = ["visit", "install"];
