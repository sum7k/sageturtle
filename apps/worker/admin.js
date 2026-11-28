// The admin panel: one page of numbers, made on the server from the database. English only; it is for the owner.
import { BUTTONS, TRACKED } from "../lib/buttons.js";
import { LANGS } from "../lib/langs.js";
import { VARIANTS } from "../lib/variants.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const num = (n) => Number(n ?? 0).toLocaleString("en-IN");
const day = (now, back = 0) => new Date(now + 19800000 - back * 86400000).toISOString().slice(0, 10);
const NAME = { ...Object.fromEntries(BUTTONS.map((b) => [b.id, b.id[0].toUpperCase() + b.id.slice(1)])), ad: "Ad on Home", me: "Me" };

/** Everything the panel shows, as plain data. */
export async function adminData(db, now = Date.now()) {
  const today = day(now);
  const week = day(now, 6);
  const all = (sql, ...args) => db.prepare(sql).bind(...args).all().then((r) => r.results);
  const [users, buttons, langs, variants, signups, wishes] = await Promise.all([
    db.prepare(`SELECT COUNT(*) AS total, SUM(pin <> '') AS registered, SUM(created_day = ?1) AS new_today, SUM(created_day >= ?2) AS new_week,
      SUM(last_day = ?1) AS active_today, SUM(last_day >= ?2) AS active_week FROM users`).bind(today, week).first(),
    all(`SELECT button, SUM(count) AS taps, COUNT(DISTINCT user_id) AS users,
      SUM(CASE WHEN day = ?1 THEN count ELSE 0 END) AS taps_today, COUNT(DISTINCT CASE WHEN day = ?1 THEN user_id END) AS users_today,
      SUM(CASE WHEN day >= ?2 THEN count ELSE 0 END) AS taps_week, COUNT(DISTINCT CASE WHEN day >= ?2 THEN user_id END) AS users_week
      FROM taps GROUP BY button`, today, week),
    all("SELECT lang, COUNT(*) AS users FROM users GROUP BY lang ORDER BY users DESC"),
    all("SELECT j.value AS variant, COUNT(*) AS users FROM users, json_each(users.variants) AS j GROUP BY j.value ORDER BY users DESC"),
    all("SELECT created_day AS day, COUNT(*) AS users FROM users WHERE created_day >= ? GROUP BY created_day ORDER BY created_day DESC", day(now, 13)),
    all("SELECT created_at, lang, text FROM wishes ORDER BY id DESC LIMIT 200"),
  ]);
  const by = Object.fromEntries(buttons.map((b) => [b.button, b]));
  const zero = { taps: 0, users: 0, taps_today: 0, users_today: 0, taps_week: 0, users_week: 0 };
  return {
    today,
    users: { total: users?.total ?? 0, registered: users?.registered ?? 0, new_today: users?.new_today ?? 0, new_week: users?.new_week ?? 0, active_today: users?.active_today ?? 0, active_week: users?.active_week ?? 0 },
    buttons: TRACKED.map((id) => ({ ...zero, ...by[id], button: id, open: BUTTONS.find((b) => b.id === id)?.open ?? true })),
    langs, variants, signups, wishes,
  };
}

const table = (head, rows) => `<table><thead><tr>${head.map((h, i) => `<th${i ? ' class="n"' : ""}>${h}</th>`).join("")}</tr></thead><tbody>${
  rows.length ? rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${head.length}" class="none">Nothing yet</td></tr>`}</tbody></table>`;

export async function adminPage(db, now = Date.now(), email = "") {
  const d = await adminData(db, now);
  const most = Math.max(1, ...d.buttons.map((b) => b.users));
  const ranked = [...d.buttons].sort((a, b) => b.users - a.users || b.taps - a.taps);
  const tile = (label, value) => `<div class="tile"><b>${num(value)}</b><span>${label}</span></div>`;
  const langName = (id) => LANGS.find((l) => l.id === id)?.name ?? id;
  const varName = (id) => VARIANTS.find((v) => v.id === id)?.label ?? id;
  const when = (ms) => new Date(ms + 19800000).toISOString().slice(0, 16).replace("T", " ");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>BodhiLabs admin</title>
<style>
:root{--bg:#eaf4ff;--ink:#14174a;--muted:#3d4273;--card:#fff;--gold:#ffc531;--line:#d5e6f8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,sans-serif}
main{max-width:980px;margin:0 auto;padding:24px 16px 64px;display:flex;flex-direction:column;gap:24px}
header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}h1{font-size:26px;margin:0}h2{font-size:18px;margin:0 0 10px}
.muted{color:var(--muted);font-size:14px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.tile{background:var(--card);border-radius:18px;padding:16px;display:flex;flex-direction:column}.tile b{font-size:30px;font-variant-numeric:tabular-nums}.tile span{color:var(--muted);font-size:14px}
.card{background:var(--card);border-radius:18px;padding:16px;overflow-x:auto}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
th{font-size:13px;color:var(--muted);font-weight:600}.n{text-align:right;font-variant-numeric:tabular-nums}tr:last-child td{border-bottom:0}.none{color:var(--muted);text-align:center}
.bar{display:inline-block;height:10px;border-radius:99px;background:var(--gold);vertical-align:middle;margin-right:8px}.tag{font-size:12px;padding:2px 8px;border-radius:99px;background:var(--bg);margin-left:6px}
.wish{display:block;white-space:normal;min-width:260px}
</style></head><body><main>
<header><h1>BodhiLabs admin</h1><span class="muted">${esc(d.today)} (India) · ${esc(email)}</span></header>
<section class="tiles">
${tile("Users (phones)", d.users.total)}${tile("Registered", d.users.registered)}${tile("New today", d.users.new_today)}${tile("New in 7 days", d.users.new_week)}${tile("Active today", d.users.active_today)}${tile("Active in 7 days", d.users.active_week)}
</section>
<section><h2>Buttons, by distinct users</h2><div class="card">${table(
    ["Button", "Users", "Taps", "Users, 7 days", "Taps, 7 days", "Users today", "Taps today"],
    ranked.map((b) => [`<span class="bar" style="width:${Math.round((b.users / most) * 80)}px"></span>${esc(NAME[b.button])}${b.open ? "" : '<span class="tag">locked</span>'}`,
      num(b.users), num(b.taps), num(b.users_week), num(b.taps_week), num(b.users_today), num(b.taps_today)]))}</div>
<p class="muted">Users counts each person once, however often they tap. A person is active on a day when they tap anything.</p></section>
<section class="two">
<div><h2>New users by day</h2><div class="card">${table(["Day", "Users"], d.signups.map((r) => [esc(r.day), num(r.users)]))}</div></div>
<div><h2>Users by language</h2><div class="card">${table(["Language", "Users"], d.langs.map((r) => [esc(langName(r.lang)), num(r.users)]))}</div></div>
<div><h2>Users by work</h2><div class="card">${table(["Work", "Users"], d.variants.map((r) => [esc(varName(r.variant)), num(r.users)]))}</div></div>
</section>
<section><h2>What people want next (latest 200)</h2><div class="card">${table(["Answer", "Language", "When"], d.wishes.map((w) => [`<span class="wish">${esc(w.text)}</span>`, esc(langName(w.lang)), esc(when(w.created_at))]))}</div></section>
</main></body></html>`;
}
