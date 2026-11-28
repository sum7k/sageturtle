import test from "node:test";
import assert from "node:assert/strict";
import { BOOK, ICONS, ICON_IDS, JOKER, LOCKED, SURPRISE_IDS, SURPRISES, TRACKED, iconsFor, surprise } from "../lib/buttons.js";
import { mustInstall, openAppUrl } from "../lib/browser.js";
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

test("eleven languages, English among them, and every word exists in every language", () => {
  assert.equal(LANGS.length, 11);
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
  assert.equal(Object.keys(WORDS).length, 11);
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

test("Home has Book and ten greyed pictures, which change by phone and by day", () => {
  assert.equal(LOCKED, 10);
  assert.ok(ICON_IDS.length >= 30);
  for (const id of ICON_IDS) assert.ok(ICONS[id], id);
  const a = iconsFor("bodhi11111", "2026-11-28");
  assert.equal(a.length, 10);
  assert.equal(new Set(a).size, 10);
  assert.ok(a.every((id) => ICONS[id]));
  assert.deepEqual(a, iconsFor("bodhi11111", "2026-11-28")); // the same all day
  assert.notDeepEqual(a, iconsFor("bodhi11111", "2026-11-29"));
  assert.notDeepEqual(a, iconsFor("bodhi22222", "2026-11-28"));
  const shown = new Set();
  for (let i = 0; i < 60; i++) for (const id of iconsFor(`phone${i}`, "2026-11-28")) shown.add(id);
  assert.equal(shown.size, ICON_IDS.length, "every picture gets shown to someone");
  assert.equal(today(Date.UTC(2026, 10, 28, 18, 31)), "2026-11-29");
});

test("every kind of work, list and sign has a word", () => {
  for (const v of VARIANTS.filter((x) => x.adult)) assert.ok(STR.en[`v_${v.id}`], v.id);
  for (const l of Object.keys(LISTS)) assert.ok(STR.en[`l_${l}`], l);
  assert.equal(SIGNS.length, 12);
  for (const s of SIGNS) assert.ok(STR.en[s.key], s.key);
  assert.ok(STR.en[BOOK.id]);
});

test("taps wait on the phone and are taken off only when sent", () => {
  let p = addTap({}, "icon:money");
  p = addTap(p, "icon:money");
  p = addTap(p, "book");
  p = addTap(p, "seen:money");
  p = addTap(p, "icon:nothing");
  assert.deepEqual(p, { "icon:money": 2, book: 1, "seen:money": 1 });
  assert.deepEqual(subtract({ book: 3, "icon:money": 1 }, { book: 2, "icon:money": 1 }), { book: 1 });
  const me = { ...blank(), uid: "", lang: "hi", name: "Asha" };
  assert.deepEqual(profileOf(me), { id: undefined, lang: "hi", pin: "", variants: [] });
});

test("a picture is ranked by the share of people who tapped it after being shown it", async () => {
  const e = env();
  const a = await signUp(e);
  const b = await signUp(e, { lang: "en" });
  const c = await signUp(e, { lang: "ta" });
  for (const u of [a, b, c]) assert.equal((await post(e, "/api/tap", { user: u, taps: { "seen:money": 1, "seen:cricket": 1 } })).status, 200);
  assert.equal((await post(e, "/api/tap", { user: a, taps: { "icon:money": 3, book: 1 } })).status, 200);
  assert.equal((await post(e, "/api/tap", { user: a, taps: { "icon:money": 2 } })).status, 200);
  assert.equal((await post(e, "/api/tap", { user: b, taps: { "icon:money": 1, "icon:cricket": 1, "icon:nothing": 9, "icon:tv": 100000 } })).status, 200);
  const d = await adminData(e.DB, NOW);
  const of = (id) => d.icons.find((x) => x.id === id);
  assert.deepEqual([of("money").seen, of("money").users, of("money").taps], [3, 2, 6]);
  assert.equal(Math.round(of("money").rate * 100), 67);
  assert.equal(Math.round(of("cricket").rate * 100), 33);
  assert.equal(of("tv").taps, 500);
  assert.equal(of("tv").rate, 0); // tapped but never counted as shown
  assert.equal(of("music").taps, 0);
  assert.equal(d.icons[0].id, "money");
  assert.equal(d.icons.length, ICON_IDS.length);
  assert.deepEqual([d.book.users, d.book.taps], [1, 1]);
  assert.equal(d.users.active_today, 3);
  const html = await adminPage(e.DB, NOW, "owner@example.com");
  assert.ok(html.includes("67%") && html.includes("💰") && html.includes("owner@example.com"));
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

test("the joker shows a different surprise each time, and both are counted", () => {
  assert.ok(SURPRISE_IDS.includes("speak"));
  for (const id of SURPRISE_IDS) assert.ok(SURPRISES[id], id);
  let last = null;
  for (let i = 0; i < 200; i++) {
    const next = surprise(last, (i * 0.37) % 1);
    assert.ok(SURPRISE_IDS.includes(next));
    assert.notEqual(next, last);
    last = next;
  }
  assert.ok(SURPRISE_IDS.includes(surprise(null, 0.999999)));
  assert.ok(TRACKED.includes(JOKER.id));
  for (const id of SURPRISE_IDS) assert.ok(TRACKED.includes(`joker:${id}`));
  assert.equal(addTap({}, "joker:speak")["joker:speak"], 1);
});

test("a browser tab is sent to the install page, the installed app never", () => {
  assert.equal(mustInstall({ path: "/home", standalone: false, host: "bodhilabs.org" }), true);
  assert.equal(mustInstall({ path: "/app", standalone: false, host: "www.bodhilabs.org" }), true);
  assert.equal(mustInstall({ path: "/home", standalone: true, host: "bodhilabs.org" }), false);
  assert.equal(mustInstall({ path: "/", standalone: false, host: "bodhilabs.org" }), false);
  assert.equal(mustInstall({ path: "/book", standalone: false, host: "localhost" }), false);
});
