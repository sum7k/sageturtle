import test from "node:test";
import assert from "node:assert/strict";
import { VARIANTS, ADULT_VARIANTS, APPS, listsFor, LISTS, validCombo, togglePick, allCombos, CLASHES, MAX_VARIANTS } from "../lib/variants.js";
import { blank, normalise, nextStep, STEPS } from "../lib/store.js";
import { pick, addWeight, blank as blankTaste, normalise as normTaste, OUTSIDE_EVERY } from "../lib/taste.js";
import { browserKind, micSpan } from "../lib/browser.js";
import { LANGS, langById } from "../lib/langs.js";
import { LINES } from "../lib/lines.js";
import { KHABARS } from "../lib/khabars.js";
import { cleanNumber, reachLinks, normaliseReach, REACH_APPS, TEEN_REACH_APPS } from "../lib/reach.js";
import { homeTiles, togglePin, toggleHide, move, GROUP_NAME, blankTiles } from "../lib/home.js";

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
  assert.equal(homeTiles(["kids"]).tiles.length, 8);
  assert.deepEqual(homeTiles(["farm"]).tiles.map((t) => t.name), ["School", "Mandi", "Calendar", "Fun", "Calls", "Messages", "Chaupal", "Melas", "Farms", "Listings"]);
  assert.deepEqual(homeTiles(["nobody"]).tiles, []);
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


test("Home shows one tile per app, and a tile opens into versions only where the names differ", () => {
  const one = homeTiles(["farm"]).tiles;
  assert.equal(one.length, 10);
  assert.ok(one.every((t) => t.versions.length === 1));
  assert.equal(one[1].name, "Mandi");
  const two = homeTiles(["farm", "shop"]).tiles;
  assert.equal(two.length, 10);
  const earn = two.find((t) => t.app === "earn");
  assert.equal(earn.name, "Earnings");
  assert.deepEqual(earn.versions.map((v) => v.name), ["Mandi", "Leads"]);
  const calls = two.find((t) => t.app === "meetings"); // both call it Calls, so it is one plain tile
  assert.equal(calls.name, "Calls");
  assert.deepEqual(calls.versions.map((v) => v.variants), [["farm", "shop"]]);
});

test("a group tile's own name is one word too", () => {
  for (const n of Object.values(GROUP_NAME)) assert.match(n, /^[A-Z][a-z]+$/);
});

test("a tile can be kept on top, hidden and brought back, and moved", () => {
  let p = togglePin(blankTiles(), "events");
  assert.equal(homeTiles(["farm"], p).tiles[0].app, "events");
  p = toggleHide(p, "learn");
  let h = homeTiles(["farm"], p);
  assert.equal(h.tiles.length, 9);
  assert.deepEqual(h.hidden.map((t) => t.app), ["learn"]);
  assert.equal(homeTiles(["farm"], toggleHide(p, "learn")).tiles.length, 10);
  const before = h.tiles.map((t) => t.app);
  p = move(["farm"], p, before[2], -1);
  const after = homeTiles(["farm"], p).tiles.map((t) => t.app);
  assert.deepEqual([after[1], after[2]], [before[2], before[1]]);
  assert.equal(move(["farm"], p, after[1], -1), p, "a tile does not jump over the pinned ones");
  assert.equal(move(["farm"], p, "events", -1), p, "the first tile cannot move earlier");
});

test("the store keeps how Home is arranged, and repairs a broken arrangement", () => {
  assert.deepEqual(normalise({ v: 1, tiles: { pinned: ["earn", "earn", 3], hidden: "x" } }).tiles, { order: [], pinned: ["earn"], hidden: [] });
  assert.deepEqual(blank().tiles, blankTiles());
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
