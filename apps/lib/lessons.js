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
  // Stage 1, Nature: "Water: rain, rivers, wells; water for every living thing".
  {
    id: "water", subject: "nature", stage: 1, picture: "💧", name: { en: "Water", hi: "पानी" },
    by: { id: "varahamihira", en: "Varahamihira", hi: "वराहमिहिर" }, who: "man",
    scenes: [
      { art: "teller", prop: "🪔", say: { hi: "मैं वराहमिहिर हूँ। मैं उज्जैन में रहता था। मैंने लिखा कि धरती के नीचे पानी कहाँ मिलता है।", en: "I am Varahamihira. I lived in Ujjain. I wrote about where water is found under the ground." } },
      { art: "rain", say: { hi: "आसमान में बादल हैं। बादलों से पानी गिरता है। यह बारिश है।", en: "There are clouds in the sky. Water falls from the clouds. This is rain." } },
      { art: "river", say: { hi: "बारिश का पानी बहकर नदी बनता है। नदी बहती रहती है।", en: "Rain water flows and becomes a river. The river keeps flowing." } },
      { art: "well", say: { hi: "कुछ पानी ज़मीन के अंदर चला जाता है। हम कुआँ खोदकर उसे निकालते हैं।", en: "Some water goes into the ground. We dig a well and draw it up." } },
      { art: "thirsty", say: { hi: "पेड़ को पानी चाहिए। गाय को पानी चाहिए। पक्षी को पानी चाहिए। हमें भी पानी चाहिए।", en: "A tree needs water. A cow needs water. A bird needs water. We need water too." } },
      { art: "save", say: { hi: "पानी कीमती है। हम पानी बहाते नहीं। जितना चाहिए, उतना ही लेते हैं।", en: "Water is precious. We do not waste it. We take only as much as we need." } },
    ],
  },
  // Stage 1, Nature: "Weather and seasons".
  {
    id: "weather", subject: "nature", stage: 1, picture: "🌦️", name: { en: "Sun, rain and wind", hi: "धूप, बारिश, हवा" },
    by: { id: "varahamihira", en: "Varahamihira", hi: "वराहमिहिर" }, who: "man",
    scenes: [
      { art: "teller", prop: "🔭", say: { hi: "मैं वराहमिहिर हूँ। मैं फिर आया हूँ। मैं रोज़ आसमान देखता था, ताकि जान सकूँ कि बारिश कब आएगी।", en: "I am Varahamihira. I am here again. I watched the sky every day, to know when the rain would come." } },
      { art: "hot", say: { hi: "कभी तेज़ धूप होती है। बहुत गर्मी लगती है। तब हम छाया में बैठते हैं और पानी पीते हैं।", en: "Sometimes the sun is strong. It is very hot. Then we sit in the shade and drink water." } },
      { art: "rainy", say: { hi: "कभी काले बादल आते हैं और बारिश होती है। मेंढक बोलते हैं। धरती हरी हो जाती है।", en: "Sometimes dark clouds come and it rains. The frogs call. The earth turns green." } },
      { art: "windy", say: { hi: "कभी हवा चलती है। हवा दिखती नहीं, पर पत्ते हिलते हैं, तो हम जान जाते हैं कि हवा है।", en: "Sometimes the wind blows. We cannot see the wind, but the leaves move, so we know it is there." } },
      { art: "cold", say: { hi: "कभी ठंड आती है। सुबह कोहरा होता है। तब हम गरम कपड़े पहनते हैं।", en: "Sometimes the cold comes. In the morning there is fog. Then we wear warm clothes." } },
      { art: "rainbow", say: { hi: "धूप और बारिश साथ हों, तो आसमान में इंद्रधनुष बनता है। उसमें सात रंग होते हैं।", en: "When sun and rain come together, a rainbow forms in the sky. It has seven colours." } },
    ],
  },
  // Stage 1, Nature: "Animals by name: the small ones".
  {
    id: "small", subject: "nature", stage: 1, picture: "🐜", name: { en: "Small creatures", hi: "छोटे जीव" },
    by: { id: "merian", en: "Maria Sibylla Merian", hi: "मारिया सिबिला मेरियन" }, who: "woman",
    scenes: [
      { art: "teller", prop: "🖌️", say: { hi: "मैं मारिया सिबिला मेरियन हूँ। बचपन से मुझे इल्लियाँ और तितलियाँ देखना अच्छा लगता था। मैं उनके चित्र बनाती थी।", en: "I am Maria Sibylla Merian. Since I was a child I loved to watch caterpillars and butterflies. I used to draw them." } },
      { art: "ants", say: { hi: "ये चींटियाँ हैं। चींटियाँ एक कतार में चलती हैं और मिलकर खाना ले जाती हैं।", en: "These are ants. Ants walk in a line and carry food together." } },
      { art: "bee", say: { hi: "यह मधुमक्खी है। मधुमक्खी फूल से फूल पर जाती है और शहद बनाती है।", en: "This is a bee. A bee goes from flower to flower and makes honey." } },
      { art: "change", say: { hi: "एक छोटी इल्ली पत्ते खाती है। फिर वह सो जाती है। जब जागती है, तो तितली बन जाती है।", en: "A little caterpillar eats leaves. Then it goes to sleep. When it wakes, it has become a butterfly." } },
      { art: "spider", say: { hi: "यह मकड़ी है। मकड़ी अपने धागे से सुंदर जाला बुनती है।", en: "This is a spider. A spider weaves a beautiful web from its own thread." } },
      { art: "worm", say: { hi: "यह केंचुआ है। केंचुआ मिट्टी में रहता है और मिट्टी को नरम बनाता है।", en: "This is an earthworm. An earthworm lives in the soil and makes the soil soft." } },
    ],
  },
  // Stage 1, Nature: "Animals by name: how they live and grow".
  {
    id: "young", subject: "nature", stage: 1, picture: "🐣", name: { en: "Mothers and young ones", hi: "माँ और बच्चे" },
    by: { id: "goodall", en: "Jane Goodall", hi: "जेन गुडॉल" }, who: "woman",
    scenes: [
      { art: "teller", prop: "🌳", say: { hi: "मैं जेन गुडॉल हूँ। मैं बहुत साल जंगल में चिम्पैंज़ी के पास चुपचाप बैठी। मैंने देखा कि माँ अपने बच्चे का कैसे ध्यान रखती है।", en: "I am Jane Goodall. For many years I sat quietly near chimpanzees in the forest. I saw how a mother looks after her baby." } },
      { art: "hen", say: { hi: "यह मुर्गी है, और ये उसके चूज़े। चूज़े माँ के पीछे-पीछे चलते हैं।", en: "This is a hen, and these are her chicks. The chicks follow their mother." } },
      { art: "calf", say: { hi: "यह गाय है, और यह उसका बछड़ा। बछड़ा माँ का दूध पीता है।", en: "This is a cow, and this is her calf. The calf drinks its mother's milk." } },
      { art: "carry", say: { hi: "बंदर का बच्चा माँ से चिपका रहता है। माँ उसे लेकर पेड़ों पर चढ़ती है।", en: "A baby monkey holds on to its mother. She carries it up the trees." } },
      { art: "herd", say: { hi: "हाथी झुंड में रहते हैं। छोटा हाथी बीच में चलता है, सब उसका ध्यान रखते हैं।", en: "Elephants live in a herd. The little elephant walks in the middle, and everyone looks after it." } },
      { art: "grow", say: { hi: "हर बच्चा धीरे-धीरे बड़ा होता है, अपनी रफ़्तार से।", en: "Every young one grows up slowly, at its own pace." } },
    ],
  },
  // Stage 1, Nature: "Living in a band: sharing; caring for plants and animals".
  {
    id: "care", subject: "nature", stage: 1, picture: "🌱", name: { en: "Caring for living things", hi: "जीवों का ध्यान" },
    by: { id: "maathai", en: "Wangari Maathai", hi: "वंगारी मथाई" }, who: "woman",
    scenes: [
      { art: "teller", prop: "🌳", say: { hi: "मैं वंगारी मथाई हूँ। मैंने और मेरे साथियों ने मिलकर बहुत सारे पेड़ लगाए।", en: "I am Wangari Maathai. My friends and I planted a great many trees together." } },
      { art: "plant", say: { hi: "हम एक छोटा पौधा लगाते हैं, और रोज़ उसे पानी देते हैं।", en: "We plant a little sapling, and give it water every day." } },
      { art: "birdwater", say: { hi: "गर्मी में हम पक्षियों के लिए पानी का बर्तन रखते हैं।", en: "In the hot days, we put out a bowl of water for the birds." } },
      { art: "gentle", say: { hi: "जानवर भी दर्द महसूस करते हैं। हम उन्हें मारते नहीं, सताते नहीं। प्यार से रहते हैं।", en: "Animals feel pain too. We do not hit them or tease them. We are gentle with them." } },
      { art: "nobreak", say: { hi: "हम बेवजह डाल नहीं तोड़ते, और फूल नहीं नोचते।", en: "We do not break branches for no reason, and we do not pull off flowers." } },
      { art: "together", say: { hi: "पेड़, पक्षी, जानवर और हम, सब एक ही धरती पर साथ रहते हैं।", en: "Trees, birds, animals and we all live together on one Earth." } },
    ],
  },
  // Stage 1, Number: "One, two, many. One finger for one thing. Tally marks. More and less".
  {
    id: "count", subject: "number", stage: 1, picture: "✋", name: { en: "One, two, many", hi: "एक, दो, बहुत" },
    by: { id: "shakuntala", en: "Shakuntala Devi", hi: "शकुंतला देवी" }, who: "woman",
    scenes: [
      { art: "teller", prop: "🧮", say: { hi: "मैं शकुंतला देवी हूँ। जब मैं बहुत छोटी थी, तभी से मुझे गिनना बहुत अच्छा लगता था।", en: "I am Shakuntala Devi. Ever since I was very small, I loved to count." } },
      { art: "one", say: { hi: "यह एक आम है। एक। मैं एक उँगली उठाती हूँ।", en: "Here is one mango. One. I raise one finger." } },
      { art: "two", say: { hi: "अब दो आम हैं। एक, दो। दो उँगलियाँ।", en: "Now there are two mangoes. One, two. Two fingers." } },
      { art: "three", say: { hi: "एक, दो, तीन। तीन आम, तीन उँगलियाँ। हर चीज़ के लिए एक उँगली।", en: "One, two, three. Three mangoes, three fingers. One finger for each thing." } },
      { art: "tally", say: { hi: "बहुत पहले लोग हड्डी पर लकीरें खींचकर गिनते थे। हर चीज़ के लिए एक लकीर।", en: "Long ago, people counted by cutting lines on a bone. One line for each thing." } },
      { art: "more", say: { hi: "इस ओर दो चिड़ियाँ हैं, उस ओर चार। जिस ओर ज़्यादा हैं, वहाँ ज़्यादा उँगलियाँ लगती हैं।", en: "On this side there are two birds, on that side four. Where there are more, we need more fingers." } },
    ],
  },
  // Stage 1, Earth: "My place: near and far; direction from the rising Sun; day and night".
  {
    id: "daynight", subject: "earth", stage: 1, picture: "🌗", name: { en: "Day and night", hi: "दिन और रात" },
    by: { id: "aryabhata", en: "Aryabhata", hi: "आर्यभट" }, who: "man",
    scenes: [
      { art: "teller", prop: "🌌", say: { hi: "मैं आर्यभट हूँ। मैं रात-रात भर आसमान देखता था, और सोचता था कि दिन और रात क्यों होते हैं।", en: "I am Aryabhata. I watched the sky night after night, and wondered why there is day and night." } },
      { art: "sunrise", say: { hi: "सुबह सूरज एक ओर से निकलता है। उस ओर को पूरब कहते हैं।", en: "In the morning the Sun comes up on one side. That side is called the east." } },
      { art: "noon", say: { hi: "दोपहर में सूरज ऊपर होता है। तब सबसे ज़्यादा उजाला होता है।", en: "At midday the Sun is high above. Then it is brightest." } },
      { art: "sunset", say: { hi: "शाम को सूरज दूसरी ओर डूबता है। उस ओर को पश्चिम कहते हैं।", en: "In the evening the Sun goes down on the other side. That side is called the west." } },
      { art: "moon", say: { hi: "रात को अँधेरा होता है। चाँद और तारे दिखते हैं। हम सोते हैं।", en: "At night it is dark. We see the Moon and the stars. We sleep." } },
      { art: "near", say: { hi: "जो पास है, वह बड़ा दिखता है। जो दूर है, वह छोटा दिखता है। दूर का पेड़ भी असल में बड़ा है।", en: "What is near looks big. What is far looks small. The far tree is really big too." } },
      { art: "turns", say: { hi: "मैंने सोचा कि धरती घूमती है। इसीलिए सूरज कभी दिखता है, कभी नहीं। इसीलिए दिन और रात होते हैं।", en: "I thought that the Earth turns. That is why we see the Sun, and then we do not. That is why there is day and night." } },
    ],
  },
  // Stage 1, People: "The first humans in Africa; how they spread over the Earth".
  {
    id: "firstpeople", subject: "people", stage: 1, picture: "👣", name: { en: "The first people", hi: "पहले लोग" },
    by: { id: "leakey", en: "Mary Leakey", hi: "मैरी लीकी" }, who: "woman",
    scenes: [
      { art: "teller", prop: "⛏️", say: { hi: "मैं मैरी लीकी हूँ। मैं अफ़्रीका में मिट्टी खोदती थी, और बहुत पुराने लोगों के निशान ढूँढती थी।", en: "I am Mary Leakey. I dug the earth in Africa, looking for signs of very old people." } },
      { art: "footprints", say: { hi: "एक दिन हमें पत्थर जैसी राख में पैरों के निशान मिले। बहुत-बहुत पुराने। कोई यहाँ चला था।", en: "One day we found footprints in ash that had turned to stone. Very, very old. Someone had walked here." } },
      { art: "band", say: { hi: "सबसे पहले लोग अफ़्रीका में रहते थे। वे छोटे-छोटे समूहों में साथ रहते थे।", en: "The very first people lived in Africa. They lived together in small groups." } },
      { art: "walk", say: { hi: "फिर वे चलते गए। बहुत धीरे-धीरे, बहुत सालों में।", en: "Then they kept walking. Very slowly, over very many years." } },
      { art: "spread", say: { hi: "वे हर जगह पहुँचे। पहाड़ों पर, नदियों के पास, ठंडी जगहों में, और भारत में भी।", en: "They reached every place. The mountains, the rivers, the cold lands, and India too." } },
      { art: "family", say: { hi: "इसीलिए धरती के सारे लोग एक बड़े परिवार जैसे हैं।", en: "That is why all the people of the Earth are like one big family." } },
    ],
  },
  // Stage 1, Rule: "Living in a band: sharing, taking turns".
  {
    id: "share", subject: "rule", stage: 1, picture: "🤝", name: { en: "Sharing and taking turns", hi: "बाँटना और बारी" },
    by: { id: "gandhi", en: "Mohandas Gandhi", hi: "मोहनदास गांधी" }, who: "man",
    scenes: [
      { art: "teller", prop: "👓", say: { hi: "मैं मोहनदास गांधी हूँ। लोग मुझे बापू कहते थे। मैं मानता था कि साथ रहने का सबसे अच्छा तरीका है प्यार और सच।", en: "I am Mohandas Gandhi. People called me Bapu. I believed the best way to live together is with love and truth." } },
      { art: "group", say: { hi: "पहले लोग समूह में साथ रहते थे। अकेले रहना कठिन था, साथ रहना आसान।", en: "The first people lived together in a group. Living alone was hard; living together was easier." } },
      { art: "sharefood", say: { hi: "जो खाना मिलता, वह सब में बँटता। हर किसी को थोड़ा-थोड़ा।", en: "The food they found was shared by all. A little for everyone." } },
      { art: "turn", say: { hi: "एक ही चीज़ सबको चाहिए हो, तो हम बारी-बारी से लेते हैं। पहले तुम, फिर मैं।", en: "When everyone wants the same thing, we take turns. First you, then me." } },
      { art: "help", say: { hi: "कोई गिर जाए, तो हम उसे उठाते हैं। कोई छोटा हो, तो उसकी मदद करते हैं।", en: "If someone falls, we help them up. If someone is small, we help them." } },
      { art: "sorry", say: { hi: "गलती हो जाए, तो हम सॉरी कहते हैं। और फिर से दोस्त बन जाते हैं।", en: "If we make a mistake, we say sorry. And we are friends again." } },
    ],
  },
  // Stage 1, Hand: "Stone tools. Do: tie a knot, twist a rope".
  {
    id: "tools", subject: "hand", stage: 1, picture: "🪨", name: { en: "Stone tools", hi: "पत्थर के औज़ार" },
    by: { id: "louis-leakey", en: "Louis Leakey", hi: "लुई लीकी" }, who: "man",
    scenes: [
      { art: "teller", prop: "🔍", say: { hi: "मैं लुई लीकी हूँ। मुझे अफ़्रीका में बहुत पुराने पत्थर के औज़ार मिले। उन्हें बनाने वालों को हमने हाथ वाला आदमी नाम दिया।", en: "I am Louis Leakey. In Africa I found very old stone tools. We called the people who made them the handy man." } },
      { art: "knap", say: { hi: "पहले लोग एक पत्थर को दूसरे पत्थर से ठोकते थे। धीरे-धीरे उसकी धार तेज़ हो जाती थी।", en: "The first people struck one stone with another. Slowly its edge became sharp." } },
      { art: "cut", say: { hi: "तेज़ पत्थर से वे लकड़ी छीलते थे और फल काटते थे।", en: "With the sharp stone they peeled wood and cut fruit." } },
      { art: "rope", say: { hi: "घास या बेल को आपस में मरोड़ो, तो रस्सी बन जाती है। तुम भी तीन धागे लेकर मरोड़ो।", en: "Twist grass or vines together and it becomes a rope. You too can take three threads and twist them." } },
      { art: "knot", say: { hi: "रस्सी में गाँठ बाँधो। एक सिरा घुमाओ, अंदर डालो, और खींचो। तुम भी करके देखो।", en: "Tie a knot in the rope. Loop one end, push it through, and pull. Try it yourself." } },
      { art: "careful", say: { hi: "औज़ार तेज़ होते हैं। हम उन्हें ध्यान से पकड़ते हैं, और बड़ों के साथ ही इस्तेमाल करते हैं।", en: "Tools are sharp. We hold them with care, and use them only with a grown-up." } },
    ],
  },
  // Stage 1, Body: "Do: walk, run, jump, throw, climb, squat".
  {
    id: "move", subject: "body", stage: 1, picture: "🏃", name: { en: "Walk, run, jump", hi: "चलो, दौड़ो, कूदो" },
    by: { id: "milkha", en: "Milkha Singh", hi: "मिल्खा सिंह" }, who: "man",
    scenes: [
      { art: "teller", prop: "👟", say: { hi: "मैं मिल्खा सिंह हूँ। बचपन में मैं रोज़ बहुत दूर तक पैदल और दौड़कर जाता था। मुझे दौड़ना बहुत अच्छा लगता था।", en: "I am Milkha Singh. As a boy I walked and ran a long way every day. I loved to run." } },
      { art: "walking", say: { hi: "आओ, धीरे-धीरे चलें। एक पैर, फिर दूसरा।", en: "Come, let us walk slowly. One foot, then the other." } },
      { art: "running", say: { hi: "अब तेज़ दौड़ो। हाथ भी आगे-पीछे चलते हैं।", en: "Now run fast. Your arms swing too." } },
      { art: "jumping", say: { hi: "अब दोनों पैरों से ऊपर कूदो। और धीरे से नीचे आओ।", en: "Now jump up with both feet. And land softly." } },
      { art: "throwing", say: { hi: "एक गेंद लो और दूर फेंको।", en: "Take a ball and throw it far." } },
      { art: "squat", say: { hi: "अब नीचे बैठो, जैसे खाना खाने बैठते हैं। फिर खड़े हो जाओ। थक जाओ, तो आराम करो।", en: "Now squat down, as when we sit to eat. Then stand up. When you are tired, rest." } },
    ],
  },
  // Stage 1, Music: "Do: clap a beat; sing a call and an answer; dance in a circle. The first flute. Make a sound from a reed or a leaf".
  {
    id: "sound", subject: "music", stage: 1, picture: "🥁", name: { en: "Clap, sing, dance", hi: "ताली, गाना, नाच" },
    by: { id: "bismillah", en: "Bismillah Khan", hi: "बिस्मिल्लाह ख़ाँ" }, who: "man",
    scenes: [
      { art: "teller", prop: "🎺", say: { hi: "मैं बिस्मिल्लाह ख़ाँ हूँ। मैं शहनाई बजाता था। मैंने बनारस में गंगा के किनारे रोज़ अभ्यास किया।", en: "I am Bismillah Khan. I played the shehnai. I practised every day by the Ganga in Banaras." } },
      { art: "clap", say: { hi: "मेरे साथ ताली बजाओ। एक, दो, तीन, चार। फिर से।", en: "Clap with me. One, two, three, four. Again." } },
      { art: "call", say: { hi: "मैं गाऊँगा, फिर तुम वही गाना। मैं बुलाऊँ, तुम जवाब दो। आ, आ, आ।", en: "I will sing, then you sing it back. I call, you answer. Aa, aa, aa." } },
      { art: "circle", say: { hi: "पहले लोग आग के चारों ओर गोले में नाचते थे। हाथ पकड़ो और घूमो।", en: "The first people danced in a circle round the fire. Hold hands and go round." } },
      { art: "flute", say: { hi: "बहुत पहले किसी ने पक्षी की खोखली हड्डी में छेद किए। उसमें फूँका, तो सुर निकला। यह पहली बाँसुरी थी।", en: "Long ago someone made holes in the hollow bone of a bird. They blew into it, and a note came out. This was the first flute." } },
      { art: "leaf", say: { hi: "एक पत्ते को दोनों अंगूठों के बीच तानो, और फूँको। सुनो, आवाज़ आती है।", en: "Stretch a leaf between your two thumbs, and blow. Listen, it makes a sound." } },
    ],
  },
  // Stage 1, Art: "Lines, dots and handprints on a cave wall (Bhimbetka). Do: draw lines, then an animal from the side".
  {
    id: "cave", subject: "art", stage: 1, picture: "🖐️", name: { en: "Pictures on the cave wall", hi: "गुफ़ा के चित्र" },
    by: { id: "wakankar", en: "Vishnu Wakankar", hi: "विष्णु वाकणकर" }, who: "man",
    scenes: [
      { art: "teller", prop: "🖼️", say: { hi: "मैं विष्णु वाकणकर हूँ। मैं चित्रकार भी था। एक दिन ट्रेन से मुझे भीमबेटका की पहाड़ियाँ दिखीं। वहाँ जाकर मैंने बहुत पुराने चित्र पाए।", en: "I am Vishnu Wakankar. I was a painter too. One day, from a train, I saw the hills of Bhimbetka. When I went there, I found very old pictures." } },
      { art: "rocks", say: { hi: "ये भीमबेटका की गुफ़ाएँ हैं, हमारे मध्य प्रदेश में। बहुत पुराने लोग यहाँ रहते थे।", en: "These are the caves of Bhimbetka, in our Madhya Pradesh. Very old people lived here." } },
      { art: "palms", say: { hi: "उन्होंने दीवार पर अपने हाथ की छाप लगाई। रंग लगाया, और हथेली दबा दी।", en: "They pressed their hands on the wall. They put on colour, and pressed the palm." } },
      { art: "lines", say: { hi: "उन्होंने लकीरें और बिंदु बनाए। तुम भी एक सीधी लकीर बनाओ, फिर एक टेढ़ी।", en: "They made lines and dots. You too, draw a straight line, then a wavy one." } },
      { art: "animal", say: { hi: "फिर उन्होंने जानवर बनाए, बगल से देखे हुए। एक लंबा शरीर, चार पैर, एक सिर।", en: "Then they drew animals, seen from the side. A long body, four legs, a head." } },
      { art: "yours", say: { hi: "अब तुम अपना जानवर बनाओ। जैसा तुम्हें दिखे, वैसा। तुम्हारा चित्र तुम्हारा अपना है।", en: "Now draw your own animal. As you see it. Your picture is your own." } },
    ],
  },
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
