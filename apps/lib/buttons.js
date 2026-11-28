// What can be counted. A tap is sent to the server only under one of these names (lib/track.js, worker/index.js).
import { SUBJECTS } from "./subjects.js";
import { TOP } from "./top.js";
import { WORD_HOUSES } from "./word.js";
import { CENTRE } from "./grid.js";
import { LIFE_IDS } from "./lives.js";
import { LESSON_IDS } from "./lessons.js";

export const BOOK = { id: "book", href: "/book" }; // the word game, house 3 of Word
export const WORD = { id: "word", href: "/word" }; // Word, the subject
export const LIFE = { id: "lives" }; // Lives (जीवनी), the twelfth subject

/** The name a press on a box is counted under. `level` is "top" (Home), "gyan" (the subjects) or "word". */
export function tapName(level, box) {
  if (level === "top") return box.id; // "gyan", "vartaman", "top:3" to "top:12"
  if (level === "gyan") return box.id === "word" ? WORD.id : box.id === LIFE.id ? LIFE.id : `subject:${box.id}`;
  return box.open === BOOK.href ? BOOK.id : `word:${box.id}`;
}

export const TRACKED = [
  ...TOP.map((t) => tapName("top", t)),
  ...SUBJECTS.map((s) => tapName("gyan", s)),
  ...WORD_HOUSES.map((h) => tapName("word", h)),
  ...CENTRE.map((c) => `centre:${c.id}`),
  ...LIFE_IDS.map((l) => `life:${l}`),
  ...LESSON_IDS.flatMap((l) => [`lesson:${l}`, `watched:${l}`]), // a lesson opened, and seen to its end
  "heard", "answer", "right",
];
export const COUNTED = ["visit", "install"];
