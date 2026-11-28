// The recordings made beforehand (lib/voice.js). The app itself never calls a voice service.
//   npm run voices -- list hi           what is still to be recorded in Hindi: voice, text and the file to save
//   npm run voices -- make hi --stage 1 make them on this Mac with its own voices (macOS `say`), then index them
//   npm run voices -- index             write lib/recorded.js from the files in public/voice
// Made files are kept; only missing ones are made. For the final round, the same list is made with ElevenLabs.
// `--stage n` keeps to the lessons of one stage; `--only lines|lives|words` keeps to one kind.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { LESSONS, lessonLang, lineId } from "../lib/lessons.js";
import { LIVES } from "../lib/lives.js";
import { MAN, WOMAN } from "../lib/speak.js";
import { WHO, recordingPath, spoken } from "../lib/voice.js";
import { langById } from "../lib/langs.js";

const root = new URL("../public", import.meta.url).pathname;
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i < 0 ? null : args[i + 1]; };
const [cmd, lang] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const stage = flag("stage") ? Number(flag("stage")) : null;
const only = flag("only");

const have = () => new Set(readdirSync(join(root, "voice"), { recursive: true }).filter((f) => /\.(m4a|mp3)$/.test(f)).map((f) => `/voice/${f}`));

function wanted(lang) {
  const out = [];
  if (!only || only === "lines") {
    for (const l of LESSONS) {
      if (stage && l.stage !== stage) continue;
      if (lessonLang(l, lang) !== lang) continue;
      l.scenes.forEach((s, i) => s.say?.[lang] && out.push({ who: l.who, text: s.say[lang], path: recordingPath(lang, l.who, "line", lineId(l, i), s.say[lang]) }));
    }
  }
  if (!only || only === "lives") for (const life of LIVES) if (life.text[lang]) for (const who of WHO) out.push({ who, text: life.text[lang], path: recordingPath(lang, who, "life", life.id, life.text[lang]) });
  if (!only || only === "words") for (const text of spoken(lang)) for (const who of WHO) out.push({ who, text, path: recordingPath(lang, who, "word", "", text) });
  return out;
}

function index() {
  const list = [...have()].sort();
  writeFileSync(new URL("../lib/recorded.js", import.meta.url), `// The recordings kept in public/voice, written by \`npm run voices index\` (scripts/voices.mjs).\nexport default ${JSON.stringify(list, null, 1)};\n`);
  console.log(`${list.length} recordings indexed in lib/recorded.js`);
}

/** The Mac's voices for a language, best first: Premium, then Enhanced, then the rest. */
function macVoices(lang) {
  const locale = langById(lang).locale.replace("-", "_");
  const rank = (n) => (/premium/i.test(n) ? 2 : /enhanced/i.test(n) ? 1 : 0);
  return execFileSync("say", ["-v", "?"], { encoding: "utf8" }).split("\n")
    .map((line) => line.match(/^(.+?)\s+([a-z]{2,3}_[A-Z]{2})\s+#/)).filter(Boolean)
    .map(([, name, loc]) => ({ name: name.trim(), loc }))
    .filter((v) => v.loc === locale || (v.loc.startsWith(locale.slice(0, 3)) && !locale.endsWith("_IN")))
    .sort((a, b) => rank(b.name) - rank(a.name));
}

function make(lang) {
  if (process.platform !== "darwin") throw new Error("make uses macOS `say`: run it on a Mac");
  const voices = macVoices(lang);
  if (!voices.length) return console.log(`No Mac voice for ${lang}. Add one in System Settings, Accessibility, Spoken Content, System voice, Manage Voices.`);
  const sideOf = (who) => voices.find((v) => (who === "man" ? MAN : WOMAN).test(v.name)) ?? voices[0];
  for (const who of WHO) console.log(`${who}: ${sideOf(who).name}${sideOf(who) === voices[0] && !(who === "man" ? MAN : WOMAN).test(voices[0].name) ? " (no such voice on this Mac; the best one is used)" : ""}`);
  const done = have();
  const todo = wanted(lang).filter((w) => !done.has(w.path));
  const tmp = mkdtempSync(join(tmpdir(), "voices-"));
  let n = 0;
  for (const w of todo) {
    const aiff = join(tmp, "x.aiff"), out = join(root, w.path);
    mkdirSync(dirname(out), { recursive: true });
    execFileSync("say", ["-v", sideOf(w.who).name, "-r", "160", "-o", aiff, w.text]);
    execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "48000", aiff, out]);
    console.log(`${++n}/${todo.length} ${w.path}`);
  }
  rmSync(tmp, { recursive: true, force: true });
  index();
}

if (cmd === "list" && lang) {
  const done = have(), todo = wanted(lang).filter((w) => !done.has(w.path));
  console.log(JSON.stringify(todo, null, 1));
  console.error(`${todo.length} to record, ${todo.reduce((n, w) => n + w.text.length, 0)} characters`);
} else if (cmd === "make" && lang) make(lang);
else if (cmd === "index") index();
else console.log("npm run voices list <lang> | make <lang> [-- --stage 1] [--only lines|lives|words] | index");
