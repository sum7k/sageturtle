// What can be counted. A tap is sent to the server only under one of these names (lib/track.js, worker/index.js).
import { SUBJECTS } from "./subjects.js";
import { TOP } from "./top.js";
import { CENTRE } from "./grid.js";
import { LIFE_IDS } from "./lives.js";
import { LESSON_IDS } from "./lessons.js";

export const BOOK = { id: "book", href: "/book" }; // the word game: Word at stage 3
export const WORD = { id: "word", href: "/word" }; // Word, where nothing is made for the stage yet
export const LIFE = { id: "lives" }; // Lives (जीवनी), the twelfth subject

/** The name a press on a box is counted under. `level` is "top" (Home), "gyan" (the stages) or "stage" (the subjects). */
export function tapName(level, box) {
  if (level === "top" || level === "gyan") return box.id; // "gyan", "vartaman", "top:3"; "stage:1" to "stage:12"
  if (box.id === "word") return box.open === BOOK.href ? BOOK.id : WORD.id;
  return box.id === LIFE.id ? LIFE.id : `subject:${box.id}`;
}

export const TRACKED = [
  ...TOP.map((t) => tapName("top", t)),
  ...Array.from({ length: 12 }, (_, i) => `stage:${i + 1}`),
  ...SUBJECTS.map((s) => tapName("stage", s)), BOOK.id,
  ...CENTRE.map((c) => `centre:${c.id}`),
  ...LIFE_IDS.map((l) => `life:${l}`),
  ...LESSON_IDS.flatMap((l) => [`lesson:${l}`, `watched:${l}`]), // a lesson opened, and seen to its end
  "ask:found", "ask:near", "ask:none", // a question the lessons answered, half answered, or could not (lib/find.js)
  "heard", "answer", "right",
];
export const COUNTED = ["visit", "install"];
