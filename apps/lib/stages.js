// Gyan is walked by stage, not by topic (sumeet, 2026-11-28). Inside Gyan are the twelve stages of the path
// (gyan/docs/syllabus-map.md): the time before school, then class 1 to class 11. A learner is at one stage. That
// stage and the ones behind it are open; the ones ahead are closed. Inside a stage are the twelve subjects, and a
// subject shows only what was made for that stage. So a child at stage 1, who cannot read yet, never meets a
// written lesson of stage 6.
// Moving up is not built yet (the entry and exit checks of the syllabus): a new learner stays at stage 1.
// For looking at the work, every stage can be opened on a phone: the admin panel has the switch, and so do
// /gyan?all=1 and /gyan?all=0.
import { BOOK } from "./buttons.js";
import { lessonsOf } from "./lessons.js";
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

// The subjects that have a page of lessons (app/<subject>/page.jsx reads ?stage=).
const PAGES = { nature: "/nature", number: "/number" };

/** Where a subject leads at a stage, or null when nothing is made for that stage yet. */
export function doorOf(subject, stage) {
  if (subject === "lives") return `/life?stage=${stage}`; // a life can be heard at every stage
  if (subject === "word") return stage === READS_FROM ? BOOK.href : null; // the word game is written words: stage 3
  return PAGES[subject] && lessonsOf(subject, stage).length ? `${PAGES[subject]}?stage=${stage}` : null;
}

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
