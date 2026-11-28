// What this phone knows about the person. The server is told only the language, PIN code and variants (lib/track.js).
import { blankReach, normaliseReach } from "./reach.js";

export const KEY = "bodhilabs.me.v1";
export const STEPS = ["language", "lock", "place", "variant", "alerts"];

export function blank() {
  // `variants` is everything the person does; `variant` is the first of them. `uid` is the id the server gave at registration.
  // `sign` is the person's sign in Horoscope. `reach` is how others may call or message this person outside BodhiLabs; it is not the account.
  return { v: 1, uid: "", lang: "", lock: "", pin: "", variants: [], variant: "", alerts: "", name: "", username: "", sign: "", people: {}, reach: blankReach() };
}

export function normalise(raw) {
  const b = blank();
  if (!raw || typeof raw !== "object" || raw.v !== 1) return b;
  const out = { ...b };
  for (const k of Object.keys(b)) if (typeof raw[k] === typeof b[k] && raw[k] !== null) out[k] = raw[k];
  out.variants = Array.isArray(raw.variants) ? [...new Set(raw.variants.filter((x) => typeof x === "string" && x))] : [];
  if (out.variant && !out.variants.includes(out.variant)) out.variants.unshift(out.variant); // from the days of one variant
  if (!out.variants.includes(out.variant)) out.variant = out.variants[0] ?? "";
  out.reach = normaliseReach(raw.reach);
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
