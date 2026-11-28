// Gyan is walked by stage, not by topic (sumeet, 2026-11-28). Inside Gyan are the twelve stages of the path
// (gyan/docs/syllabus-map.md): the time before school, then class 1 to class 11. A learner is at one stage. That
// stage and the ones behind it are open; the ones ahead are closed. Inside a stage are the twelve subjects, and a
// subject shows only what was made for that stage. So a child at stage 1, who cannot read yet, never meets a
// written lesson of stage 6.
// Moving up: when everything made for the learner's stage is done (each lesson seen to its end; in stage 3, each
// word of the word game matched once), the next stage opens. Nothing is announced and nothing is marked; the next
// house is simply open. A stage with nothing made yet cannot be finished, so the learner waits there. The entry and
// exit checks of the syllabus will replace this rule when they are built.
// For looking at the work, every stage can be opened on a phone: the admin panel has the switch, and so do
// /gyan?all=1 and /gyan?all=0.
import { BOOK } from "./buttons.js";
import { WORD_KEYS } from "./book.js";
import { LESSONS, lessonsOf } from "./lessons.js";
import { loadLearn } from "./learn.js";
import { ring } from "./subjects.js";

export const STAGES = 12;
export const KEY = "bodhilabs.stage.v1"; // the stage this learner is at, 1 to 12
export const ALL = "bodhilabs.allstages.v1"; // "1" while every stage is open on this phone, for review
export const READS_FROM = 3; // nothing is read in stages 1 and 2; letters come in stage 3

export const cleanStage = (v) => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= STAGES ? n : 1; };

/** The twelve houses of Gyan: the stages, in order. A stage is open when the learner has reached it, or when all are open. */
export const stageHouses = (at, all = false) => Array.from({ length: STAGES }, (_, i) => ({
  id: `stage:${i + 1}`, n: i + 1, picture: String(i + 1), name: { en: "" }, open: all || i + 1 <= at ? `/stage?n=${i + 1}` : undefined,
}));

/** Where a subject leads at a stage, or null when nothing is made for that stage yet. */
export function doorOf(subject, stage) {
  if (subject === "lives") return `/life?stage=${stage}`; // a life can be heard at every stage
  if (subject === "word") return stage === READS_FROM ? BOOK.href : null; // the word game is written words: stage 3
  return lessonsOf(subject, stage).length ? `/subject?s=${subject}&stage=${stage}` : null;
}

// Gyan is a cube of twelves (sumeet, 2026-11-28): twelve stages, twelve subjects in each, twelve lessons in each
// subject at a stage. A lesson house is one unit; it may hold several parts (lessons of lib/lessons.js that carry
// the same `house`), so a whole school year fits. A lesson with no `house` takes the next free one, in order.
export const HOUSES = 12;

/** The twelve lesson houses of a subject at a stage: for each, its parts in order (an empty list when nothing is made). */
export function unitsOf(subject, stage, lessons = LESSONS) {
  const houses = Array.from({ length: HOUSES }, () => []);
  let next = 0;
  for (const l of lessons.filter((x) => x.subject === subject && x.stage === stage)) {
    const h = l.house ? l.house - 1 : next;
    if (h >= 0 && h < HOUSES) houses[h].push(l);
    next = Math.max(next, h + 1);
  }
  return houses;
}

/** The twelve lesson houses as boxes for the grid. A house is done when every part of it was seen to the end. */
export const lessonHouses = (subject, stage, seenIds = []) => unitsOf(subject, stage).map((parts, i) => ({
  id: `unit:${subject}:${stage}:${i + 1}`,
  lesson: parts[0]?.id,
  picture: parts[0]?.picture ?? "",
  name: parts[0] && stage >= READS_FROM ? parts[0].name : { en: "" }, // nothing written before a learner reads
  open: parts.length ? `/lesson?s=${subject}&stage=${stage}&h=${i + 1}` : undefined,
  done: parts.length > 0 && parts.every((p) => seenIds.includes(p.id)),
}));

/** The twelve houses of a stage: the subjects, turned by the rising sign, each open only if it holds something there. */
export const subjectsAt = (stage, lagna) => ring(lagna).map((s) => ({ ...s, open: doorOf(s.id, stage) ?? undefined }));

export const loadStage = () => { try { return cleanStage(localStorage.getItem(KEY)); } catch { return 1; } };
export const allOpen = () => { try { return localStorage.getItem(ALL) === "1"; } catch { return false; } };
export const setAllOpen = (on) => { try { on ? localStorage.setItem(ALL, "1") : localStorage.removeItem(ALL); } catch {} };
/** The stage named in the page's address (?stage= or ?n=), kept to one the learner may open; else their own stage. */
export function stageHere(search = "") {
  const q = new URLSearchParams(search);
  const asked = q.get("stage") ?? q.get("n");
  const at = loadStage();
  if (asked === null) return at;
  const n = cleanStage(asked);
  return allOpen() || n <= at ? n : at;
}

export const SEEN = "bodhilabs.seen.v1"; // the lessons this learner has seen to the end

/** Everything there is to do at a stage, as names: "lesson:<id>", and in stage 3 "word:<key>" for the word game. */
export function partsOf(stage, lessons = LESSONS) {
  const made = lessons.filter((l) => l.stage === stage).map((l) => `lesson:${l.id}`);
  return stage === READS_FROM ? [...made, ...WORD_KEYS.map((k) => `word:${k}`)] : made;
}
/** The stage a learner at `at` stands at, given what they have done: it moves up past every stage that is all done. */
export function stageAfter(at, done, lessons = LESSONS) {
  let now = cleanStage(at);
  while (now < STAGES) {
    const parts = partsOf(now, lessons);
    if (!parts.length || !parts.every((p) => done.includes(p))) break;
    now++;
  }
  return now;
}

export const seenLessons = () => { try { const v = JSON.parse(localStorage.getItem(SEEN)); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; } };
/** Look at what is done on this phone and move the learner up if their stage is finished. Returns their stage. */
export function moveUp() {
  const done = [...seenLessons().map((id) => `lesson:${id}`), ...Object.keys(loadLearn()).map((k) => `word:${k}`)];
  const at = loadStage(), now = stageAfter(at, done);
  if (now !== at) { try { localStorage.setItem(KEY, String(now)); } catch {} }
  return now;
}
/** A lesson was seen to its end. */
export function markSeen(id) {
  const list = seenLessons();
  if (!list.includes(id)) { try { localStorage.setItem(SEEN, JSON.stringify([...list, id])); } catch {} }
  return moveUp();
}
