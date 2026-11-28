import test from "node:test";
import assert from "node:assert/strict";
import { BUTTONS, TRACKED } from "../lib/buttons.js";
import { LANGS, langById, guessLang } from "../lib/langs.js";
import { STR, t } from "../lib/strings.js";
import { LETTERS, lettersFor } from "../lib/book.js";
import { SIGNS, LINES, lineFor } from "../lib/horoscope.js";
import { addTap, subtract, profileOf } from "../lib/track.js";
import { VARIANTS, LISTS } from "../lib/variants.js";
import { blank } from "../lib/store.js";
import { handle, istDay } from "../worker/index.js";
import { accessEmail } from "../worker/access.js";
import { adminData, adminPage } from "../worker/admin.js";
import { testDb } from "./d1.js";

test("Home has eleven buttons, and only the first row is open: Book, Horoscope, Khabri", () => {
  assert.equal(BUTTONS.length, 11);
  assert.deepEqual(BUTTONS.filter((b) => b.open).map((b) => b.id), ["book", "horoscope", "khabri"]);
  assert.deepEqual(BUTTONS.slice(0, 3).map((b) => b.id), ["book", "horoscope", "khabri"]);
  for (const b of BUTTONS) assert.equal(!!b.href, !!b.open, b.id);
  assert.equal(new Set(BUTTONS.map((b) => b.id)).size, 11);
});

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
  assert.equal(t("xx", "send"), "Send");
});

test("every button, kind of work, list and sign has a word", () => {
  for (const b of BUTTONS) assert.ok(STR.en[b.id], b.id);
  for (const v of VARIANTS.filter((x) => x.adult)) assert.ok(STR.en[`v_${v.id}`], v.id);
  for (const l of Object.keys(LISTS)) assert.ok(STR.en[`l_${l}`], l);
  assert.equal(SIGNS.length, 12);
  for (const s of SIGNS) assert.ok(STR.en[s.key], s.key);
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

test("taps wait on the phone and are taken off only when sent", () => {
  let p = addTap({}, "earn");
  p = addTap(p, "earn");
  p = addTap(p, "book");
  p = addTap(p, "nothing");
  assert.deepEqual(p, { earn: 2, book: 1 });
  assert.deepEqual(subtract({ earn: 3, book: 1 }, { earn: 2, book: 1 }), { earn: 1 });
  const me = { ...blank(), uid: "", lang: "hi", pin: "221001", variants: ["farm"], name: "Asha" };
  assert.deepEqual(profileOf(me), { id: undefined, lang: "hi", pin: "221001", variants: ["farm"] });
});

const NOW = Date.UTC(2026, 10, 28, 6); // 11:30 in India
const env = () => ({ DB: testDb(), ASSETS: { fetch: async () => new Response("page") } });
const post = (e, path, body, now = NOW) => handle(new Request(`https://bodhilabs.org${path}`, { method: "POST", body: JSON.stringify(body) }), e, now);
const signUp = async (e, profile = { lang: "hi", pin: "221001", variants: ["farm"] }, now = NOW) => (await (await post(e, "/api/register", profile, now)).json()).id;

test("the day changes at midnight in India", () => {
  assert.equal(istDay(Date.UTC(2026, 10, 28, 18, 29)), "2026-11-28");
  assert.equal(istDay(Date.UTC(2026, 10, 28, 18, 31)), "2026-11-29");
});

test("registration gives an id, refuses a bad profile, and a known phone keeps its id", async () => {
  const e = env();
  const id = await signUp(e);
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.equal((await post(e, "/api/register", { lang: "xx", pin: "221001", variants: ["farm"] })).status, 400);
  assert.equal((await post(e, "/api/register", { lang: "hi", pin: "12", variants: ["farm"] })).status, 400);
  assert.equal((await post(e, "/api/register", { lang: "hi", pin: "221001", variants: ["kids"] })).status, 400);
  assert.equal((await post(e, "/api/register", { lang: "hi", pin: "221001", variants: ["office", "jobs"] })).status, 400);
  const again = await (await post(e, "/api/register", { id, lang: "ta", pin: "600001", variants: ["shop"] })).json();
  assert.equal(again.id, id);
  const d = await adminData(e.DB, NOW);
  assert.equal(d.users.total, 1);
  assert.deepEqual(d.langs.map((l) => [l.lang, l.users]), [["ta", 1]]);
});

test("taps are counted per button, and a person counts once however often they tap", async () => {
  const e = env();
  const a = await signUp(e);
  const b = await signUp(e, { lang: "en", pin: "110001", variants: ["shop", "farm"] });
  assert.equal((await post(e, "/api/tap", { user: a, taps: { earn: 3, book: 1 } })).status, 200);
  assert.equal((await post(e, "/api/tap", { user: a, taps: { earn: 2 } })).status, 200);
  assert.equal((await post(e, "/api/tap", { user: b, taps: { earn: 1, nothing: 9, events: 100000 } })).status, 200);
  assert.equal((await post(e, "/api/tap", { user: b, taps: { earn: 4 } }, NOW - 3 * 86400000)).status, 200);
  const d = await adminData(e.DB, NOW);
  const earn = d.buttons.find((x) => x.button === "earn");
  assert.deepEqual([earn.taps, earn.users, earn.taps_today, earn.users_today, earn.taps_week, earn.users_week], [10, 2, 6, 2, 10, 2]);
  assert.equal(d.buttons.find((x) => x.button === "events").taps, 500);
  assert.equal(d.buttons.find((x) => x.button === "messages").taps, 0);
  assert.equal(d.buttons.length, TRACKED.length);
  assert.equal(d.users.active_today, 1); // b's last tap in this test was sent with an older clock
  assert.deepEqual(d.variants.map((v) => [v.variant, v.users]).sort(), [["farm", 2], ["shop", 1]]);
});

test("taps and answers from an unknown phone are refused", async () => {
  const e = env();
  assert.equal((await post(e, "/api/tap", { user: "00000000-0000-0000-0000-000000000000", taps: { earn: 1 } })).status, 404);
  assert.equal((await post(e, "/api/wish", { user: "nobody", text: "a ration shop finder" })).status, 404);
  const id = await signUp(e);
  assert.equal((await post(e, "/api/tap", { user: id, taps: { nothing: 1 } })).status, 400);
  assert.equal((await post(e, "/api/wish", { user: id, text: "   " })).status, 400);
  assert.equal((await handle(new Request("https://bodhilabs.org/api/tap"), e, NOW)).status, 405);
  assert.equal((await handle(new Request("https://bodhilabs.org/api/other"), e, NOW)).status, 404);
  assert.equal(await (await handle(new Request("https://bodhilabs.org/home"), e, NOW)).text(), "page");
});

test("an answer is saved, cut to size, and shown safely on the admin panel", async () => {
  const e = env();
  const id = await signUp(e);
  assert.equal((await post(e, "/api/wish", { user: id, lang: "hi", text: "<script>alert(1)</script> मंडी के भाव" + "x".repeat(900) })).status, 200);
  const d = await adminData(e.DB, NOW);
  assert.equal(d.wishes.length, 1);
  assert.equal(d.wishes[0].text.length, 500);
  const html = await adminPage(e.DB, NOW, "owner@example.com");
  assert.ok(html.includes("&lt;script&gt;") && !html.includes("<script>alert"));
  assert.ok(html.includes("मंडी के भाव") && html.includes("owner@example.com"));
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
