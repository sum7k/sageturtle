import test from "node:test";
import assert from "node:assert/strict";
import { VARIANTS, ADULT_VARIANTS, APPS, tilesFor, listsFor, LISTS } from "../lib/variants.js";
import { blank, normalise, nextStep, STEPS } from "../lib/store.js";
import { pick, addWeight, blank as blankTaste, normalise as normTaste, OUTSIDE_EVERY } from "../lib/taste.js";
import { browserKind, micSpan } from "../lib/browser.js";
import { LANGS, langById } from "../lib/langs.js";
import { LINES } from "../lib/lines.js";
import { KHABARS } from "../lib/khabars.js";

test("there are eleven variants and nine of them are for adults", () => {
  assert.equal(VARIANTS.length, 11);
  assert.equal(ADULT_VARIANTS.length, 9);
});

test("every app name is one word", () => {
  for (const v of VARIANTS) for (const a of APPS) {
    const n = v.names[a];
    if (n !== null) assert.match(n, /^[A-Z][a-z]+$/, `${v.id}.${a} = ${n}`);
  }
});

test("no app is named with a verb", () => {
  const verbs = ["Play", "Study", "Prep", "Upskill", "Grow", "Learn", "Teach", "Recharge", "Promote", "Showcase", "Sell", "Ask", "Earn"];
  for (const v of VARIANTS) for (const a of APPS) assert.ok(!verbs.includes(v.names[a]), `${v.id}.${a}`);
});

test("an app that is off for a variant gets no tile", () => {
  assert.equal(tilesFor("kids").length, 8);
  assert.equal(tilesFor("farm").length, 10);
  assert.deepEqual(tilesFor("farm").map((t) => t.name), ["School", "Mandi", "Calendar", "Fun", "Calls", "Messages", "Chaupal", "Melas", "Farms", "Listings"]);
  assert.deepEqual(tilesFor("nobody"), []);
});

test("a variant shows only the lists that fit it", () => {
  assert.deepEqual(listsFor("kids").map((l) => l.id), ["guardians"]);
  assert.ok(!listsFor("farm").some((l) => l.id === "work"));
  assert.ok(listsFor("teach").some((l) => l.id === "class"));
  for (const v of VARIANTS) for (const l of v.lists) assert.ok(LISTS[l], l);
});

test("first run goes language, lock, place, what you do, alerts", () => {
  const me = blank();
  const seen = [];
  const fill = { language: ["lang", "hi"], lock: ["lock", "abc"], place: ["pin", "221001"], variant: ["variant", "farm"], alerts: ["alerts", "no"] };
  for (let s = nextStep(me); s; s = nextStep(me)) { seen.push(s); me[fill[s][0]] = fill[s][1]; }
  assert.deepEqual(seen, STEPS);
});

test("a broken store becomes a blank one, and a bad PIN code is dropped", () => {
  assert.deepEqual(normalise(null), blank());
  assert.deepEqual(normalise({ v: 2, lang: "hi" }), blank());
  assert.equal(normalise({ v: 1, pin: "12" }).pin, "");
  assert.equal(normalise({ v: 1, pin: "221001", lang: 5 }).lang, "");
});

test("the deck prefers liked topics, shows unseen first, and never repeats the card just swiped", () => {
  const t = blankTaste();
  addWeight(t, "space", 2);
  assert.equal(pick(KHABARS, t).topic, "space");
  t.seen["chandrayaan-3"] = 1;
  assert.notEqual(pick(KHABARS, t).id, "chandrayaan-3");
  for (const k of KHABARS) t.seen[k.id] = 1;
  assert.notEqual(pick(KHABARS, t, "chandrayaan-3").id, "chandrayaan-3");
});

test("about one card in five comes from outside the known taste", () => {
  const t = blankTaste();
  addWeight(t, "space", 10);
  addWeight(t, "farming", -4);
  t.count = OUTSIDE_EVERY - 1;
  assert.equal(pick(KHABARS, t).topic, "farming");
});

test("a topic swiped away is held at a floor and never disappears", () => {
  const t = blankTaste();
  for (let i = 0; i < 50; i++) addWeight(t, "space", -2);
  assert.equal(t.weights.space, -20);
  assert.deepEqual(normTaste("x"), blankTaste());
});

test("the landing page picks its picture from the browser", () => {
  assert.equal(browserKind("Mozilla/5.0 (Linux; Android 14) Chrome/130 Mobile"), "chrome");
  assert.equal(browserKind("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Safari/604.1"), "iphone");
  assert.equal(browserKind("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Instagram 300"), "inapp");
  assert.equal(browserKind("Mozilla/5.0 (Linux; Android 14; wv) Chrome/130"), "inapp");
});

test("the gold mic always completes the last row of three", () => {
  assert.equal(micSpan(10), 2);
  assert.equal(micSpan(8), 1);
  assert.equal(micSpan(9), 3);
});

test("twelve languages, and every spoken line exists in English", () => {
  assert.equal(LANGS.length, 12);
  assert.equal(langById("zz").id, "en");
  for (const k of Object.keys(LINES.hi)) assert.ok(LINES.en[k], k);
  for (const s of STEPS) assert.ok(LINES.en[s], s);
});

test("a khabar is one piece with a source, and uses no em dash", () => {
  for (const k of KHABARS) {
    assert.ok(k.paras.length >= 3 && k.sources.length >= 1, k.id);
    assert.ok(!JSON.stringify(k).includes("—"), k.id);
    assert.ok(!/\bnews\b/i.test(k.title + k.dek + k.paras.join(" ")), k.id);
  }
});
