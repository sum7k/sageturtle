import test from "node:test";
import assert from "node:assert/strict";
import { VARIANTS, ADULT_VARIANTS, APPS, listsFor, LISTS, validCombo, togglePick, allCombos, CLASHES, MAX_VARIANTS } from "../lib/variants.js";
import { blank, normalise, nextStep, STEPS } from "../lib/store.js";
import { pick, addWeight, blank as blankTaste, normalise as normTaste, OUTSIDE_EVERY } from "../lib/taste.js";
import { browserKind } from "../lib/browser.js";
import { KHABARS } from "../lib/khabars.js";
import { cleanNumber, reachLinks, normaliseReach, REACH_APPS, TEEN_REACH_APPS } from "../lib/reach.js";

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

test("a variant shows only the lists that fit it", () => {
  assert.deepEqual(listsFor("kids").map((l) => l.id), ["guardians"]);
  assert.ok(!listsFor("farm").some((l) => l.id === "work"));
  assert.ok(listsFor("teach").some((l) => l.id === "class"));
  for (const v of VARIANTS) for (const l of v.lists) assert.ok(LISTS[l], l);
});

test("first run goes language, lock, place, what you do, alerts", () => {
  const me = blank();
  const seen = [];
  const fill = { language: ["lang", "hi"], lock: ["lock", "abc"], place: ["pin", "221001"], variant: ["variants", ["farm"]], alerts: ["alerts", "no"] };
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

test("a khabar is one piece with a source, and uses no em dash", () => {
  for (const k of KHABARS) {
    assert.ok(k.paras.length >= 3 && k.sources.length >= 1, k.id);
    assert.ok(!JSON.stringify(k).includes("—"), k.id);
    assert.ok(!/\bnews\b/i.test(k.title + k.dek + k.paras.join(" ")), k.id);
  }
});

test("a person can hold any number of variants, and one of them shows on Home", () => {
  const me = normalise({ v: 1, variants: ["farm", "shop", "farm", 7], variant: "shop" });
  assert.deepEqual(me.variants, ["farm", "shop"]);
  assert.equal(me.variant, "shop");
  assert.equal(normalise({ v: 1, variants: ["farm"], variant: "teach" }).variant, "teach");
  assert.equal(normalise({ v: 1, variants: ["farm", "shop"] }).variant, "farm");
});

test("a store from the days of one variant keeps that variant", () => {
  const me = normalise({ v: 1, variant: "farm" });
  assert.deepEqual(me.variants, ["farm"]);
  assert.equal(nextStep({ ...me, lang: "hi", lock: "x", pin: "221001", alerts: "no" }), null);
});

test("the lists of a person are the union over everything they do, each once", () => {
  assert.deepEqual(listsFor(["farm", "teach"]).map((l) => l.id), ["family", "friends", "work", "trade", "neighbours", "class"]);
  assert.deepEqual(listsFor([]), []);
});

test("some variants do not go together, and nobody holds more than three", () => {
  assert.ok(validCombo(["farm", "shop"]));
  assert.ok(validCombo(["farm", "shop", "home"]));
  assert.ok(!validCombo(["farm", "shop", "home", "gig"]));
  assert.ok(!validCombo(["retired", "jobs"]));
  assert.ok(!validCombo(["kids", "farm"]));
  assert.ok(validCombo(["kids"]));
  assert.ok(!validCombo([]));
  for (const [a, b] of CLASHES) assert.ok(!validCombo([a, b]), `${a}+${b}`);
});

test("picking a variant drops what clashes with it, and a fourth pick is refused", () => {
  assert.deepEqual(togglePick(["office", "farm"], "retired"), ["farm", "retired"]);
  assert.deepEqual(togglePick(["farm", "shop", "home"], "gig"), ["farm", "shop", "home"]);
  assert.deepEqual(togglePick(["farm", "shop"], "farm"), ["shop"]);
  assert.equal(MAX_VARIANTS, 3);
});

test("there are 97 kinds of person", () => {
  const all = allCombos();
  const by = (n) => all.filter((c) => c.length === n).length;
  assert.deepEqual([by(1), by(2), by(3)], [11, 31, 55]);
  assert.equal(all.length, 97);
});


test("a mobile number is kept as ten digits, however it was entered", () => {
  assert.equal(cleanNumber("98765 43210"), "9876543210");
  assert.equal(cleanNumber("+91 98765-43210"), "9876543210");
  assert.equal(cleanNumber("09876543210"), "9876543210");
  assert.equal(cleanNumber("12345"), "");
  assert.equal(cleanNumber("1234567890"), "");
  assert.deepEqual(normaliseReach({ phone: "9876543210", app: "fax" }), { phone: "", app: "" });
  assert.deepEqual(blank().reach, { phone: "", app: "" });
  assert.deepEqual(normalise({ v: 1, reach: { phone: "+919876543210", app: "sms" } }).reach, { phone: "9876543210", app: "sms" });
});

test("a person is handed off by link to the dialer and to the app they chose", () => {
  const who = (app) => ({ name: "Asha", reach: { phone: "9876543210", app } });
  assert.deepEqual(reachLinks(who("whatsapp")), { app: "whatsapp", call: "tel:+919876543210", message: "https://wa.me/919876543210" });
  assert.equal(reachLinks(who("telegram")).message, "https://t.me/+919876543210");
  assert.equal(reachLinks(who("sms")).message, "sms:+919876543210");
  for (const a of REACH_APPS) assert.equal(reachLinks(who(a)).call, "tel:+919876543210");
  assert.equal(reachLinks({ name: "Ravi" }), null);
});

test("a kid is never handed off, and a teen never to Telegram", () => {
  assert.equal(reachLinks({ name: "Chintu", kid: true, reach: { phone: "9876543210", app: "whatsapp" } }), null);
  assert.ok(!TEEN_REACH_APPS.includes("telegram"));
  for (const a of TEEN_REACH_APPS) assert.ok(REACH_APPS.includes(a));
});
