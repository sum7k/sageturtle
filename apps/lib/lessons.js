// Lessons: short moving pictures with a spoken line, for stages 1 and 2 of the Gyan path, where nothing is read.
// A lesson is not a video file. It is a list of scenes; each scene names a drawing (components/LessonArt.jsx, drawn
// and moved by the phone itself) and the line that is spoken over it. The same drawing serves every language; only
// the recording changes (a Sarvam voice, made once and kept: worker/voice.js). So a lesson weighs a few kilobytes.
// The steps come from gyan/docs/syllabus-map.md. The lines were written by Claude, in Hindi and English first;
// the other ten languages follow once the lessons are approved. Until then they are heard in English.
//
// The spirit (CLAUDE.md): a lesson shows and names. It never compares the learner with anyone and never hurries them.

export const LESSONS = [
  // Stage 1, Nature: "Fire: what burns, what it gives, how to be safe".
  {
    id: "fire", subject: "nature", stage: 1, picture: "🔥", name: { en: "Fire", hi: "आग" },
    scenes: [
      { art: "night", say: { hi: "बहुत पहले की बात है। रात में बहुत अँधेरा होता था। और बहुत ठंड लगती थी।", en: "Long, long ago, the night was very dark. And it was very cold." } },
      { art: "lightning", say: { hi: "एक दिन आसमान से बिजली गिरी। एक सूखा पेड़ जलने लगा। यह आग थी।", en: "One day, lightning fell from the sky. A dry tree began to burn. This was fire." } },
      { art: "light", say: { hi: "आग से रोशनी मिलती है। अँधेरा दूर हो जाता है।", en: "Fire gives light. The dark goes away." } },
      { art: "warm", say: { hi: "आग से गर्मी मिलती है। ठंड दूर हो जाती है।", en: "Fire gives warmth. The cold goes away." } },
      { art: "cook", say: { hi: "आग पर खाना पकता है। पका हुआ खाना नरम होता है।", en: "Food is cooked on fire. Cooked food is soft." } },
      { art: "burns", say: { hi: "सूखी लकड़ी जलती है। सूखे पत्ते भी जलते हैं।", en: "Dry wood burns. Dry leaves burn too." } },
      { art: "noburn", say: { hi: "पत्थर नहीं जलता। और पानी आग को बुझा देता है।", en: "A stone does not burn. And water puts fire out." } },
      { art: "safe", say: { hi: "आग बहुत गरम होती है। हम आग को छूते नहीं। हम आग से थोड़ा दूर रहते हैं।", en: "Fire is very hot. We do not touch fire. We stay a little away from it." } },
    ],
  },
  // Stage 1, Nature: "The body and its five senses".
  {
    id: "senses", subject: "nature", stage: 1, picture: "👀", name: { en: "The five senses", hi: "पाँच इंद्रियाँ" },
    scenes: [
      { art: "face", say: { hi: "हमारा शरीर दुनिया को पाँच तरह से जानता है।", en: "Our body knows the world in five ways." } },
      { art: "see", say: { hi: "आँखों से हम देखते हैं। देखो, एक फूल।", en: "With our eyes, we see. Look, a flower." } },
      { art: "hear", say: { hi: "कानों से हम सुनते हैं। सुनो, चिड़िया गा रही है।", en: "With our ears, we hear. Listen, a bird is singing." } },
      { art: "smell", say: { hi: "नाक से हम सूँघते हैं। फूल की खुशबू अच्छी है।", en: "With our nose, we smell. The flower smells nice." } },
      { art: "taste", say: { hi: "जीभ से हम स्वाद लेते हैं। आम मीठा है।", en: "With our tongue, we taste. The mango is sweet." } },
      { art: "touch", say: { hi: "त्वचा से हम छूकर जानते हैं। पानी ठंडा है।", en: "With our skin, we feel. The water is cool." } },
      { art: "five", say: { hi: "आँख, कान, नाक, जीभ और त्वचा। ये हमारी पाँच इंद्रियाँ हैं।", en: "Eyes, ears, nose, tongue and skin. These are our five senses." } },
    ],
  },
  // Stage 1, Nature: "Animals, birds and plants by name".
  {
    id: "animals", subject: "nature", stage: 1, picture: "🐘", name: { en: "Animals", hi: "जानवर" },
    scenes: [
      { art: "many", say: { hi: "हमारे आसपास बहुत से जानवर रहते हैं।", en: "Many animals live around us." } },
      { art: "elephant", say: { hi: "यह हाथी है। हाथी बहुत बड़ा होता है। उसकी लंबी सूँड़ होती है।", en: "This is an elephant. An elephant is very big. It has a long trunk." } },
      { art: "cow", say: { hi: "यह गाय है। गाय घास खाती है।", en: "This is a cow. A cow eats grass." } },
      { art: "peacock", say: { hi: "यह मोर है। मोर एक पक्षी है। उसके पंख बहुत सुंदर होते हैं।", en: "This is a peacock. A peacock is a bird. Its feathers are very beautiful." } },
      { art: "fish", say: { hi: "यह मछली है। मछली पानी में रहती है।", en: "This is a fish. A fish lives in water." } },
      { art: "monkey", say: { hi: "यह बंदर है। बंदर पेड़ पर चढ़ता है।", en: "This is a monkey. A monkey climbs trees." } },
      { art: "each", say: { hi: "हाथी, गाय, मोर, मछली और बंदर। हर एक अलग है, और हर एक अपनी तरह से जीता है।", en: "Elephant, cow, peacock, fish and monkey. Each one is different, and each one lives in its own way." } },
    ],
  },
];

export const LESSON_IDS = LESSONS.map((l) => l.id);
export const lessonById = (id) => LESSONS.find((l) => l.id === id) ?? null;
export const lessonsOf = (subject, stage) => LESSONS.filter((l) => l.subject === subject && (stage === undefined || l.stage === stage));
/** The language a lesson is heard in: the learner's own when its lines are written, otherwise English. */
export const lessonLang = (lesson, lang) => (lesson.scenes[0].say[lang] ? lang : "en");
/** A line's name, "fire.2": the lesson and the scene, counted from 0. The Worker makes a recording only for these. */
export const lineId = (lesson, scene) => `${lesson.id}.${scene}`;
/** The text of a line by its name and language, or "" when there is none. */
export function lineText(id, lang) {
  const [lesson, scene] = String(id ?? "").split(".");
  return lessonById(lesson)?.scenes[Number(scene)]?.say[lang] ?? "";
}
