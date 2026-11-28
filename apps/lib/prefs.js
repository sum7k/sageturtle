// What the learner chose in Settings (app/settings). Kept on the phone only.
export const KEY = "bodhilabs.prefs.v1";
export const VOICES = ["both", "man", "woman"]; // both is the rule (lib/speak.js); a learner may keep one
export const SPEEDS = [0.8, 1, 1.2]; // slow, as recorded, quick

export function cleanPrefs(raw) {
  const v = raw && typeof raw === "object" ? raw : {};
  return { voice: VOICES.includes(v.voice) ? v.voice : "both", speed: SPEEDS.includes(v.speed) ? v.speed : 1 };
}
export const loadPrefs = () => { try { return cleanPrefs(JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "null")); } catch { return cleanPrefs(); } };
export function savePrefs(change) {
  const next = cleanPrefs({ ...loadPrefs(), ...change });
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  return next;
}
/** The voices that speak, of the two the phone has ready: both, or only the one the learner kept. */
export const sidesFor = (sides, voice) => (voice === "both" ? sides : sides.filter((s) => s.who === voice));
