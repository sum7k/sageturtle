// A small language model that runs on the phone itself, the optional second half of Ask. lib/find.js finds the
// lines of our lessons that fit a question; this puts them into one or two sentences that answer the question as it
// was asked. It may use only those lines: it is given nothing else, and when they do not answer it says so and the
// found line itself is shown instead. No question and no answer leaves the phone.
//
// The model is Gemma 3 270M (Google, open weights), 273 MB, run by Transformers.js on the phone's graphics chip
// (WebGPU). It is downloaded once, only on phones that can run it, and only after it is switched on (lab.html).
// It is NOT on for learners yet: it has not been tried on real phones, and how well so small a model writes Hindi
// and the other Indian languages is not known. See gyan/tradeoffs.md.
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

/** One answer in the model's own words from the found lines, or "" when it has none or cannot run. */
export async function compose(question, lines, lang, lib) {
  try {
    if (!lines.length) return "";
    const generate = await load(undefined, lib);
    const out = await generate(prompt(question, lines, lang), { max_new_tokens: 80, do_sample: false });
    return tidy(out?.[0]?.generated_text?.at?.(-1)?.content);
  } catch (e) {
    console.warn("mind", e);
    return "";
  }
}
