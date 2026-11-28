// A small language model that runs on the phone itself, the optional second half of Ask. lib/find.js finds the
// lines of our lessons that fit a question; this puts them into one or two sentences that answer the question as it
// was asked. It may use only those lines: it is given nothing else, and when they do not answer it says so and the
// found line itself is shown instead. No question and no answer leaves the phone.
//
// The model is Gemma 3 270M (Google, open weights), 273 MB, run by Transformers.js on the phone's graphics chip
// (WebGPU). The plan (sumeet, 2026-11-28): it comes in quietly in the background on phones strong enough, on Wi-Fi
// only (power, mayFetch, warm); until it is there, and on weaker phones, the same answer is written by a model on
// Cloudflare (askCloud, worker/answer.js), which is given the same lines and the same words to follow (prompt).
// The phone's own model is NOT on for learners yet (sumeet's choice the same day): it has not been tried on real
// phones, and how well so small a model writes Hindi is not known. It is switched on per phone at /lab.
export const LIB = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2";
export const MODEL = "onnx-community/gemma-3-270m-it-ONNX";
export const SIZE_MB = { q4f16: 273, q4: 323 };
export const KEY = "bodhilabs.mind.v1"; // "on" when this phone has been told to use the model in Ask
const NONE = "NONE";
const NAMES = { hi: "Hindi", en: "English", bn: "Bengali", mr: "Marathi", te: "Telugu", ta: "Tamil", gu: "Gujarati", ur: "Urdu", kn: "Kannada", or: "Odia", pa: "Punjabi", ml: "Malayalam" };

/** Can this phone run the model? It needs WebGPU and enough memory, and the person must not be saving data. */
export function capable(nav = globalThis.navigator) {
  if (!nav?.gpu) return false;
  if (nav.connection?.saveData) return false;
  return (nav.deviceMemory ?? 8) >= 4; // phones that do not say (iPhone) are let through; the load itself may still fail
}

const NEED_MB = 1024; // free room wanted before the download: the model, and as much again while it is unpacked
/**
 * How strong this phone is, as far as a web page can tell. Nothing here is sent anywhere.
 * gpu: has WebGPU and gave an adapter; half: the chip does half-size numbers (the 273 MB file, else 323 MB);
 * buffer: the largest block the chip takes, in MB; memory: GB, as Chrome rounds it (at most 8; iPhone does not say);
 * cores; link: "wifi", "cellular", ... where the phone says, else ""; fast: the phone's own guess ("4g", "3g");
 * saving: data saver is on; free: MB of room left for this app, where the phone says.
 */
export async function power(nav = globalThis.navigator) {
  let adapter = null;
  try { adapter = await nav?.gpu?.requestAdapter?.(); } catch {}
  let free = null;
  try { const e = await nav?.storage?.estimate?.(); if (e?.quota) free = Math.round((e.quota - (e.usage ?? 0)) / 1048576); } catch {}
  return {
    gpu: !!adapter,
    half: !!adapter?.features?.has?.("shader-f16"),
    buffer: adapter?.limits?.maxBufferSize ? Math.round(adapter.limits.maxBufferSize / 1048576) : null,
    memory: nav?.deviceMemory ?? null,
    cores: nav?.hardwareConcurrency ?? null,
    link: nav?.connection?.type ?? "",
    fast: nav?.connection?.effectiveType ?? "",
    saving: !!nav?.connection?.saveData,
    free,
    phone: /Android|iPhone|iPad|Mobile/i.test(nav?.userAgent ?? ""),
  };
}
/**
 * May the model be downloaded now, by itself, in the background? Only on a phone that can run it, with room for it,
 * and never on mobile data: on Wi-Fi or a cable where the phone says so. A phone that does not say what it is
 * connected by (iPhone) is not trusted to be on Wi-Fi; a computer that does not say is. Returns "" for yes, else why not.
 */
export function mayFetch(p) {
  if (!p.gpu) return "no WebGPU";
  if (p.memory !== null && p.memory < 4) return "little memory";
  if (p.buffer !== null && p.buffer < 256) return "small graphics memory";
  if (p.saving) return "data saver is on";
  if (p.free !== null && p.free < NEED_MB) return "little room";
  if (p.link ? !["wifi", "ethernet"].includes(p.link) : p.phone) return "not on Wi-Fi";
  return "";
}
export const mindOn = () => { try { return localStorage.getItem(KEY) === "on" && capable(); } catch { return false; } };
export const setMind = (on) => { try { on ? localStorage.setItem(KEY, "on") : localStorage.removeItem(KEY); } catch {} };

/** What the model is asked. `lines` are the texts found by lib/find.js, best first. */
export function prompt(question, lines, lang) {
  const name = NAMES[lang] ?? "English";
  return [{
    role: "user",
    content: `You answer a young child's question. Use ONLY the lesson lines below. Answer in ${name}, in one or two short, simple, kind sentences. Do not add anything that is not in the lines. If the lines do not answer the question, reply with the single word ${NONE}.

Lesson lines:
${lines.map((l) => `- ${l}`).join("\n")}

Question: ${question}`,
  }];
}

/** The model's reply, made safe to show: trimmed, without marks of formatting, or "" when it had no answer. */
export function tidy(reply) {
  const text = String(reply ?? "").replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();
  if (!text || text.toUpperCase().includes(NONE) || text.length > 400) return "";
  return text;
}

let loading = null;
/**
 * Get the model ready; the first time, this downloads it. `onProgress` is told 0 to 100 while it comes.
 * `lib` is Transformers.js, given in tests; in the app it is fetched from the CDN.
 */
export function load(onProgress = () => {}, lib) {
  loading ??= (async () => {
    const T = lib ?? await import(/* webpackIgnore: true */ LIB);
    const adapter = await globalThis.navigator?.gpu?.requestAdapter?.();
    const dtype = adapter?.features?.has?.("shader-f16") ? "q4f16" : "q4"; // half-size numbers where the chip has them
    return T.pipeline("text-generation", MODEL, {
      dtype, device: "webgpu",
      progress_callback: (p) => { if (p.status === "progress" && String(p.file).includes("onnx_data")) onProgress(Math.round(p.progress)); },
    });
  })().catch((e) => { loading = null; throw e; });
  return loading;
}

let have = false; // the model is loaded and can answer now
export const mindReady = () => have;
/**
 * Bring the model in quietly, where this phone has it switched on (KEY) and may download it now (mayFetch).
 * Safe to call often. Until it is ready, answers are written on Cloudflare (askCloud).
 */
export async function warm(lib) {
  try {
    if (have || !mindOn() || mayFetch(await power())) return false;
    await load(undefined, lib);
    have = true;
  } catch (e) { console.warn("mind", e); }
  return have;
}

/** One answer in the model's own words from the found lines, or "" when it has none or cannot run. */
export async function compose(question, lines, lang, lib) {
  try {
    if (!lines.length) return "";
    const generate = await load(undefined, lib);
    have = true;
    const out = await generate(prompt(question, lines, lang), { max_new_tokens: 80, do_sample: false });
    return tidy(out?.[0]?.generated_text?.at?.(-1)?.content);
  } catch (e) {
    console.warn("mind", e);
    return "";
  }
}

/** The same, written on Cloudflare (worker/answer.js). `ids` are the names of the found lines. "" when there is none. */
export async function askCloud(user, question, ids, lang, fetcher = globalThis.fetch) {
  try {
    if (!user || !ids.length) return "";
    const res = await fetcher("/api/answer", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ user, text: question, lang, lines: ids }), signal: AbortSignal.timeout(8000) }); // a child does not wait longer
    return res.ok ? tidy((await res.json()).text) : "";
  } catch { return ""; }
}
