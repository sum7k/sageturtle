// Registration and tap counts. Taps wait on the phone until they reach the server, so none is lost without network.
import { load, update, nextStep } from "./store.js";
import { TRACKED } from "./buttons.js";

export const KEY = "bodhilabs.taps.v1";
const SEEN = "bodhilabs.seen.v1"; // the day the pictures on Home were last counted as shown

/** Add one tap to the waiting counts. Unknown buttons are ignored. */
export function addTap(pending, button) {
  if (!TRACKED.includes(button)) return pending;
  return { ...pending, [button]: (pending[button] ?? 0) + 1 };
}
/** What still waits after `sent` has reached the server. Taps made while sending are kept. */
export function subtract(pending, sent) {
  const out = {};
  for (const [b, n] of Object.entries(pending)) {
    const left = n - (sent[b] ?? 0);
    if (left > 0) out[b] = left;
  }
  return out;
}
/** What the server is told about a phone. No name and no phone number. PIN code and work are empty until registration. */
export const profileOf = (me) => ({ id: me.uid || undefined, lang: me.lang, pin: me.pin, variants: me.variants });

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } };
const write = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} };
const post = (path, body) => fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), keepalive: true });

let busy = false;
let again = false;

/** Give this phone an id if the server does not know it yet, then send the waiting taps. Safe to call often. */
export async function sync({ profile = false } = {}) {
  if (busy) { again = true; return; }
  busy = true;
  try {
    let me = load();
    if (nextStep(me)) return;
    if (!me.uid || profile) {
      const res = await post("/api/register", profileOf(me));
      if (!res.ok) return;
      const { id } = await res.json();
      me = update((m) => { m.uid = id; });
    }
    const sent = read();
    if (!Object.keys(sent).length) return;
    const res = await post("/api/tap", { user: me.uid, taps: sent });
    if (res.ok) write(subtract(read(), sent));
    else if (res.status === 404) update((m) => { m.uid = ""; }); // the server forgot this person: register again next time
  } catch {
    // no network: the taps stay on the phone
  } finally {
    busy = false;
    if (again) { again = false; sync(); }
  }
}

/** Count one tap. */
export function tap(button) {
  write(addTap(read(), button));
  sync();
}

/** Today in India, as YYYY-MM-DD. The pictures on Home change with it. */
export const today = (now = Date.now()) => new Date(now + 19800000).toISOString().slice(0, 10);

/** Count that these pictures were shown, once per phone per day, so taps can be compared with showings. */
export function seen(icons, day) {
  try {
    if (!icons.length || localStorage.getItem(SEEN) === day) return;
    localStorage.setItem(SEEN, day);
  } catch { return; }
  write(icons.reduce((p, id) => addTap(p, `seen:${id}`), read()));
}
