// The joker opens the life of one great person of the world, a different one each time: how they learned and how
// they grew. A child sees through a life why learning matters (sumeet, 2026-11-28). The set will hold 121 lives, of
// artists, thinkers, scientists and others, each in the eleven languages, to read or to hear.
// These three are placeholders so the screen can be built. The list and the texts are being written elsewhere:
// add a life here with its `text` per language. A language with no text yet shows and speaks the English one.
export const LIVES = [
  {
    id: "leonardo", picture: "🎨", years: "1452 – 1519",
    name: { en: "Leonardo da Vinci", hi: "लियोनार्डो दा विंची" },
    text: {
      en: "Leonardo was born in 1452 in the small town of Vinci in Italy. He had very little schooling. At about fourteen he went to the city of Florence to learn in the workshop of the painter Verrocchio. There he learned by doing: mixing colours, drawing, working with metal. All his life he carried notebooks. He drew birds to understand how they fly, and the human body to understand how it moves. He painted the Mona Lisa. He never stopped asking why.",
      hi: "लियोनार्डो का जन्म 1452 में इटली के छोटे से कस्बे विंची में हुआ। वे स्कूल बहुत कम गए। लगभग चौदह साल की उम्र में वे फ्लोरेंस शहर गए और चित्रकार वेरोकियो की कार्यशाला में सीखने लगे। वहाँ उन्होंने काम करके सीखा: रंग मिलाना, चित्र बनाना, धातु का काम। वे जीवन भर अपने साथ कॉपी रखते थे। पक्षी कैसे उड़ते हैं यह समझने के लिए उन्होंने पक्षियों के चित्र बनाए, और शरीर कैसे चलता है यह समझने के लिए शरीर के। उन्होंने मोना लिसा बनाई। उन्होंने कभी यह पूछना नहीं छोड़ा कि ऐसा क्यों होता है।",
    },
  },
  {
    id: "einstein", picture: "🧑‍🔬", years: "1879 – 1955",
    name: { en: "Albert Einstein", hi: "अल्बर्ट आइंस्टीन" },
    text: {
      en: "Albert Einstein was born in 1879 in Germany. When he was five his father showed him a compass. The needle always pointed the same way, and the boy wondered what unseen thing moved it. At twelve he taught himself geometry from a small book. Later he worked in an office that checked new inventions, and in his free time he thought about light, time and space. In 1905 he wrote papers that changed science. In 1921 he was given the Nobel Prize.",
      hi: "अल्बर्ट आइंस्टीन का जन्म 1879 में जर्मनी में हुआ। जब वे पाँच साल के थे, उनके पिता ने उन्हें एक कम्पास दिखाया। उसकी सुई हमेशा एक ही ओर रहती थी, और बच्चा सोचता रहा कि कौन सी अनदेखी चीज़ उसे घुमाती है। बारह साल की उम्र में उन्होंने एक छोटी किताब से खुद ज्यामिति सीखी। बाद में वे एक दफ़्तर में काम करने लगे जहाँ नए आविष्कारों की जाँच होती थी, और खाली समय में प्रकाश, समय और आकाश के बारे में सोचते थे। 1905 में उन्होंने ऐसे लेख लिखे जिन्होंने विज्ञान बदल दिया। 1921 में उन्हें नोबेल पुरस्कार मिला।",
    },
  },
  {
    id: "aryabhata", picture: "🌙", years: "476 – 550",
    name: { en: "Aryabhata", hi: "आर्यभट" },
    text: {
      en: "Aryabhata was born in the year 476 in India. He loved numbers and the night sky. When he was only twenty-three he wrote a book in verse, the Aryabhatiya. In it he said that the Earth turns, and that this is why the stars seem to move. He gave a very close value for the number we now call pi, and he worked out how eclipses happen. He learned by watching the sky night after night and by doing the sums himself.",
      hi: "आर्यभट का जन्म सन् 476 में भारत में हुआ। उन्हें संख्याओं और रात के आकाश से प्रेम था। केवल तेईस साल की उम्र में उन्होंने छंदों में एक पुस्तक लिखी, आर्यभटीय। उसमें उन्होंने कहा कि पृथ्वी घूमती है, और इसी कारण तारे चलते हुए दिखते हैं। जिस संख्या को आज हम पाई कहते हैं, उसका उन्होंने बहुत सटीक मान बताया, और यह भी समझाया कि ग्रहण कैसे लगते हैं। उन्होंने रात दर रात आकाश को देखकर और खुद गणना करके सीखा।",
    },
  },
];
export const LIFE_IDS = LIVES.map((l) => l.id);
export const lifeById = (id) => LIVES.find((l) => l.id === id) ?? null;
/** The language a life can be shown and spoken in: the person's own when its text exists, else English. */
export const lifeLang = (life, lang) => (life.text[lang] ? lang : "en");
/** The next life: any one but the last, so two opens never show the same. `random` is a number from 0 up to 1. */
export function nextLife(last, random = Math.random()) {
  const pool = LIVES.length > 1 ? LIVES.filter((l) => l.id !== last) : LIVES;
  return pool[Math.min(pool.length - 1, Math.floor(random * pool.length))];
}
