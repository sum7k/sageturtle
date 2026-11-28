// The eleven languages of the app, English among them. Each is shown by its own name in its own script.
// `locale` is used for dates and for the phone's own voice. `rtl` is set for scripts written right to left.
// `hello` is what a language tile says when tapped on the first screen, so a person who cannot read can find theirs by ear.
// `states` are the Indian states (ISO 3166-2 codes, old and new spellings) where the language is the usual first guess.
export const LANGS = [
  { id: "hi", name: "हिन्दी", locale: "hi-IN", hello: "नमस्ते। आइए पढ़ें।", states: ["UP", "BR", "MP", "RJ", "HR", "DL", "UT", "UK", "HP", "JH", "CT", "CG", "PB", "CH"] },
  { id: "en", name: "English", locale: "en-IN", hello: "Hello. Let us read.", states: [] },
  { id: "bn", name: "বাংলা", locale: "bn-IN", hello: "নমস্কার। আসুন পড়ি।", states: ["WB", "TR"] },
  { id: "mr", name: "मराठी", locale: "mr-IN", hello: "नमस्कार। चला वाचूया।", states: ["MH"] },
  { id: "te", name: "తెలుగు", locale: "te-IN", hello: "నమస్కారం. రండి చదువుదాం.", states: ["AP", "TG", "TS"] },
  { id: "ta", name: "தமிழ்", locale: "ta-IN", hello: "வணக்கம். வாங்க படிக்கலாம்.", states: ["TN", "PY"] },
  { id: "gu", name: "ગુજરાતી", locale: "gu-IN", hello: "નમસ્તે. ચાલો વાંચીએ.", states: ["GJ", "DH", "DD", "DN"] },
  { id: "ur", name: "اردو", locale: "ur-IN", rtl: true, hello: "آداب۔ آئیے پڑھیں۔", states: ["JK"] },
  { id: "kn", name: "ಕನ್ನಡ", locale: "kn-IN", hello: "ನಮಸ್ಕಾರ. ಬನ್ನಿ ಓದೋಣ.", states: ["KA"] },
  { id: "or", name: "ଓଡ଼ିଆ", locale: "or-IN", hello: "ନମସ୍କାର। ଆସନ୍ତୁ ପଢ଼ିବା।", states: ["OD", "OR"] },
  { id: "ml", name: "മലയാളം", locale: "ml-IN", hello: "നമസ്കാരം. വരൂ വായിക്കാം.", states: ["KL", "LD"] },
];
export const langById = (id) => LANGS.find((l) => l.id === id) ?? LANGS[1];
const fromTag = (tag) => LANGS.find((l) => l.id === String(tag ?? "").toLowerCase().split("-")[0])?.id;

/** The app language closest to what the browser asks for. Used for the few words shown before a language is chosen. */
export const guessLang = (tag = "") => fromTag(tag) ?? "en";
/** The language of an Indian state, or "" when we have no guess. */
export const stateLang = (code) => LANGS.find((l) => l.states.includes(String(code ?? "").toUpperCase()))?.id ?? "";

/**
 * The tile to pre-select on the first screen, or "" for none. A phone set to an Indian language says the most.
 * Most phones in India are set to English, so for them the state the person is in decides.
 */
export function firstGuess(tags = [], state = "") {
  const phone = tags.map(fromTag).filter(Boolean);
  return phone.find((id) => id !== "en") ?? (stateLang(state) || phone[0] || "");
}
