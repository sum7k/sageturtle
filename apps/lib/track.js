// Registration and tap counts. Taps wait on the phone until they reach the server, so none is lost without network.
import { load, update, nextStep } from "./store.js";
import { TRACKED, COUNTED } from "./buttons.js";

export const KEY = "bodhilabs.taps.v1";
const REF = "bodhilabs.ref.v1"; // who sent this person here, kept from the first visit
const VISIT = "bodhilabs.visit.v1"; // the day this browser was last counted as a visit
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
      let ref = ""; try { ref = localStorage.getItem(REF) ?? ""; } catch {}
      const res = await post("/api/register", { ...profileOf(me), ref });
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

/**
 * Who sent the person: "?from=whatsapp" (or utm_source) in the link, else the site the link was on. Our own pages
 * and an empty answer give "". Only a short name is kept, never a full address.
 */
export function refOf(search = "", referrer = "", host = "") {
  const q = new URLSearchParams(search);
  const named = (q.get("from") ?? q.get("utm_source") ?? "").toLowerCase();
  if (/^[a-z0-9._-]{1,40}$/.test(named)) return named;
  try {
    const from = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    return from && from !== host.replace(/^www\./, "") && /^[a-z0-9.-]{1,60}$/.test(from) ? from : "";
  } catch { return ""; }
}

/** Count something that has no person yet. Lost without network, which is fine for a rough count. */
export function count(name) {
  if (COUNTED.includes(name)) post("/api/count", { name }).catch(() => {});
}

/** The first page was opened: remember who sent the person (first time only) and count the visit once a day. */
export function visit() {
  try {
    if (localStorage.getItem(REF) === null) localStorage.setItem(REF, refOf(location.search, document.referrer, location.hostname));
    const day = today();
    if (localStorage.getItem(VISIT) === day) return;
    localStorage.setItem(VISIT, day);
  } catch { return; }
  count("visit");
}
