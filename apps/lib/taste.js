// The reader's taste, learned quietly on the phone. A swipe left means "I like this", a swipe right "not for me".
// A topic swiped away comes less often but never disappears. About one card in five comes from outside the known taste.
export const KEY = "sageturtle.taste.v1";
export const SIGNAL = { like: 2, pass: -2, share: 4 };
const MAX = 40;
const MIN = -20;
export const OUTSIDE_EVERY = 5;

export const blank = () => ({ v: 1, weights: {}, seen: {}, count: 0 });

export function normalise(raw) {
  if (!raw || typeof raw !== "object" || raw.v !== 1) return blank();
  return { v: 1, weights: { ...raw.weights }, seen: { ...raw.seen }, count: Number(raw.count) || 0 };
}

export function addWeight(t, topic, amount) {
  if (!topic || !amount) return t;
  t.weights[topic] = Math.max(MIN, Math.min(MAX, (t.weights[topic] ?? 0) + amount));
  return t;
}

/** Pick the next khabar: unseen first; best-liked topic usually, an outside topic on every fifth card. */
export function pick(pool, t, exceptId) {
  const rest = pool.filter((k) => k.id !== exceptId);
  if (!rest.length) return pool[0] ?? null;
  const unseen = rest.filter((k) => !t.seen[k.id]);
  const from = unseen.length ? unseen : rest;
  const w = (k) => t.weights[k.topic] ?? 0;
  const outside = (t.count + 1) % OUTSIDE_EVERY === 0;
  const sorted = [...from].sort((a, b) => (outside ? w(a) - w(b) : w(b) - w(a)));
  return sorted[0];
}

export function load() {
  try {
    return normalise(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return blank();
  }
}
export function save(t) {
  try {
    localStorage.setItem(KEY, JSON.stringify(t));
  } catch {}
}
