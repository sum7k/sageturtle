// Lessons: short moving pictures with a spoken line, for stages 1 and 2 of the Gyan path, where nothing is read.
// A lesson is not a video file. It is a list of scenes; each scene names a drawing (components/LessonArt.jsx, drawn
// and moved by the phone itself) and the line that is spoken over it. The same drawing serves every language; only
// the recording changes (a file made beforehand, lib/voice.js; the phone's own voice until it is made). So a lesson weighs a few kilobytes.
// The steps come from gyan/docs/syllabus-map.md. The lines were written by Claude, in Hindi and English first;
// the other ten languages follow once the lessons are approved. Until then they are heard in English.
//
// The teller (sumeet, 2026-11-28): every lesson is told by a great person of that field, in the first person and in
// their manner (`by`), never in the voice of a machine. The words are written for the lesson in that person's manner;
// they are not that person's own quotes. `who` is the recorded voice, a man's or a woman's, to match the teller.
// The first scene is the teller saying who they are; what they say of themselves must be true to their life.
//
// The spirit (CLAUDE.md): a lesson shows and names. It never compares the learner with anyone and never hurries them.

import { ZERO } from "./chapters/zero.js";

/**
 * Chapters, from stage 4 on, where the learner reads: a set of lessons on one topic, told in the voice of a great
 * person of the field (lib/narrators.js). Their lessons are written (the line is shown under the drawing), say whose
 * voice they are told in, and end with a few sums to try. Each chapter lives in its own file in lib/chapters.
 */
export const CHAPTERS = [ZERO];
export const chaptersOf = (subject) => CHAPTERS.filter((c) => c.subject === subject);
const inChapter = CHAPTERS.flatMap((c) => c.lessons.map((l) => ({ ...l, subject: c.subject, stage: c.stage, by: c.by, who: c.who, chapter: c.id })));

export const LESSONS = [
  // Stage 1, Nature: "The body and its five senses".
  {
    id: "body", subject: "nature", stage: 1, picture: "🧒", name: { en: "My body", hi: "मेरा शरीर" },
    by: { id: "sushruta", en: "Sushruta", hi: "सुश्रुत" }, who: "man",
    scenes: [
      { art: "teller", prop: "🌿", say: { hi: "मैं सुश्रुत हूँ। मैं वैद्य हूँ। मैंने शरीर को बहुत ध्यान से देखा है। आओ, तुम्हें अपना शरीर दिखाऊँ।", en: "I am Sushruta. I am a healer. I have looked at the body very closely. Come, let me show you your body." } },
      { art: "body", say: { hi: "यह हमारा शरीर है। इसी से हम चलते हैं, खेलते हैं और काम करते हैं।", en: "This is our body. With it we walk, play and work." } },
      { art: "head", say: { hi: "सबसे ऊपर सिर है। सिर में आँख, कान, नाक और मुँह हैं।", en: "At the top is the head. The head has eyes, ears, a nose and a mouth." } },
      { art: "hands", say: { hi: "ये दो हाथ हैं। हाथों से हम पकड़ते हैं और चीज़ें बनाते हैं।", en: "These are two hands. With our hands we hold things and make things." } },
      { art: "legs", say: { hi: "ये दो पैर हैं। पैरों से हम चलते हैं, दौड़ते हैं और कूदते हैं।", en: "These are two legs. With our legs we walk, run and jump." } },
      { art: "wash", say: { hi: "हम अपने शरीर को साफ़ रखते हैं। पानी से हाथ धोते हैं और नहाते हैं।", en: "We keep our body clean. We wash our hands and bathe with water." } },
      { art: "bodies", say: { hi: "हर किसी का शरीर थोड़ा अलग होता है। कोई लंबा, कोई छोटा। हर शरीर अच्छा है।", en: "Every body is a little different. Some are tall, some are small. Every body is good." } },
    ],
  },
  // Stage 1, Nature: "The body and its five senses".
  {
    id: "senses", subject: "nature", stage: 1, picture: "👀", name: { en: "The five senses", hi: "पाँच इंद्रियाँ" },
    by: { id: "charaka", en: "Charaka", hi: "चरक" }, who: "man",
    scenes: [
      { art: "teller", prop: "👀", say: { hi: "मैं चरक हूँ। मैं भी वैद्य हूँ। मैं बताता हूँ कि शरीर दुनिया को कैसे जानता है।", en: "I am Charaka. I too am a healer. I will tell you how the body knows the world." } },
      { art: "face", say: { hi: "हमारा शरीर दुनिया को पाँच तरह से जानता है।", en: "Our body knows the world in five ways." } },
      { art: "see", say: { hi: "आँखों से हम देखते हैं। देखो, एक फूल।", en: "With our eyes, we see. Look, a flower." } },
      { art: "hear", say: { hi: "कानों से हम सुनते हैं। सुनो, चिड़िया गा रही है।", en: "With our ears, we hear. Listen, a bird is singing." } },
      { art: "smell", say: { hi: "नाक से हम सूँघते हैं। फूल की खुशबू अच्छी है।", en: "With our nose, we smell. The flower smells nice." } },
      { art: "taste", say: { hi: "जीभ से हम स्वाद लेते हैं। आम मीठा है।", en: "With our tongue, we taste. The mango is sweet." } },
      { art: "touch", say: { hi: "त्वचा से हम छूकर जानते हैं। पानी ठंडा है।", en: "With our skin, we feel. The water is cool." } },
      { art: "five", say: { hi: "आँख, कान, नाक, जीभ और त्वचा। ये हमारी पाँच इंद्रियाँ हैं।", en: "Eyes, ears, nose, tongue and skin. These are our five senses." } },
    ],
  },
  // Stage 1, Nature: "Fire: what burns, what it gives, how to be safe".
  {
    id: "fire", subject: "nature", stage: 1, picture: "🔥", name: { en: "Fire", hi: "आग" },
    by: { id: "faraday", en: "Michael Faraday", hi: "माइकल फैराडे" }, who: "man",
    scenes: [
      { art: "teller", prop: "🕯️", say: { hi: "मैं माइकल फैराडे हूँ। मुझे जलती लौ को देर तक देखना बहुत अच्छा लगता है। आओ, आग को साथ में देखें।", en: "I am Michael Faraday. I love to watch a burning flame for a long time. Come, let us look at fire together." } },
      { art: "night", say: { hi: "बहुत पहले की बात है। रात में बहुत अँधेरा होता था। और बहुत ठंड लगती थी।", en: "Long, long ago, the night was very dark. And it was very cold." } },
      { art: "lightning", say: { hi: "एक दिन आसमान से बिजली गिरी। एक सूखा पेड़ जलने लगा। यह आग थी।", en: "One day, lightning fell from the sky. A dry tree began to burn. This was fire." } },
      { art: "light", say: { hi: "आग से रोशनी मिलती है। अँधेरा दूर हो जाता है।", en: "Fire gives light. The dark goes away." } },
      { art: "warm", say: { hi: "आग से गर्मी मिलती है। ठंड दूर हो जाती है।", en: "Fire gives warmth. The cold goes away." } },
      { art: "cook", say: { hi: "आग पर खाना पकता है। पका हुआ खाना नरम होता है।", en: "Food is cooked on fire. Cooked food is soft." } },
      { art: "burns", say: { hi: "सूखी लकड़ी जलती है। सूखे पत्ते भी जलते हैं।", en: "Dry wood burns. Dry leaves burn too." } },
      { art: "noburn", say: { hi: "पत्थर नहीं जलता। और पानी आग को बुझा देता है।", en: "A stone does not burn. And water puts fire out." } },
      { art: "safe", say: { hi: "आग बहुत गरम होती है। मैं भी आग को छूता नहीं। हम आग से थोड़ा दूर रहते हैं।", en: "Fire is very hot. I do not touch fire either. We stay a little away from it." } },
    ],
  },
  // Stage 1, Nature: "Animals, birds and plants by name".
  {
    id: "animals", subject: "nature", stage: 1, picture: "🐘", name: { en: "Animals", hi: "जानवर" },
    by: { id: "aristotle", en: "Aristotle", hi: "अरस्तू" }, who: "man",
    scenes: [
      { art: "teller", prop: "🐚", say: { hi: "मैं अरस्तू हूँ। मैं समुद्र के किनारे बैठकर जानवरों को देखता था। जो देखता था, उसे याद रखता था।", en: "I am Aristotle. I used to sit by the sea and watch the animals. What I saw, I remembered." } },
      { art: "many", say: { hi: "हमारे आसपास बहुत से जानवर रहते हैं।", en: "Many animals live around us." } },
      { art: "elephant", say: { hi: "यह हाथी है। हाथी बहुत बड़ा होता है। उसकी लंबी सूँड़ होती है।", en: "This is an elephant. An elephant is very big. It has a long trunk." } },
      { art: "cow", say: { hi: "यह गाय है। गाय घास खाती है।", en: "This is a cow. A cow eats grass." } },
      { art: "peacock", say: { hi: "यह मोर है। मोर एक पक्षी है। उसके पंख बहुत सुंदर होते हैं।", en: "This is a peacock. A peacock is a bird. Its feathers are very beautiful." } },
      { art: "fish", say: { hi: "यह मछली है। मछली पानी में रहती है।", en: "This is a fish. A fish lives in water." } },
      { art: "monkey", say: { hi: "यह बंदर है। बंदर पेड़ पर चढ़ता है।", en: "This is a monkey. A monkey climbs trees." } },
      { art: "each", say: { hi: "हाथी, गाय, मोर, मछली और बंदर। हर एक अलग है, और हर एक अपनी तरह से जीता है।", en: "Elephant, cow, peacock, fish and monkey. Each one is different, and each one lives in its own way." } },
    ],
  },
  // Stage 1, Nature: "Animals, birds and plants by name".
  {
    id: "birds", subject: "nature", stage: 1, picture: "🦜", name: { en: "Birds", hi: "पक्षी" },
    by: { id: "salim-ali", en: "Salim Ali", hi: "सालिम अली" }, who: "man",
    scenes: [
      { art: "teller", prop: "🐦", say: { hi: "मैं सालिम अली हूँ। बचपन में मैंने एक छोटी चिड़िया देखी। फिर मैं जीवन भर पक्षियों को देखता रहा।", en: "I am Salim Ali. As a child I saw a little bird. After that I watched birds all my life." } },
      { art: "wings", say: { hi: "पक्षियों के पंख होते हैं। ज़्यादातर पक्षी उड़ते हैं।", en: "Birds have wings. Most birds fly." } },
      { art: "parrot", say: { hi: "यह तोता है। तोता हरा होता है। उसकी चोंच लाल होती है।", en: "This is a parrot. A parrot is green. Its beak is red." } },
      { art: "rooster", say: { hi: "यह मुर्गा है। मुर्गा सुबह-सुबह बाँग देता है।", en: "This is a rooster. A rooster crows early in the morning." } },
      { art: "owl", say: { hi: "यह उल्लू है। उल्लू रात में जागता है।", en: "This is an owl. An owl is awake at night." } },
      { art: "duck", say: { hi: "यह बतख है। बतख पानी में तैरती है।", en: "This is a duck. A duck swims on water." } },
      { art: "nest", say: { hi: "पक्षी घोंसला बनाते हैं। घोंसले में अंडे होते हैं। अंडों से बच्चे निकलते हैं।", en: "Birds make a nest. In the nest there are eggs. Chicks come out of the eggs." } },
    ],
  },
  // Stage 1, Nature: "Animals, birds and plants by name".
  {
    id: "plants", subject: "nature", stage: 1, picture: "🌳", name: { en: "Plants", hi: "पेड़-पौधे" },
    by: { id: "bose", en: "Jagadish Chandra Bose", hi: "जगदीश चंद्र बसु" }, who: "man",
    scenes: [
      { art: "teller", prop: "🌱", say: { hi: "मैं जगदीश चंद्र बसु हूँ। मैंने जाना कि पौधे भी जीते हैं, और अपने ढंग से महसूस करते हैं।", en: "I am Jagadish Chandra Bose. I found that plants are alive too, and feel in their own way." } },
      { art: "seed", say: { hi: "यह एक बीज है। बीज मिट्टी में सोता है।", en: "This is a seed. The seed sleeps in the soil." } },
      { art: "sprout", say: { hi: "पानी और धूप मिलने पर बीज से पौधा निकलता है।", en: "With water and sunlight, a plant comes out of the seed." } },
      { art: "tree", say: { hi: "पौधा धीरे-धीरे बढ़कर पेड़ बनता है। नीचे जड़ें हैं, बीच में तना है, और ऊपर पत्ते हैं।", en: "Slowly the plant grows into a tree. Below are the roots, in the middle is the trunk, and above are the leaves." } },
      { art: "flower", say: { hi: "पेड़ पर फूल खिलते हैं। फूलों से फल बनते हैं।", en: "Flowers bloom on the tree. Flowers turn into fruit." } },
      { art: "shade", say: { hi: "पेड़ हमें छाया देते हैं और फल देते हैं। पक्षी पेड़ पर रहते हैं।", en: "Trees give us shade and fruit. Birds live in trees." } },
    ],
  },
  // Stage 1, Nature: "what can be eaten".
  {
    id: "food", subject: "nature", stage: 1, picture: "🥭", name: { en: "What we eat", hi: "हम क्या खाते हैं" },
    by: { id: "janaki", en: "Janaki Ammal", hi: "जानकी अम्माल" }, who: "woman",
    scenes: [
      { art: "teller", prop: "🌾", say: { hi: "मैं जानकी अम्माल हूँ। मैंने जीवन भर पौधों को पढ़ा। आओ देखें, पौधे हमें खाने को क्या देते हैं।", en: "I am Janaki Ammal. I studied plants all my life. Come, let us see what plants give us to eat." } },
      { art: "fruit", say: { hi: "पेड़ों पर फल लगते हैं। आम, केला और अंगूर। पके फल मीठे होते हैं।", en: "Fruit grows on trees. Mango, banana and grapes. Ripe fruit is sweet." } },
      { art: "roots", say: { hi: "कुछ खाना ज़मीन के नीचे उगता है। जैसे गाजर और शकरकंद।", en: "Some food grows under the ground. Like carrots and sweet potatoes." } },
      { art: "nuts", say: { hi: "बीज और मेवे भी खाए जाते हैं। मधुमक्खी के छत्ते से शहद मिलता है।", en: "Seeds and nuts are eaten too. Honey comes from the hive of bees." } },
      { art: "noteat", say: { hi: "पर हर चीज़ खाई नहीं जाती। कुछ चीज़ें हमें बीमार कर सकती हैं।", en: "But not everything can be eaten. Some things can make us ill." } },
      { art: "askfirst", say: { hi: "जिस चीज़ को हम नहीं जानते, उसे बड़ों से पूछकर ही खाते हैं।", en: "What we do not know, we eat only after asking a grown-up." } },
      { art: "drink", say: { hi: "और हम साफ़ पानी पीते हैं। पानी सबको चाहिए।", en: "And we drink clean water. Everyone needs water." } },
    ],
  },
  ...inChapter,
];

// A lesson may carry `house: n` (1 to 12): lessons with the same house are parts of one unit (lib/stages.js unitsOf).
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
