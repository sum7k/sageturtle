// What this phone knows about the person. Kept on the phone for now; the shared backend will hold it later.
export const KEY = "sageturtle.me.v1";
export const STEPS = ["language", "lock", "place", "variant", "alerts"];

export function blank() {
  // `variants` is everything the person does; `variant` is the one showing on Home right now.
  return { v: 1, lang: "", lock: "", pin: "", variants: [], variant: "", alerts: "", name: "", username: "", people: {} };
}

export function normalise(raw) {
  const b = blank();
  if (!raw || typeof raw !== "object" || raw.v !== 1) return b;
  const out = { ...b };
  for (const k of Object.keys(b)) if (typeof raw[k] === typeof b[k] && raw[k] !== null) out[k] = raw[k];
  out.variants = Array.isArray(raw.variants) ? [...new Set(raw.variants.filter((x) => typeof x === "string" && x))] : [];
  if (out.variant && !out.variants.includes(out.variant)) out.variants.unshift(out.variant); // from the days of one variant
  if (!out.variants.includes(out.variant)) out.variant = out.variants[0] ?? "";
  if (!/^\d{6}$/.test(out.pin)) out.pin = "";
  return out;
}

/** The first set-up step that is not done yet, or null when first run is complete. */
export function nextStep(me) {
  if (!me.lang) return "language";
  if (!me.lock) return "lock";
  if (!me.pin) return "place";
  if (!me.variants.length) return "variant";
  if (!me.alerts) return "alerts";
  return null;
}

export function load() {
  try {
    return normalise(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return blank();
  }
}
export function save(me) {
  try {
    localStorage.setItem(KEY, JSON.stringify(me));
  } catch {}
}
export function update(fn) {
  const me = load();
  const next = fn(me) ?? me;
  save(next);
  return next;
}
