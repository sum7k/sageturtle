// The twelve languages of the first screen. Each is shown only by its own name in its own script.
export const LANGS = [
  { id: "hi", name: "हिन्दी", speech: "hi-IN" },
  { id: "en", name: "English", speech: "en-IN" },
  { id: "bn", name: "বাংলা", speech: "bn-IN" },
  { id: "mr", name: "मराठी", speech: "mr-IN" },
  { id: "te", name: "తెలుగు", speech: "te-IN" },
  { id: "ta", name: "தமிழ்", speech: "ta-IN" },
  { id: "gu", name: "ગુજરાતી", speech: "gu-IN" },
  { id: "ur", name: "اردو", speech: "ur-IN" },
  { id: "kn", name: "ಕನ್ನಡ", speech: "kn-IN" },
  { id: "or", name: "ଓଡ଼ିଆ", speech: "or-IN" },
  { id: "ml", name: "മലയാളം", speech: "ml-IN" },
  { id: "pa", name: "ਪੰਜਾਬੀ", speech: "pa-IN" },
];
export const langById = (id) => LANGS.find((l) => l.id === id) ?? LANGS[1];
