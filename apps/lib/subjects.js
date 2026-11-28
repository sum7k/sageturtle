// BodhiLabs is for education only (sumeet, 2026-11-28). Every stage of Gyan (lib/stages.js) shows the eleven subjects of the path and Lives (जीवनी),
// twelve in all, one for each sign of the zodiac. They sit in the twelve outer boxes of a 4x4 grid (components/Grid.jsx)
// and turn with the lagna (lib/lagna.js): the subject of the rising sign is in house 1, and the others follow in order.
// The subjects are the eleven labels of the Gyan path (gyan/docs/syllabus-map.md). Which sign holds which subject
// was proposed by Claude and agreed by sumeet.
// Names are in the twelve languages, in the order of LANG_ORDER. The eleven Indian languages were written by Claude and
// are not yet checked by a native speaker.
export const LANG_ORDER = ["en", "hi", "bn", "mr", "te", "ta", "gu", "ur", "kn", "or", "ml", "pa"];
export const names = (line) => Object.fromEntries(line.split("|").map((n, i) => [LANG_ORDER[i], n]));

/** In the order of the signs, Mesha first. The twelfth, Meena, is Lives. What a subject opens depends on the stage (lib/stages.js). */
export const SUBJECTS = [
  { id: "body", picture: "🤸", name: names("Body|शरीर|শরীর|शरीर|శరీరం|உடல்|શરીર|جسم|ದೇಹ|ଶରୀର|ശരീരം|ਸਰੀਰ") },
  { id: "music", picture: "🎵", name: names("Music|संगीत|সঙ্গীত|संगीत|సంగీతం|இசை|સંગીત|موسیقی|ಸಂಗೀತ|ସଙ୍ଗୀତ|സംഗീതം|ਸੰਗੀਤ") },
  { id: "word", picture: "📖", name: names("Word|शब्द|শব্দ|शब्द|పదం|சொல்|શબ્દ|لفظ|ಪದ|ଶବ୍ଦ|വാക്ക്|ਸ਼ਬਦ") },
  { id: "earth", picture: "🌍", name: names("Earth|धरती|পৃথিবী|पृथ्वी|భూమి|பூமி|ધરતી|زمین|ಭೂಮಿ|ପୃଥିବୀ|ഭൂമി|ਧਰਤੀ") },
  { id: "rule", picture: "⚖️", name: names("Rule|नियम|নিয়ম|नियम|నియమం|விதி|નિયમ|قاعدہ|ನಿಯಮ|ନିୟମ|നിയമം|ਨਿਯਮ") },
  { id: "number", picture: "🔢", name: names("Number|गिनती|সংখ্যা|संख्या|సంఖ్య|எண்|સંખ્યા|گنتی|ಸಂಖ್ಯೆ|ସଂଖ୍ୟା|സംഖ്യ|ਗਿਣਤੀ") },
  { id: "art", picture: "🎨", name: names("Art|कला|শিল্প|कला|కళ|கலை|કલા|فن|ಕಲೆ|କଳା|കല|ਕਲਾ") },
  { id: "nature", picture: "🌿", name: names("Nature|प्रकृति|প্রকৃতি|निसर्ग|ప్రకృతి|இயற்கை|પ્રકૃતિ|قدرت|ಪ್ರಕೃತಿ|ପ୍ରକୃତି|പ്രകൃതി|ਕੁਦਰਤ") },
  { id: "people", picture: "👥", name: names("People|लोग|মানুষ|लोक|ప్రజలు|மக்கள்|લોકો|لوگ|ಜನ|ଲୋକ|ജനങ്ങൾ|ਲੋਕ") },
  { id: "hand", picture: "🛠️", name: names("Hand|हाथ|হাত|हात|చేయి|கை|હાથ|ہاتھ|ಕೈ|ହାତ|കൈ|ਹੱਥ") },
  { id: "money", picture: "🪙", name: names("Money|धन|টাকা|पैसा|డబ్బు|பணம்|પૈસા|پیسہ|ಹಣ|ଟଙ୍କା|പണം|ਪੈਸਾ") },
  // Lives opens the life of one great person (lib/lives.js).
  { id: "lives", picture: "🌟", name: names("Lives|जीवनी|জীবনী|चरित्र|జీవిత కథ|வாழ்க்கை|જીવનકથા|سوانح|ಜೀವನ ಕಥೆ|ଜୀବନୀ|ജീവിതകഥ|ਜੀਵਨੀ") },
];
export const subjectById = (id) => SUBJECTS.find((s) => s.id === id) ?? null;
export const nameOf = (thing, lang) => thing.name[lang] ?? thing.name.en;

/** The subject in each of the twelve houses, house 1 first, for a rising sign (0 to 11). */
export const ring = (lagna) => Array.from({ length: 12 }, (_, i) => SUBJECTS[(lagna + i) % 12]);
