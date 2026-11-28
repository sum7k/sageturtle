import test from "node:test";
import assert from "node:assert/strict";
import { answer, find, index, passages, same, words } from "../lib/find.js";
import { LESSONS } from "../lib/lessons.js";

const best = (q, lang) => answer(q, lang)[0];

test("every line of every lesson can be found, in each language it is written in", () => {
  for (const lang of ["hi", "en"]) {
    const lines = passages(lang);
    assert.equal(lines.length, LESSONS.reduce((n, l) => n + (l.scenes[0].say[lang] ? l.scenes.length : 0), 0));
    for (const p of lines) assert.ok(p.id && p.art && p.text, p.id);
  }
});

test("a question in Hindi finds its line, in whatever form the words come", () => {
  assert.equal(best("मछली कहाँ रहती है?", "hi").passage.id, "animals.4");
  assert.equal(best("पत्थर जलता है क्या", "hi").passage.id, "fire.6");
  assert.equal(best("खाना कैसे पकाते हैं", "hi").passage.id, "fire.4");
  assert.equal(best("आग कैसे बुझती है", "hi").passage.id, "fire.6");
  assert.ok(best("हाथी कैसा होता है", "hi").sure);
});

test("a question in English finds its line", () => {
  assert.equal(best("why is fire hot", "en").passage.id, "fire.7");
  assert.equal(best("what does a cow eat", "en").passage.id, "animals.2");
  assert.equal(best("tell me about peacocks", "en").passage.id, "animals.3");
  assert.equal(best("how many senses do we have", "en").passage.id, "senses.6");
});

test("what the lessons do not hold is not answered, or only as the nearest thing", () => {
  assert.deepEqual(answer("what is the moon", "en"), []);
  assert.deepEqual(answer("मेरा नाम क्या है", "hi"), []);
  assert.deepEqual(answer("   ", "hi"), []);
  assert.equal(best("चाँद कितना दूर है", "hi").sure, false);
});

test("a language with no lessons yet is looked up in English", () => {
  assert.equal(best("fish", "ta").passage.lang, "en");
  assert.deepEqual(answer("நெருப்பு என்றால் என்ன", "ta"), []);
});

test("forms of one word are known as one, and different words are not", () => {
  for (const [a, b] of [["जलता", "जलने"], ["बुझती", "बुझा"], ["eat", "eats"], ["peacock", "peacocks"]]) assert.ok(same(a, b), `${a} ${b}`);
  for (const [a, b] of [["पानी", "पास"], ["cow", "cook"], ["आग", "आम"], ["fire", "first"]]) assert.ok(!same(a, b), `${a} ${b}`);
  assert.deepEqual(words("आग, पानी! Fire?"), ["आग", "पानी", "fire"]);
});

test("stages above the learner's are left out", () => {
  const later = [{ ...LESSONS[0], id: "later", stage: 5 }];
  assert.equal(passages("hi", { lessons: later, upTo: 1 }).length, 0);
  assert.equal(find(index(passages("hi", { lessons: later })), "आग गरम", 1).length, 1);
});
