import test from "node:test";
import assert from "node:assert/strict";
import { BOOK, WORD, LIFE, TRACKED, tapName } from "../lib/buttons.js";
import { AROUND, CENTRE, SAY } from "../lib/grid.js";
import { WORD_HOUSES } from "../lib/word.js";
import { TOP } from "../lib/top.js";
import { mark, report } from "../lib/learn.js";
import { shouldLook, afterLook } from "../lib/ask.js";
import { SUBJECTS, LANG_ORDER, ring, nameOf } from "../lib/subjects.js";
import { LIVES, nextLife, lifeLang } from "../lib/lives.js";
import { mustInstall, openAppUrl, isInstalled } from "../lib/browser.js";
import { LANGS, langById, guessLang, stateLang, firstGuess } from "../lib/langs.js";
import { STR, t } from "../lib/strings.js";
import { LETTERS, lettersFor, WORDS, WORD_KEYS, PICTURE, round, wordFor } from "../lib/book.js";
import { SIGNS, LINES, lineFor } from "../lib/horoscope.js";
import { addTap, subtract, profileOf, today } from "../lib/track.js";
import { VARIANTS, LISTS } from "../lib/variants.js";
import { blank } from "../lib/store.js";
import { handle, istDay } from "../worker/index.js";
import { accessEmail } from "../worker/access.js";
import { adminData, adminPage } from "../worker/admin.js";
import { testDb } from "./d1.js";

test("twelve languages, English among them, and every word exists in every language", () => {
  assert.equal(LANGS.length, 12);
  assert.equal(stateLang("PB"), "pa"); // Punjabi, the twelfth
  assert.equal(t("pa", "today"), "ਅੱਜ");
  assert.equal(langById("en").name, "English");
  assert.equal(langById("xx").id, "en");
  assert.equal(guessLang("ta-IN"), "ta");
  assert.equal(guessLang("fr-FR"), "en");
  const keys = Object.keys(STR.en);
  for (const l of LANGS) {
    assert.deepEqual(Object.keys(STR[l.id]).sort(), [...keys].sort(), l.id);
    for (const k of keys) assert.ok(STR[l.id][k]?.trim(), `${l.id}.${k}`);
    assert.ok(LETTERS[l.id], `letters for ${l.id}`);
    assert.equal(new Set(lettersFor(l.id)).size, lettersFor(l.id).length, `no letter twice in ${l.id}`);
  }
  assert.equal(t("xx", "today"), "Today");
});

test("the first screen guesses a language from the phone, then from the state, and every tile can say hello", () => {
  for (const l of LANGS) assert.ok(l.hello.trim(), l.id);
  assert.equal(stateLang("MH"), "mr");
  assert.equal(stateLang("tn"), "ta");
  assert.equal(stateLang("XX"), "");
  const all = LANGS.flatMap((l) => l.states);
  assert.equal(new Set(all).size, all.length, "a state has one language");
  assert.equal(firstGuess(["ta-IN", "en-IN"], "KA"), "ta"); // a phone set to an Indian language says the most
  assert.equal(firstGuess(["en-IN", "bn"], "KA"), "bn");
  assert.equal(firstGuess(["en-IN"], "KA"), "kn"); // an English phone: the state decides
  assert.equal(firstGuess(["en-US"], ""), "en");
  assert.equal(firstGuess(["fr-FR"], ""), "");
});

test("Book shows a picture and three words, one of them right, and has every word in every language", () => {
  assert.equal(WORD_KEYS.length, 12);
  for (const k of WORD_KEYS) assert.ok(PICTURE[k], k);
  for (const l of LANGS) {
    const words = WORD_KEYS.map((k) => wordFor(l.id, k));
    assert.ok(words.every((w) => w?.trim()), l.id);
    assert.equal(new Set(words).size, 12, `no word twice in ${l.id}`);
  }
  const place = [0, 0, 0];
  for (let n = 0; n < 120; n++) {
    const r = round(n);
    assert.equal(r.answer, WORD_KEYS[n % 12]);
    assert.equal(new Set(r.choices).size, 3, `round ${n}`);
    assert.ok(r.choices.includes(r.answer), `round ${n}`);
    place[r.choices.indexOf(r.answer)]++;
  }
  assert.deepEqual(round(5), round(5));
  assert.ok(place.every((c) => c >= 30), "the right word is not always in the same place");
  assert.equal(Object.keys(WORDS).length, 12);
});

test("a sign gets one line a day, and two signs do not share it", () => {
  const now = Date.UTC(2026, 10, 28, 6);
  assert.equal(lineFor("0", "en", now), lineFor("0", "en", now + 3600000));
  assert.notEqual(lineFor("0", "en", now), lineFor("1", "en", now));
  assert.notEqual(lineFor("0", "en", now), lineFor("0", "en", now + 86400000));
  assert.ok(LINES.hi.includes(lineFor("3", "hi", now)));
  assert.ok(LINES.en.includes(lineFor("3", "ta", now)));
  assert.equal(LINES.hi.length, LINES.en.length);
});

const NOW = Date.UTC(2026, 10, 28, 6); // 11:30 in India
const env = () => ({ DB: testDb(), ASSETS: { fetch: async () => new Response("page") } });
const post = (e, path, body, now = NOW) => handle(new Request(`https://bodhilabs.org${path}`, { method: "POST", body: JSON.stringify(body) }), e, now);
const signUp = async (e, profile = { lang: "hi" }, now = NOW) => (await (await post(e, "/api/register", profile, now)).json()).id;

test("the day changes at midnight in India", () => {
  assert.equal(istDay(Date.UTC(2026, 10, 28, 18, 29)), "2026-11-28");
  assert.equal(istDay(Date.UTC(2026, 10, 28, 18, 31)), "2026-11-29");
});

test("a phone gets an id with only a language, a bad profile is refused, and a known phone keeps its id", async () => {
  const e = env();
  const id = await signUp(e, { lang: "hi", pin: "", variants: [] });
  assert.equal((await adminData(e.DB, NOW)).users.registered, 0);
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.equal((await post(e, "/api/register", { lang: "xx", pin: "221001", variants: ["farm"] })).status, 400);
  assert.equal((await post(e, "/api/register", { lang: "hi", pin: "12", variants: ["farm"] })).status, 400);
  assert.equal((await post(e, "/api/register", { lang: "hi", pin: "221001", variants: ["kids"] })).status, 400);
  assert.equal((await post(e, "/api/register", { lang: "hi", pin: "221001", variants: ["office", "jobs"] })).status, 400);
  const again = await (await post(e, "/api/register", { id, lang: "ta", pin: "600001", variants: ["shop"] })).json();
  assert.equal(again.id, id);
  const d = await adminData(e.DB, NOW);
  assert.equal(d.users.total, 1);
  assert.equal(d.users.registered, 1);
  assert.deepEqual(d.langs.map((l) => [l.lang, l.users]), [["ta", 1]]);
});

test("the admin panel is shut unless the request carries a good Cloudflare Access signature", async () => {
  const e = env();
  const get = (headers = {}, extra = {}, url = "https://bodhilabs.org/admin") => handle(new Request(url, { headers }), { ...e, ...extra }, NOW);
  assert.equal((await get()).status, 403);
  assert.equal((await get({ "cf-access-jwt-assertion": "a.b.c" }, { ACCESS_TEAM_DOMAIN: "t.cloudflareaccess.com", ACCESS_AUD: "aud" })).status, 403);
  assert.equal((await get({}, { ADMIN_DEV: "yes" })).status, 403); // the developer switch works only on localhost
  assert.equal((await get({}, { ADMIN_DEV: "yes" }, "http://localhost:8787/admin")).status, 200);

  // A real signature, made here with a fresh key, as Access would make it.
  const pair = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  const jwk = { ...(await crypto.subtle.exportKey("jwk", pair.publicKey)), kid: "k1" };
  const b64 = (x) => Buffer.from(x).toString("base64url");
  const sign = async (claims) => {
    const head = `${b64(JSON.stringify({ alg: "RS256", kid: "k1" }))}.${b64(JSON.stringify(claims))}`;
    return `${head}.${b64(new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", pair.privateKey, new TextEncoder().encode(head))))}`;
  };
  const cfg = { ACCESS_TEAM_DOMAIN: "team.cloudflareaccess.com", ACCESS_AUD: "aud123" };
  const certs = async () => new Response(JSON.stringify({ keys: [jwk] }));
  const who = async (claims, token) => accessEmail(new Request("https://bodhilabs.org/admin", { headers: { "cf-access-jwt-assertion": token ?? (await sign(claims)) } }), cfg, NOW, certs);
  const good = { aud: ["aud123"], iss: "https://team.cloudflareaccess.com", exp: NOW / 1000 + 600, email: "owner@example.com" };
  assert.equal(await who(good), "owner@example.com");
  assert.equal(await who({ ...good, aud: ["other"] }), null);
  assert.equal(await who({ ...good, exp: NOW / 1000 - 1 }), null);
  assert.equal(await who({ ...good, iss: "https://evil.example" }), null);
  const forged = (await sign(good)).split(".");
  forged[1] = b64(JSON.stringify({ ...good, email: "thief@example.com" }));
  assert.equal(await who(null, forged.join(".")), null);
});

test("the Open the app button uses an Android intent, with the start page in the tab as the way back", () => {
  const android = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36";
  const url = openAppUrl(android, "https://bodhilabs.org");
  assert.ok(url.startsWith("intent://bodhilabs.org/app#Intent;scheme=https;"));
  assert.ok(url.includes("S.browser_fallback_url=https%3A%2F%2Fbodhilabs.org%2Fapp;") && url.endsWith(";end"));
  assert.equal(openAppUrl("Mozilla/5.0 (Macintosh)", "https://bodhilabs.org"), "/app");
  assert.equal(openAppUrl(android, "http://localhost:8787"), "/app");
});

test("Home holds twelve subjects, turned by the rising sign", () => {
  assert.equal(SUBJECTS.length, 12);
  assert.equal(SUBJECTS[11].id, "lives"); // Meena, the twelfth sign
  assert.deepEqual(SUBJECTS.filter((x) => x.open).map((x) => [x.id, x.open]), [["word", "/word"], ["number", "/number"], ["nature", "/nature"], ["lives", "/life"]]);
  assert.equal(new Set(SUBJECTS.map((x) => x.id)).size, 12);
  for (const x of SUBJECTS) for (const l of LANG_ORDER) assert.ok(x.name[l], `${x.id} ${l}`);
  assert.deepEqual([...LANG_ORDER].sort(), LANGS.map((l) => l.id).sort());
  assert.equal(nameOf(SUBJECTS[2], "hi"), "शब्द");
  assert.equal(nameOf(SUBJECTS[2], "xx"), "Word");
  // Vrishchika (7) rising: Nature is in house 1, People in house 2, and Art comes last.
  assert.deepEqual(ring(7).map((x) => x.id), ["nature", "people", "hand", "money", "lives", "body", "music", "word", "earth", "rule", "number", "art"]);
  assert.equal(ring(0)[0].id, "body");
  for (const x of SUBJECTS) assert.ok(TRACKED.includes(tapName("gyan", x)), x.id);
  assert.deepEqual([tapName("gyan", SUBJECTS[2]), tapName("gyan", SUBJECTS[11]), tapName("gyan", SUBJECTS[0])], [WORD.id, LIFE.id, "subject:body"]);
});

test("every level is a grid of sixteen: twelve houses around and the same four in the middle", () => {
  const boxes = [...AROUND, ...CENTRE.map((c) => c.at)].map(([r, c]) => `${r},${c}`);
  assert.equal(new Set(boxes).size, 16);
  for (const [r, c] of AROUND) assert.ok(r === 1 || r === 4 || c === 1 || c === 4);
  assert.deepEqual(AROUND[0], [1, 1]); // house 1 is top left
  assert.deepEqual(AROUND[3], [1, 4]); // and they go round with the clock
  for (let i = 0; i < 12; i++) { const [a, b] = [AROUND[i], AROUND[(i + 1) % 12]]; assert.equal(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]), 1); }
  assert.deepEqual(CENTRE.map((c) => c.id), ["past", "now", "next", "ask"]);
  for (const c of CENTRE) { assert.ok(TRACKED.includes(`centre:${c.id}`)); for (const l of LANG_ORDER) assert.ok(c.name[l], `${c.id} ${l}`); }
  for (const [k, v] of Object.entries(SAY)) for (const l of LANG_ORDER) assert.ok(v[l], `${k} ${l}`);
  // Home, the top level: Gyan is open, Vartaman waits, ten boxes are empty; every press is counted.
  assert.equal(TOP.length, 12);
  assert.deepEqual(TOP.slice(0, 2).map((x) => [x.id, x.open, x.name.hi]), [["gyan", "/gyan", "ज्ञान"], ["vartaman", undefined, "वर्तमान"]]);
  assert.ok(TOP.slice(2).every((x) => !x.open && !x.picture));
  assert.equal(new Set(TOP.map((x) => x.id)).size, 12);
  for (const x of TOP) assert.ok(TRACKED.includes(tapName("top", x)), x.id);
  for (const l of LANGS) assert.ok(TOP[0].name[l.id] && TOP[1].name[l.id], l.id);
  // Inside Word: twelve houses in order, only Letters open, and it is the word game.
  assert.equal(WORD_HOUSES.length, 12);
  assert.equal(new Set(WORD_HOUSES.map((h) => h.id)).size, 12);
  assert.deepEqual(WORD_HOUSES.filter((h) => h.open).map((h) => [h.id, h.open]), [["letters", BOOK.href]]);
  for (const h of WORD_HOUSES) { assert.ok(TRACKED.includes(tapName("word", h)), h.id); for (const l of LANG_ORDER) assert.ok(h.name[l], `${h.id} ${l}`); }
  assert.deepEqual([tapName("word", WORD_HOUSES[2]), tapName("word", WORD_HOUSES[0])], [BOOK.id, "word:names"]);
});

test("the phone remembers which words go well and which need practice", () => {
  let s = {};
  for (const first of [true, true, true, false]) s = mark(s, "cow", first);
  for (const first of [false, false, true]) s = mark(s, "sun", first);
  s = mark(s, "tree", true); s = mark(s, "tree", false);
  const r = report(s, ["sun", "cow", "tree", "fish"]);
  assert.deepEqual(r.learned, ["sun", "cow", "tree"]);
  assert.deepEqual(r.strong, ["cow"]);
  assert.deepEqual(r.weak, ["sun"]);
  assert.deepEqual([r.first, r.seen], [5, 9]);
  assert.deepEqual(report({}, ["cow"]), { learned: [], strong: [], weak: [], seen: 0, first: 0 });
});

test("a question reaches the admin panel and the answer comes back to the phone that asked", async () => {
  const e = { ...env(), ADMIN_KEY: "open-sesame-42", VOICE: { get: async () => null, put: async () => {} } };
  const signIn = await handle(new Request("https://bodhilabs.org/admin", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ key: "open-sesame-42" }) }), e, NOW);
  const cookie = signIn.headers.get("set-cookie").split(";")[0];
  const a = await signUp(e), b = await signUp(e, { lang: "ta" });
  assert.equal((await post(e, "/api/ask", { user: a, text: "  मुझे गिनती कब मिलेगी?  " })).status, 200);
  assert.equal((await post(e, "/api/ask", { user: a, text: "" })).status, 400);
  assert.equal((await post(e, "/api/ask", { user: a, text: "x".repeat(501) })).status, 400);
  assert.equal((await post(e, "/api/ask", { user: "00000000-0000-0000-0000-000000000000", text: "hello" })).status, 404);
  const list = async (id) => (await handle(new Request(`https://bodhilabs.org/api/ask?user=${id}`), e, NOW)).json();
  let mine = (await list(a)).questions;
  assert.deepEqual(mine.map((q) => [q.text, q.reply]), [["मुझे गिनती कब मिलेगी?", ""]]);
  assert.deepEqual((await list(b)).questions, []);
  assert.equal((await handle(new Request("https://bodhilabs.org/api/ask?user=nobody"), e, NOW)).status, 404);
  const d = await adminData(e.DB, NOW);
  assert.deepEqual(d.questions.open.map((q) => [q.lang, q.text]), [["hi", "मुझे गिनती कब मिलेगी?"]]);
  assert.match(await adminPage(e.DB, NOW, "x"), /Questions \(1 waiting\)/);
  const answer = (env2, id, reply, headers = {}) => handle(new Request("https://bodhilabs.org/admin/reply", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", ...headers }, body: new URLSearchParams({ id, reply }) }), env2, NOW);
  assert.equal((await answer(e, mine[0].id, "soon")).status, 403, "only the owner answers");
  assert.equal((await answer(e, mine[0].id, "soon", { cookie, origin: "https://evil.example" })).status, 403);
  assert.equal((await answer(e, mine[0].id, "जल्दी ही <b>", { cookie })).status, 303);
  mine = (await list(a)).questions;
  assert.equal(mine[0].reply, "जल्दी ही <b>");
  const page = await adminPage(e.DB, NOW, "x");
  assert.match(page, /Questions \(0 waiting\)/);
  assert.ok(page.includes("जल्दी ही &lt;b&gt;") && !page.includes("जल्दी ही <b>"));
  for (let i = 0; i < 4; i++) assert.equal((await post(e, "/api/ask", { user: a, text: `q${i}` })).status, 200);
  assert.equal((await post(e, "/api/ask", { user: a, text: "one too many" })).status, 429, "five a day");
  // The phone looks for an answer only while it waits for one, and at most once an hour.
  assert.equal(shouldLook({}, 1e9), false);
  assert.equal(shouldLook({ waiting: true, checked: 0 }, 3600000), true);
  assert.equal(shouldLook({ waiting: true, checked: 1000 }, 60000), false);
  assert.deepEqual(afterLook({ waiting: true }, [{ reply: "yes" }, { reply: "" }], 5), { waiting: true, checked: 5, fresh: true, answered: 1 });
  assert.deepEqual(afterLook({ fresh: true, answered: 1 }, [{ reply: "yes" }], 6, true), { waiting: false, checked: 6, fresh: false, answered: 1 });
});

test("every kind of work, list and sign has a word", () => {
  for (const v of VARIANTS.filter((x) => x.adult)) assert.ok(STR.en[`v_${v.id}`], v.id);
  for (const l of Object.keys(LISTS)) assert.ok(STR.en[`l_${l}`], l);
  assert.equal(SIGNS.length, 12);
  for (const s of SIGNS) assert.ok(STR.en[s.key], s.key);
  assert.ok(STR.en[BOOK.id]);
});

test("taps wait on the phone and are taken off only when sent", () => {
  let p = addTap({}, "subject:number");
  p = addTap(p, "subject:number");
  p = addTap(p, "book");
  p = addTap(p, "subject:money");
  p = addTap(p, "icon:nothing");
  assert.deepEqual(p, { "subject:number": 2, book: 1, "subject:money": 1 });
  assert.deepEqual(subtract({ book: 3, "subject:number": 1 }, { book: 2, "subject:number": 1 }), { book: 1 });
  const me = { ...blank(), uid: "", lang: "hi", name: "Asha" };
  assert.deepEqual(profileOf(me), { id: undefined, lang: "hi", pin: "", variants: [] });
});

test("the admin panel shows which subjects are pressed, which lives are shown and how many are heard", async () => {
  const e = env();
  const a = await signUp(e), b = await signUp(e);
  await post(e, "/api/tap", { user: a, taps: { "subject:number": 3, lives: 2, "life:einstein": 2, heard: 1, "centre:now": 1, word: 1, "word:names": 2 } });
  await post(e, "/api/tap", { user: b, taps: { "subject:number": 1, book: 1, "life:leonardo": 1 } });
  const d = await adminData(e.DB, NOW);
  assert.equal(d.subjects.length, 12);
  assert.deepEqual([d.subjects[0].id, d.subjects[0].users, d.subjects[0].taps], ["number", 2, 4]);
  assert.deepEqual(d.subjects.filter((x) => x.taps).map((x) => x.id).sort(), ["lives", "number", "word"]);
  assert.deepEqual(d.lives.map((l) => [l.id, l.taps]), [["einstein", 2], ["leonardo", 1], ["aryabhata", 0]]);
  assert.equal(d.heard.taps, 1);
  assert.deepEqual(d.centre.map((c) => [c.id, c.users]), [["past", 0], ["now", 1], ["next", 0], ["ask", 0]]);
  assert.deepEqual(d.houses.slice(0, 3).map((h) => [h.n, h.id, h.taps]), [[1, "names", 2], [2, "sounds", 0], [3, "letters", 1]]);
  assert.match(await adminPage(e.DB, NOW, "x"), /Inside Word/);
  assert.deepEqual(d.top.slice(0, 3).map((x) => [x.n, x.id, x.name]), [[1, "gyan", "Gyan"], [2, "vartaman", "Vartaman"], [3, "top:3", "Empty box"]]);
  const html = await adminPage(e.DB, NOW, "owner@example.com");
  assert.match(html, /Subjects pressed/);
  assert.match(html, /Lives shown/);
  assert.match(html, /Albert Einstein/);
  assert.match(html, /owner@example\.com/);
});

test("counts from an unknown phone, for unknown things, or to a removed address are refused", async () => {
  const e = env();
  assert.equal((await post(e, "/api/tap", { user: "00000000-0000-0000-0000-000000000000", taps: { book: 1 } })).status, 404);
  const id = await signUp(e);
  assert.equal((await post(e, "/api/tap", { user: id, taps: { nothing: 1 } })).status, 400);
  assert.equal((await post(e, "/api/wish", { user: id, text: "anything" })).status, 404);
  assert.equal((await handle(new Request("https://bodhilabs.org/api/tap"), e, NOW)).status, 405);
  assert.equal((await handle(new Request("https://bodhilabs.org/api/other"), e, NOW)).status, 404);
  assert.equal(await (await handle(new Request("https://bodhilabs.org/home"), e, NOW)).text(), "page");
  const from = async (cf) => (await handle(Object.assign(new Request("https://bodhilabs.org/api/where"), { cf }), e, NOW)).json();
  assert.deepEqual(await from({ country: "IN", regionCode: "MH" }), { state: "MH" });
  assert.deepEqual(await from({ country: "US", regionCode: "CA" }), { state: "" });
  assert.deepEqual(await from(undefined), { state: "" });
});

test("Lives opens a different life each time, in the person's language or else English", () => {
  assert.ok(LIVES.length >= 2);
  for (const l of LIVES) { assert.ok(l.picture && l.years && l.name.en && l.text.en, l.id); assert.ok(l.text.en.length <= 2500, l.id); }
  let last = null;
  for (let i = 0; i < 200; i++) {
    const next = nextLife(last, (i * 0.37) % 1);
    assert.notEqual(next.id, last);
    last = next.id;
  }
  assert.ok(nextLife(null, 0.999999));
  assert.equal(lifeLang(LIVES[0], "hi"), "hi");
  assert.equal(lifeLang(LIVES[0], "ta"), "en");
  assert.ok(TRACKED.includes(LIFE.id) && TRACKED.includes("heard"));
  for (const l of LIVES) assert.ok(TRACKED.includes(`life:${l.id}`));
  assert.equal(addTap({}, "life:einstein")["life:einstein"], 1);
});

test("a browser tab is sent to the install page, the installed app never", () => {
  assert.equal(mustInstall({ path: "/home", standalone: false, host: "bodhilabs.org" }), true);
  assert.equal(mustInstall({ path: "/app", standalone: false, host: "www.bodhilabs.org" }), true);
  assert.equal(mustInstall({ path: "/home", standalone: true, host: "bodhilabs.org" }), false);
  assert.equal(mustInstall({ path: "/", standalone: false, host: "bodhilabs.org" }), false);
  assert.equal(mustInstall({ path: "/book", standalone: false, host: "localhost" }), false);
  // The installed app is known in every way a browser may show it, and is never asked to install.
  const mode = (m) => ({ media: (q) => q === `(display-mode: ${m})` });
  for (const m of ["standalone", "minimal-ui", "window-controls-overlay", "tabbed"]) assert.equal(isInstalled(mode(m)), true, m);
  assert.equal(isInstalled(mode("browser")), false);
  assert.equal(isInstalled({ standalone: true }), true);
  assert.equal(isInstalled({ referrer: "android-app://org.chromium.webapk" }), true);
  assert.equal(isInstalled({ marked: true }), true);
  assert.equal(isInstalled(), false);
});

test("every spoken text gets a man's voice and a woman's, Indian first", async () => {
  const { pair } = await import("../lib/speak.js");
  const v = (name, lang) => ({ name, lang });
  const named = pair([v("Google US English", "en-US"), v("Rishi", "en-IN"), v("Veena", "en-IN")], "en-IN", 0.1);
  assert.deepEqual(named.map((x) => [x.who, x.voice.name, x.pitch]), [["man", "Rishi", 1], ["woman", "Veena", 1]]);
  assert.equal(pair([v("Rishi", "en-IN"), v("Veena", "en-IN")], "en-IN", 0.9)[0].who, "woman"); // the order is random
  const one = pair([v("Google हिन्दी", "hi-IN")], "hi-IN", 0.1); // one voice: lower, then higher
  assert.deepEqual(one.map((x) => [x.who, x.voice.name]), [["man", "Google हिन्दी"], ["woman", "Google हिन्दी"]]);
  assert.ok(one[0].pitch < 1 && one[1].pitch > 1);
  const none = pair([], "or-IN", 0.1);
  assert.equal(none.length, 2);
  assert.equal(none[0].voice, null);
  // The word game waits for this: `done` comes only after both voices have ended.
  const { say } = await import("../lib/speak.js");
  const ends = [];
  globalThis.speechSynthesis = { cancel() {}, getVoices: () => [], speak: (u) => ends.push(u.onend) };
  globalThis.SpeechSynthesisUtterance = class {};
  let finished = false;
  assert.equal(say("cow", "ur", () => { finished = true; }), true);
  const tick = () => new Promise((r) => setTimeout(r, 0));
  await tick(); ends[0](); assert.equal(finished, false, "one voice is not enough");
  await tick(); ends[1](); await tick(); assert.equal(finished, true);
  delete globalThis.speechSynthesis; delete globalThis.SpeechSynthesisUtterance;
});

test("a recording is made once by Sarvam, saved, and only for the app's own words", async () => {
  const { voice } = await import("../worker/voice.js");
  const { spoken, clipUrl, SARVAM_LANG } = await import("../lib/voice.js");
  assert.ok(spoken("hi").includes("गाय") && spoken("hi").includes("नमस्ते। आइए पढ़ें।") && spoken("hi").includes("क"));
  assert.equal(SARVAM_LANG.or, "od-IN");
  assert.equal(SARVAM_LANG.ur, undefined);
  const store = new Map();
  const VOICE = { get: async (k) => store.get(k) ?? null, put: async (k, v) => { store.set(k, v.buffer ?? v); } };
  const calls = [];
  const sarvam = async (url, init) => { calls.push([url, init]); return Response.json({ audios: [btoa("mp3!")] }); };
  const ask = (path, env) => voice(new Request(`https://bodhilabs.org${path}`), env, sarvam);
  const env = { VOICE, SARVAM_API_KEY: "k" };
  const url = clipUrl("hi", "woman", "गाय");
  const first = await ask(url, env);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("content-type"), "audio/mpeg");
  assert.equal(await first.text(), "mp3!");
  const sent = JSON.parse(calls[0][1].body);
  assert.deepEqual([calls[0][0], sent.text, sent.language_code, sent.speaker, sent.output_audio_codec], ["https://api.sarvam.ai/text-to-speech", "गाय", "hi-IN", "ishita", "mp3"]);
  assert.equal(calls[0][1].headers["api-subscription-key"], "k");
  assert.equal(await (await ask(url, env)).text(), "mp3!");
  assert.equal(calls.length, 1, "the second time it is read, not made");
  assert.equal(JSON.parse((await ask(clipUrl("or", "man", spoken("or")[0]), env), calls[1][1].body)).language_code, "od-IN");
  assert.equal((await ask(clipUrl("hi", "woman", "anything else"), env)).status, 404);
  assert.equal((await ask(clipUrl("ur", "woman", spoken("ur")[0]), env)).status, 404);
  assert.equal((await ask(clipUrl("hi", "robot", "गाय"), env)).status, 404);
  assert.equal((await ask(clipUrl("hi", "man", "गाय"), { VOICE })).status, 503, "no key: the phone speaks instead");
  assert.equal(calls.length, 2);
  // A whole life is read the same way, by its id.
  const { lifeUrl } = await import("../lib/voice.js");
  const life = await ask(lifeUrl("hi", "man", "einstein"), env);
  assert.equal(life.status, 200);
  const read = JSON.parse(calls[2][1].body);
  assert.ok(read.text.startsWith("अल्बर्ट आइंस्टीन") && read.speaker === "shubh");
  await ask(lifeUrl("hi", "man", "einstein"), env);
  assert.equal(calls.length, 3);
  assert.equal((await ask(lifeUrl("hi", "man", "nobody"), env)).status, 404);
  assert.equal((await ask(lifeUrl("ta", "man", "einstein"), env)).status, 404, "no Tamil text yet");
});

test("where people come from and how far they get", async () => {
  const { refOf } = await import("../lib/track.js");
  assert.equal(refOf("?from=WhatsApp", "", "bodhilabs.org"), "whatsapp");
  assert.equal(refOf("?utm_source=yt", "https://x.com/a", "bodhilabs.org"), "yt");
  assert.equal(refOf("", "https://www.youtube.com/watch?v=1", "bodhilabs.org"), "youtube.com");
  assert.equal(refOf("", "https://www.bodhilabs.org/home", "bodhilabs.org"), "");
  assert.equal(refOf("?from=<script>", "", "bodhilabs.org"), "");
  const e = env();
  const reg = async (body, cf) => (await handle(Object.assign(new Request("https://bodhilabs.org/api/register", { method: "POST", body: JSON.stringify(body) }), { cf }), e, NOW)).json();
  const a = await reg({ lang: "hi", ref: "whatsapp" }, { country: "IN", regionCode: "UP" });
  await reg({ lang: "hi", ref: "bad ref!" }, { country: "IN", regionCode: "UP" });
  await reg({ lang: "ta" }, { country: "US", regionCode: "CA" });
  for (const name of ["visit", "visit", "visit", "install"]) assert.equal((await post(e, "/api/count", { name })).status, 200);
  assert.equal((await post(e, "/api/count", { name: "other" })).status, 400);
  await post(e, "/api/tap", { user: a.id, taps: { gyan: 1, word: 1, book: 1, answer: 3, right: 1 } });
  const d = await adminData(e.DB, NOW);
  assert.deepEqual(d.states.map((r) => [r.state, r.users]), [["UP", 2], ["US", 1]]);
  assert.deepEqual(d.refs.map((r) => [r.ref, r.users]), [["", 2], ["whatsapp", 1]]);
  assert.deepEqual(d.funnel.map((f) => f.total), [3, 1, 3, 1, 1, 1, 1, 1]);
  assert.deepEqual(d.funnel.map((f) => f.today), [3, 1, 3, 1, 1, 1, 1, 1]);
  assert.match(await adminPage(e.DB, NOW, "x"), /How far people get/);
});

test("the passcode opens the admin panel and the phone stays signed in", async () => {
  const e = { ...env(), ADMIN_KEY: "open-sesame-42" };
  const kv = new Map();
  e.VOICE = { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } };
  const at = (init = {}) => handle(new Request("https://bodhilabs.org/admin", init), e, NOW);
  const form = (key) => at({ method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://bodhilabs.org" }, body: new URLSearchParams({ key }) });
  const box = await at();
  assert.equal(box.status, 200);
  assert.match(await box.text(), /Passcode/);
  assert.equal((await form("wrong")).status, 401);
  const ok = await form("open-sesame-42");
  assert.equal(ok.status, 303);
  const cookie = ok.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly; Secure/);
  const inside = await at({ headers: { cookie: cookie.split(";")[0] } });
  assert.match(await inside.text(), /How far people get/);
  assert.match(await (await at({ headers: { cookie: "bl_admin=forged" } })).text(), /Passcode/);
  assert.equal((await at({ method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://evil.example" }, body: new URLSearchParams({ key: "open-sesame-42" }) })).status, 403);
  for (let i = 0; i < 20; i++) await form("wrong");
  assert.equal((await form("open-sesame-42")).status, 429, "too many wrong tries shuts the door for the day");
  assert.equal((await handle(new Request("https://bodhilabs.org/admin"), { ...env(), ADMIN_KEY: "short" }, NOW)).status, 403, "a short passcode is not accepted");
});

test("the lagna: the rising sign for a place and a moment", async () => {
  const { lagna, houses, risingDegree, UJJAIN } = await import("../lib/lagna.js");
  // At sunrise the rising sign is the Sun's own. On 28 November 2026 the Sun is in Vrishchika (7); sunrise at Ujjain is near 06:50.
  const sunrise = Date.UTC(2026, 10, 28, 1, 20);
  assert.equal(lagna(sunrise, UJJAIN), 7);
  // At sunset the opposite sign rises: Vrishabha (1).
  assert.equal(lagna(Date.UTC(2026, 10, 28, 12, 10), UJJAIN), 1);
  // A day holds all twelve signs, and the sign changes about every two hours.
  const seen = new Set();
  let changes = 0, last = -1;
  for (let m = 0; m < 1440; m += 5) { const s = lagna(sunrise + m * 60000, UJJAIN); seen.add(s); if (s !== last) changes++; last = s; }
  assert.equal(seen.size, 12);
  assert.ok(changes >= 12 && changes <= 13);
  assert.deepEqual(houses(sunrise, UJJAIN), [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6]);
  // Farther east the same sign rises earlier: Kolkata is ahead of Dwarka.
  const at = Date.UTC(2026, 10, 28, 6, 0);
  const ahead = (risingDegree(at, { lat: 22.57, lon: 88.36 }) - risingDegree(at, { lat: 22.24, lon: 68.97 }) + 360) % 360;
  assert.ok(ahead > 5 && ahead < 40);
  assert.equal(lagna(sunrise), lagna(sunrise, UJJAIN)); // no place given: Ujjain
});

test("a place guesses the language, and a phone that says no changes nothing", async () => {
  const { placeLang, askPlace } = await import("../lib/place.js");
  const at = (lat, lon) => placeLang({ lat, lon });
  assert.deepEqual([at(12.97, 77.59), at(13.08, 80.27), at(19.08, 72.88), at(22.57, 88.36), at(26.85, 80.95), at(8.52, 76.94), at(20.3, 85.82), at(23.02, 72.57), at(17.39, 78.49)],
    ["kn", "ta", "mr", "bn", "hi", "ml", "or", "gu", "te"]);
  assert.equal(at(51.5, -0.12), ""); // London: no guess
  assert.equal(placeLang(null), "");
  assert.equal(firstGuess(["en-IN"], "UP", "kn"), "kn"); // the person's own place beats the network's state
  assert.equal(firstGuess(["ta-IN", "en"], "UP", "kn"), "ta"); // the phone's own Indian language beats both
  assert.equal(firstGuess(["en-IN"], "UP", ""), "hi");
  assert.equal(await askPlace(null), null);
  assert.equal(await askPlace({ getCurrentPosition: (ok, no) => no(new Error("denied")) }), null);
  const p = await askPlace({ getCurrentPosition: (ok) => ok({ coords: { latitude: 12.9716, longitude: 77.5946 } }) });
  assert.deepEqual(p, { lat: 13, lon: 77.6 });
});

test("a lesson is scenes: a drawing and a spoken line, recorded once under the line's name", async () => {
  const { LESSONS, lessonsOf, lessonLang, lineId, lineText } = await import("../lib/lessons.js");
  const { lineUrl } = await import("../lib/voice.js");
  const { voice } = await import("../worker/voice.js");
  const fs = await import("node:fs");
  const art = ["../components/LessonArt.jsx", "../components/art/zero.jsx"].map((f) => fs.readFileSync(new URL(f, import.meta.url), "utf8")).join("\n");
  assert.equal(lessonsOf("nature", 1).length, 7);
  for (const l of LESSONS) {
    assert.ok(l.by.hi && l.by.en && ["man", "woman"].includes(l.who) && l.scenes[0].art === "teller" && l.scenes[0].say.hi.startsWith(`मैं ${l.by.hi} हूँ`), `${l.id}: told by a named person, who says so first`);
    assert.ok(TRACKED.includes(`lesson:${l.id}`) && TRACKED.includes(`watched:${l.id}`));
    for (const s of l.scenes) {
      assert.ok(s.say.hi && s.say.en, `${l.id}: every line in Hindi and English`);
      assert.ok(new RegExp(`\\n  ${s.art}: \\(`).test(art), `${l.id}: the drawing "${s.art}" exists`);
    }
  }
  const fire = LESSONS.find((l) => l.id === "fire");
  assert.equal(lessonLang(fire, "hi"), "hi");
  assert.equal(lessonLang(fire, "ta"), "en"); // not written yet: heard in English
  assert.equal(lineText(lineId(fire, 2), "hi"), fire.scenes[2].say.hi);
  assert.equal(lineText("fire.99", "hi"), "");
  const store = new Map(), calls = [];
  const env = { SARVAM_API_KEY: "k", VOICE: { get: async (k) => store.get(k) ?? null, put: async (k, v) => { store.set(k, v.buffer ?? v); } } };
  const sarvam = async (url, init) => { calls.push(JSON.parse(init.body)); return Response.json({ audios: [btoa("mp3!")] }); };
  const ask = (path) => voice(new Request(`https://bodhilabs.org${path}`), env, sarvam);
  assert.equal((await ask(lineUrl("hi", "man", "fire.2"))).status, 200);
  assert.equal(calls[0].text, fire.scenes[2].say.hi);
  assert.equal((await ask(lineUrl("hi", "man", "fire.2"))).status, 200);
  assert.equal(calls.length, 1, "made once, then read");
  assert.equal((await ask(lineUrl("hi", "man", "fire.99"))).status, 404);
  assert.equal((await ask(lineUrl("ta", "man", "fire.2"))).status, 404);
});

test("a chapter is told in one named voice, and its sums are right", async () => {
  const { CHAPTERS, LESSONS, chaptersOf } = await import("../lib/lessons.js");
  const { inVoiceOf, notTheirWords } = await import("../lib/narrators.js");
  assert.deepEqual(chaptersOf("number").map((c) => c.id), ["zero"]);
  for (const c of CHAPTERS) {
    assert.ok(c.by.hi && c.by.en && ["man", "woman"].includes(c.who), `${c.id}: a teller`);
    for (const l of LANG_ORDER) { assert.ok(inVoiceOf(c.by, l).includes(c.by[l] ?? c.by.en), l); assert.ok(notTheirWords(l)); }
    for (const l of c.lessons) {
      const whole = LESSONS.find((x) => x.id === l.id);
      assert.equal(whole.by, c.by); assert.equal(whole.who, c.who); assert.equal(whole.stage, c.stage);
      assert.ok(l.name.hi && l.name.en);
      for (const [sum, choices, good] of l.ask) {
        assert.equal(choices.length, 3);
        if (sum.includes("◻")) continue; // a sign to choose, not a sum
        const value = (t) => Function(`return ${t.replaceAll("−", "-").replaceAll("×", "*").replaceAll("÷", "/")}`)() + 0; // + 0 turns −0 into 0
        assert.equal(value(sum), value(choices[good]), `${l.id}: ${sum}`);
        assert.equal(choices.filter((x) => value(x) === value(sum)).length, 1, `${l.id}: ${sum} has one right answer`);
      }
    }
  }
});
