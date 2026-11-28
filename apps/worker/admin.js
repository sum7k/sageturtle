// The admin panel: one page of numbers, made on the server from the database. English only; it is for the owner.
import { BOOK, tapName } from "../lib/buttons.js";
import { CENTRE } from "../lib/grid.js";
import { TOP } from "../lib/top.js";
import { SUBJECTS } from "../lib/subjects.js";
import { LIVES } from "../lib/lives.js";
import { LANGS } from "../lib/langs.js";
import { VARIANTS } from "../lib/variants.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const num = (n) => Number(n ?? 0).toLocaleString("en-IN");
const day = (now, back = 0) => new Date(now + 19800000 - back * 86400000).toISOString().slice(0, 10);

/** Everything the panel shows, as plain data. */
export async function adminData(db, now = Date.now()) {
  const today = day(now);
  const week = day(now, 6);
  const all = (sql, ...args) => db.prepare(sql).bind(...args).all().then((r) => r.results);
  const [users, buttons, counts, langs, states, refs, variants, signups, asked, answered] = await Promise.all([
    db.prepare(`SELECT COUNT(*) AS total, SUM(pin <> '') AS registered, SUM(created_day = ?1) AS new_today, SUM(created_day >= ?2) AS new_week,
      SUM(last_day = ?1) AS active_today, SUM(last_day >= ?2) AS active_week FROM users`).bind(today, week).first(),
    all(`SELECT button, SUM(count) AS taps, COUNT(DISTINCT user_id) AS users,
      SUM(CASE WHEN day = ?1 THEN count ELSE 0 END) AS taps_today, COUNT(DISTINCT CASE WHEN day = ?1 THEN user_id END) AS users_today,
      SUM(CASE WHEN day >= ?2 THEN count ELSE 0 END) AS taps_week, COUNT(DISTINCT CASE WHEN day >= ?2 THEN user_id END) AS users_week
      FROM taps GROUP BY button`, today, week),
    all(`SELECT name, SUM(n) AS total, SUM(CASE WHEN day = ?1 THEN n ELSE 0 END) AS today, SUM(CASE WHEN day >= ?2 THEN n ELSE 0 END) AS week FROM counts GROUP BY name`, today, week),
    all("SELECT lang, COUNT(*) AS users FROM users GROUP BY lang ORDER BY users DESC"),
    all("SELECT state, COUNT(*) AS users FROM users GROUP BY state ORDER BY users DESC LIMIT 40"),
    all("SELECT ref, COUNT(*) AS users FROM users GROUP BY ref ORDER BY users DESC LIMIT 20"),
    all("SELECT j.value AS variant, COUNT(*) AS users FROM users, json_each(users.variants) AS j GROUP BY j.value ORDER BY users DESC"),
    all("SELECT created_day AS day, COUNT(*) AS users FROM users WHERE created_day >= ? GROUP BY created_day ORDER BY created_day DESC", day(now, 13)),
    all("SELECT id, day, lang, text FROM questions WHERE replied_at = 0 ORDER BY id DESC LIMIT 50"),
    all("SELECT id, day, lang, text, reply FROM questions WHERE replied_at > 0 ORDER BY replied_at DESC LIMIT 20"),
  ]);
  const by = Object.fromEntries(buttons.map((b) => [b.button, b]));
  const zero = { taps: 0, users: 0, taps_today: 0, users_today: 0, taps_week: 0, users_week: 0 };
  const counted = (name) => ({ today: 0, week: 0, total: 0, ...counts.find((c) => c.name === name) });
  const people = (button) => { const b = { ...zero, ...by[button] }; return { today: b.users_today, week: b.users_week, total: b.users }; };
  const u = { total: users?.total ?? 0, registered: users?.registered ?? 0, new_today: users?.new_today ?? 0, new_week: users?.new_week ?? 0, active_today: users?.active_today ?? 0, active_week: users?.active_week ?? 0 };
  return {
    today,
    users: u,
    // How far people get, step by step. The first two count browsers and installs; the rest count people.
    funnel: [
      { step: "Opened the first page", ...counted("visit") },
      { step: "Installed the app", ...counted("install") },
      { step: "Chose a language", today: u.new_today, week: u.new_week, total: u.total },
      { step: "Opened Gyan", ...people("gyan") },
      { step: "Opened the word game", ...people(BOOK.id) },
      { step: "Picked a word", ...people("answer") },
      { step: "Got a word right", ...people("right") },
    ],
    book: { ...zero, ...by[BOOK.id] },
    // Home, the top level: Gyan, Vartaman and the ten empty boxes.
    top: TOP.map((x, i) => ({ n: i + 1, id: x.id, picture: x.picture, name: x.name.en || "Empty box", open: !!x.open, ...zero, ...by[tapName("top", x)] })),
    // Inside Gyan: the twelve stages.
    stages: Array.from({ length: 12 }, (_, i) => ({ n: i + 1, ...zero, ...by[`stage:${i + 1}`] })),
    // Inside a stage: for each subject, how many people pressed it and how often.
    subjects: SUBJECTS.map((x) => ({ id: x.id, picture: x.picture, name: x.name.en, ...zero, ...by[tapName("stage", x)] }))
      .sort((a, b) => b.users - a.users || b.taps - a.taps),
    // The four in the middle of every grid.
    centre: CENTRE.map((c) => ({ id: c.id, picture: c.picture, name: c.name.en || "Joker (empty)", ...zero, ...by[`centre:${c.id}`] })),
    // Questions from the "?" box: those waiting for an answer, and the last ones answered.
    questions: { open: asked, done: answered },
    // Lives: which lives were shown, and how many people listened.
    lives: LIVES.map((l) => ({ id: l.id, picture: l.picture, name: l.name.en, ...zero, ...by[`life:${l.id}`] })).sort((a, b) => b.taps - a.taps),
    heard: { ...zero, ...by.heard },
    langs, states, refs, variants, signups,
  };
}

const table = (head, rows) => `<table><thead><tr>${head.map((h, i) => `<th${i ? ' class="n"' : ""}>${h}</th>`).join("")}</tr></thead><tbody>${
  rows.length ? rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${head.length}" class="none">Nothing yet</td></tr>`}</tbody></table>`;

/** The page is made for a phone: one column, big numbers on top, short tables, the long table folded away. */
export async function adminPage(db, now = Date.now(), email = "") {
  const d = await adminData(db, now);
  const pct = (r) => `${Math.round(r * 100)}%`;
  const tile = (label, value) => `<div class="tile"><b>${num(value)}</b><span>${label}</span></div>`;
  const langName = (id) => LANGS.find((l) => l.id === id)?.name ?? id;
  const varName = (id) => VARIANTS.find((v) => v.id === id)?.label ?? id;
  const top = Math.max(1, ...d.funnel.map((f) => f.total));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>BodhiLabs admin</title>
<style>
:root{--bg:#eaf4ff;--ink:#14174a;--muted:#3d4273;--card:#fff;--gold:#ffc531;--line:#d5e6f8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,sans-serif}
main{max-width:720px;margin:0 auto;padding:20px 14px 64px;display:flex;flex-direction:column;gap:22px}
header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}h1{font-size:24px;margin:0}h2{font-size:18px;margin:0 0 8px}
.muted{color:var(--muted);font-size:14px;margin:8px 0 0}.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tile{background:var(--card);border-radius:18px;padding:14px 12px;display:flex;flex-direction:column}.tile b{font-size:28px;font-variant-numeric:tabular-nums}.tile span{color:var(--muted);font-size:13px}
.card{background:var(--card);border-radius:18px;padding:10px 12px;overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--line)}
th{font-size:12px;color:var(--muted);font-weight:600}.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}tr:last-child td{border-bottom:0}.none{color:var(--muted);text-align:center}
.bar{display:block;height:8px;border-radius:99px;background:var(--gold);margin-top:4px;min-width:2px}
.tag{font-size:11px;padding:2px 7px;border-radius:99px;background:var(--bg);margin-left:6px;color:var(--muted)}
.pic{font-size:22px;margin-right:8px;vertical-align:middle}summary{font-weight:700;font-size:18px;cursor:pointer;margin-bottom:8px}
a{color:inherit}
.q{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding:12px}.q p{margin:0}.qt{font-size:17px;white-space:pre-wrap;overflow-wrap:anywhere}.qa{background:var(--bg);border-radius:12px;padding:10px;white-space:pre-wrap;overflow-wrap:anywhere}
.q textarea{width:100%;font:inherit;border:1px solid var(--line);border-radius:12px;padding:10px}.q button{align-self:flex-end;font:inherit;font-weight:700;background:var(--gold);border:0;border-radius:99px;padding:10px 22px}
</style></head><body><main>
<header><h1>BodhiLabs</h1><span class="muted">${esc(d.today)} (India) · <a href="/admin">refresh</a></span></header>
<section class="tiles">
${tile("People today", d.users.active_today)}${tile("People, 7 days", d.users.active_week)}${tile("People in all", d.users.total)}${tile("New today", d.users.new_today)}${tile("New, 7 days", d.users.new_week)}${tile("Registered", d.users.registered)}
</section>
<section id="questions"><h2>Questions (${num(d.questions.open.length)} waiting)</h2>
${d.questions.open.length ? d.questions.open.map((q) => `<form class="card q" method="post" action="/admin/reply"><p class="muted">${esc(q.day)} · ${esc(langName(q.lang))}</p><p class="qt" dir="auto">${esc(q.text)}</p>
<input type="hidden" name="id" value="${q.id}"><textarea name="reply" rows="3" maxlength="2000" required dir="auto" placeholder="Your answer. The learner sees it in the app."></textarea><button>Send answer</button></form>`).join("") : '<div class="card"><p class="none">No question is waiting</p></div>'}
${d.questions.done.length ? `<details><summary>Answered</summary>${d.questions.done.map((q) => `<div class="card q"><p class="muted">${esc(q.day)} · ${esc(langName(q.lang))}</p><p class="qt" dir="auto">${esc(q.text)}</p><p class="qa" dir="auto">${esc(q.reply)}</p></div>`).join("")}</details>` : ""}</section>
<section><h2>How far people get</h2><div class="card">${table(["Step", "Today", "7 days", "All"],
    d.funnel.map((f) => [`${esc(f.step)}<span class="bar" style="width:${Math.round((f.total / top) * 100)}%"></span>`, num(f.today), num(f.week), num(f.total)]))}</div>
<p class="muted">The first two rows count browsers and installs, a browser at most once a day. The other rows count people, each once.</p></section>
<section><h2>Home</h2><div class="card">${table(["House", "People", "Presses", "Today"],
    d.top.map((x) => [`${x.n}. <span class="pic">${x.picture}</span>${esc(x.name)}${x.open ? "" : ' <span class="tag">closed</span>'}`, num(x.users), num(x.taps), num(x.taps_today)]))}</div></section>
<section><h2>Subjects pressed</h2><div class="card">${table(["Subject", "People", "Presses", "Today"], [
    ...d.subjects.map((x) => [`<span class="pic">${x.picture}</span>${esc(x.name)}`, num(x.users), num(x.taps), num(x.taps_today)]),
    ...d.centre.map((x) => [`<span class="pic">${x.picture}</span>${esc(x.name)} <span class="tag">middle</span>`, num(x.users), num(x.taps), num(x.taps_today)]),
  ])}</div>
<p class="muted">A subject with nothing made for the stage only counts the press. Word here is a press where it was closed; the word game is counted in the steps above. The four marked "middle" are the boxes in the middle of every grid: Me, Ask, Settings and the empty joker.</p></section>
<section><h2>Stages of Gyan</h2><div class="card">${table(["Stage", "People", "Presses", "Today"], d.stages.map((x) => [`Stage ${x.n}`, num(x.users), num(x.taps), num(x.taps_today)]))}</div>
<p class="muted">A new learner has only stage 1 open. To look at any stage on this phone:
<button type="button" onclick="localStorage.setItem('bodhilabs.allstages.v1','1');this.textContent='All stages are open on this phone'">Open all stages</button>
<button type="button" onclick="localStorage.removeItem('bodhilabs.allstages.v1');this.textContent='Closed again'">Close them again</button></p></section>
<section><h2>Where people are</h2><div class="card">${table(["State", "People"], d.states.map((r) => [esc(r.state || "Not known"), num(r.users)]))}</div></section>
<section><h2>Who sent them</h2><div class="card">${table(["From", "People"], d.refs.map((r) => [esc(r.ref || "Direct or not known"), num(r.users)]))}</div>
<p class="muted">To tell links apart, share them as bodhilabs.org/?from=whatsapp (any short name).</p></section>
<section><h2>Languages chosen</h2><div class="card">${table(["Language", "People"], d.langs.map((r) => [esc(langName(r.lang)), num(r.users)]))}</div></section>
<section><h2>New people by day</h2><div class="card">${table(["Day", "People"], d.signups.map((r) => [esc(r.day), num(r.users)]))}</div></section>
<details><summary>Lives shown</summary><div class="card">${table(["Life", "People", "Times"],
    [...d.lives.map((x) => [`<span class="pic">${x.picture}</span>${esc(x.name)}`, num(x.users), num(x.taps)]), ["Listened to a life", num(d.heard.users), num(d.heard.taps)]])}</div></details>
${d.variants.length ? `<details><summary>People by work</summary><div class="card">${table(["Work", "People"], d.variants.map((r) => [esc(varName(r.variant)), num(r.users)]))}</div></details>` : ""}
<p class="muted">Signed in as ${esc(email)}.</p>
</main></body></html>`;
}
