// What this phone remembers about how the learner does, for the three pages in the middle of the grid.
// It stays on the phone. For each word of the game: how often its picture was finished (`seen`) and how often the
// right word was picked at the first try (`first`).
export const KEY = "bodhilabs.learn.v1";

/** One picture finished. `firstTry` is true when no wrong word was picked before the right one. */
export function mark(stats, word, firstTry) {
  const was = stats[word] ?? { seen: 0, first: 0 };
  return { ...stats, [word]: { seen: was.seen + 1, first: was.first + (firstTry ? 1 : 0) } };
}

/**
 * The report. `learned` are the words finished at least once, in the order of `keys`. A word is strong when it
 * was right at the first try at least three times in four, and needs practice when less than half the time.
 */
export function report(stats, keys) {
  const learned = keys.filter((k) => stats[k]?.seen > 0);
  const share = (k) => stats[k].first / stats[k].seen;
  return {
    learned,
    strong: learned.filter((k) => share(k) >= 0.75),
    weak: learned.filter((k) => share(k) < 0.5),
    seen: learned.reduce((n, k) => n + stats[k].seen, 0),
    first: learned.reduce((n, k) => n + stats[k].first, 0),
  };
}

const clean = (raw) => {
  const out = {};
  if (raw && typeof raw === "object") for (const [k, v] of Object.entries(raw)) if (Number.isInteger(v?.seen) && Number.isInteger(v?.first) && v.seen > 0) out[k] = { seen: v.seen, first: Math.min(v.first, v.seen) };
  return out;
};
export const loadLearn = () => { try { return clean(JSON.parse(localStorage.getItem(KEY))); } catch { return {}; } };
export const saveLearn = (stats) => { try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch {} };
