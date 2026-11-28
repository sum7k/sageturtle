// The top level, Home (sumeet, 2026-11-28): the same grid of sixteen, one level above learning.
// House 1 is Gyan (ज्ञान): all of learning, with its twelve subjects inside (lib/subjects.js).
// House 2 is Vartaman (वर्तमान): the present, news; it is not built yet, so a press is only counted.
// The other ten houses are empty for now: greyed boxes with nothing on them, and a press is only counted.
import { LANGS } from "./langs.js";
import { STR } from "./strings.js";

const named = (key) => Object.fromEntries(LANGS.map((l) => [l.id, STR[l.id][key]]));

export const TOP = [
  { id: "gyan", picture: "🎓", open: "/gyan", name: named("book") },
  { id: "vartaman", picture: "🗞️", name: named("khabri") },
  ...Array.from({ length: 10 }, (_, i) => ({ id: `top:${i + 3}`, picture: "", name: { en: "" } })),
];
export const topById = (id) => TOP.find((t) => t.id === id);
