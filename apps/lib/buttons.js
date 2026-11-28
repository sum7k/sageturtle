// What the server counts. Home is a ring of twelve: eleven subjects and the joker (lib/subjects.js).
// Only Word can be entered yet (it is the reading app, "book" in the code). The other subjects are greyed out:
// a tap on one does nothing but get counted, so we learn which subjects people reach for.
// This file is also read by the Worker, to accept counts only for things that exist.
import { SUBJECTS } from "./subjects.js";
import { LIFE_IDS } from "./lives.js";

export const BOOK = { id: "book", href: "/book" };
export const JOKER = { id: "joker" };

/** Counted per person: Word opened ("book"), a greyed subject tapped ("subject:number"), the joker opened ("joker")
 * and the life it showed ("life:einstein"), a life played aloud ("heard"), the learner in the centre tapped ("centre"), and in Word each word
 * picked ("answer") and each right one ("right"). */
export const TRACKED = [BOOK.id, ...SUBJECTS.filter((s) => !s.open).map((s) => `subject:${s.id}`), JOKER.id, ...LIFE_IDS.map((l) => `life:${l}`), "heard", "centre", "answer", "right"];
/** Counted without knowing who, before a phone has an id: the first page opened, and the app installed. */
export const COUNTED = ["visit", "install"];
