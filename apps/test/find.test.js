import test from "node:test";
import assert from "node:assert/strict";
import { answer, find, index, passages, same, words } from "../lib/find.js";
import { LESSONS } from "../lib/lessons.js";

// A small set of lessons of our own, so these tests do not break when the real lessons are rewritten.
const line = (art, hi, en) => ({ art, say: { hi, en } });
const OURS = [
  { id: "fire", stage: 1, who: "man", scenes: [
    line("light", "आग से रोशनी मिलती है। अँधेरा दूर हो जाता है।", "Fire gives light. The dark goes away."),
    line("cook", "आग पर खाना पकता है। पका हुआ खाना नरम होता है।", "Food is cooked on fire. Cooked food is soft."),
    line("burns", "सूखी लकड़ी जलती है। सूखे पत्ते भी जलते हैं।", "Dry wood burns. Dry leaves burn too."),
    line("noburn", "पत्थर नहीं जलता। और पानी आग को बुझा देता है।", "A stone does not burn. And water puts fire out."),
    line("safe", "आग बहुत गरम होती है। हम आग को छूते नहीं।", "Fire is very hot. We do not touch fire."),
  ] },
  { id: "animals", stage: 1, who: "woman", scenes: [
    line("elephant", "यह हाथी है। हाथी बहुत बड़ा होता है। उसकी लंबी सूँड़ होती है।", "This is an elephant. An elephant is very big. It has a long trunk."),
    line("cow", "यह गाय है। गाय घास खाती है।", "This is a cow. A cow eats grass."),
    line("peacock", "यह मोर है। मोर एक पक्षी है। उसके पंख बहुत सुंदर होते हैं।", "This is a peacock. A peacock is a bird. Its feathers are very beautiful."),
    line("fish", "यह मछली है। मछली पानी में रहती है।", "This is a fish. A fish lives in water."),
    line("senses", "आँख, कान, नाक, जीभ और त्वचा। ये हमारी पाँच इंद्रियाँ हैं।", "Eyes, ears, nose, tongue and skin. These are our five senses."),
  ] },
];
const ask = (q, lang) => answer(q, lang, 3, OURS);
const best = (q, lang) => ask(q, lang)[0];

test("every line of every real lesson can be found by its own words, in each language it is written in", () => {
  for (const lang of ["hi", "en"]) {
    const lines = passages(lang);
    assert.equal(lines.length, LESSONS.reduce((n, l) => n + (l.scenes[0].say[lang] ? l.scenes.length : 0), 0));
    for (const p of lines) {
      assert.ok(p.id && p.art && p.text, p.id);
      assert.ok(answer(p.text, lang, 5).some((x) => x.passage.lesson === p.lesson), p.id);
    }
  }
});

test("a question in Hindi finds its line, in whatever form the words come", () => {
  assert.equal(best("मछली कहाँ रहती है?", "hi").passage.art, "fish");
  assert.equal(best("पत्थर जलता है क्या", "hi").passage.art, "noburn");
  assert.equal(best("खाना कैसे पकाते हैं", "hi").passage.art, "cook");
  assert.equal(best("आग कैसे बुझती है", "hi").passage.art, "noburn");
  assert.ok(best("हाथी कैसा होता है", "hi").sure);
  assert.equal(best("हाथी कैसा होता है", "hi").passage.who, "woman");
});

test("a question in English finds its line", () => {
  assert.equal(best("why is fire hot", "en").passage.art, "safe");
  assert.equal(best("what does a cow eat", "en").passage.art, "cow");
  assert.equal(best("tell me about peacocks", "en").passage.art, "peacock");
  assert.equal(best("how many senses do we have", "en").passage.art, "senses");
});

test("what the lessons do not hold is not answered, or only as the nearest thing", () => {
  assert.deepEqual(ask("what is the moon", "en"), []);
  assert.deepEqual(ask("मेरा नाम क्या है", "hi"), []);
  assert.deepEqual(ask("   ", "hi"), []);
  assert.equal(best("चाँद कितना दूर है", "hi").sure, false);
});

test("a language with no lessons yet is looked up in English", () => {
  assert.equal(best("fish", "ta").passage.lang, "en");
  assert.deepEqual(ask("நெருப்பு என்றால் என்ன", "ta"), []);
});

test("forms of one word are known as one, and different words are not", () => {
  for (const [a, b] of [["जलता", "जलने"], ["बुझती", "बुझा"], ["eat", "eats"], ["peacock", "peacocks"]]) assert.ok(same(a, b), `${a} ${b}`);
  for (const [a, b] of [["पानी", "पास"], ["cow", "cook"], ["आग", "आम"], ["fire", "first"]]) assert.ok(!same(a, b), `${a} ${b}`);
  assert.deepEqual(words("आग, पानी! Fire?"), ["आग", "पानी", "fire"]);
});

test("stages above the learner's are left out", () => {
  const later = [{ ...OURS[0], id: "later", stage: 5 }];
  assert.equal(passages("hi", { lessons: later, upTo: 1 }).length, 0);
  assert.equal(find(index(passages("hi", { lessons: later })), "आग गरम", 1).length, 1);
});
