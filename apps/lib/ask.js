// The "?" box: the learner types a question, it reaches the admin panel, and the answer written there shows here.
import { load } from "./store.js";
import { sync } from "./track.js";

export const KEY = "bodhilabs.ask.v1"; // { waiting, checked, fresh }: is an answer awaited, when we last looked, is one unread
export const MAX_QUESTION = 500;
const HOUR = 3600000;

/** Should the grid look for an answer now? Only while one is awaited, and at most once an hour. */
export const shouldLook = (state, now) => !!state.waiting && now - (state.checked ?? 0) >= HOUR;
/** The state after the server's list was read. `opened` is true on the Ask page itself, where answers get read. */
export function afterLook(state, list, now, opened = false) {
  const waiting = list.some((q) => !q.reply);
  const answered = list.filter((q) => q.reply).length;
  const fresh = opened ? false : !!state.fresh || answered > (state.answered ?? 0);
  return { waiting, checked: now, fresh, answered };
}

export const askState = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } };
const keep = (state) => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

/** This phone's questions and their answers, newest first; null without network. */
export async function myQuestions(opened = false) {
  try {
    const uid = load().uid;
    if (!uid) return [];
    const res = await fetch(`/api/ask?user=${uid}`, { cache: "no-store" });
    if (!res.ok) return null;
    const { questions } = await res.json();
    keep(afterLook(askState(), questions, Date.now(), opened));
    return questions;
  } catch { return null; }
}

/** Send a question. True when the server has it. */
export async function sendQuestion(text) {
  try {
    if (!load().uid) await sync();
    const uid = load().uid;
    if (!uid) return false;
    const res = await fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ user: uid, text }) });
    if (res.ok) keep({ ...askState(), waiting: true, checked: Date.now() });
    return res.ok;
  } catch { return false; }
}

/** Is there an unread answer? Looks at the server only when `shouldLook` says so. */
export async function freshAnswer() {
  if (shouldLook(askState(), Date.now())) await myQuestions();
  return !!askState().fresh;
}
