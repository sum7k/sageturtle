// The eleven languages of the app, English among them. Each is shown by its own name in its own script.
// `locale` is used for dates and for the phone's own voice in Book. `rtl` is set for scripts written right to left.
export const LANGS = [
  { id: "hi", name: "हिन्दी", locale: "hi-IN" },
  { id: "en", name: "English", locale: "en-IN" },
  { id: "bn", name: "বাংলা", locale: "bn-IN" },
  { id: "mr", name: "मराठी", locale: "mr-IN" },
  { id: "te", name: "తెలుగు", locale: "te-IN" },
  { id: "ta", name: "தமிழ்", locale: "ta-IN" },
  { id: "gu", name: "ગુજરાતી", locale: "gu-IN" },
  { id: "ur", name: "اردو", locale: "ur-IN", rtl: true },
  { id: "kn", name: "ಕನ್ನಡ", locale: "kn-IN" },
  { id: "or", name: "ଓଡ଼ିଆ", locale: "or-IN" },
  { id: "ml", name: "മലയാളം", locale: "ml-IN" },
];
export const langById = (id) => LANGS.find((l) => l.id === id) ?? LANGS[1];
/** The app language closest to what the browser asks for, before the person has chosen one. */
export const guessLang = (tag = "") => LANGS.find((l) => l.id === String(tag).toLowerCase().split("-")[0])?.id ?? "en";
