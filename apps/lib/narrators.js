// Every chapter is told in the voice of a great person of its field (sumeet, 2026-11-28): Brahmagupta on zero,
// al-Khwarizmi on algebra, Ibn al-Haytham on light, and so on. A voice may tell more than one chapter.
// The chapter is written in the first person, in that person's known way of thinking and with their own examples.
// It is honest: the screen says "told in the voice of X" and that the words are BodhiLabs' own, not a quotation.
// No sentence is made up and passed off as something the person really said or wrote. See CLAUDE.md.
import { names } from "./subjects.js";

/** `who` is the recorded voice the chapter is heard in ("man" or "woman"), kept from start to end. */
export const NARRATORS = {
  brahmagupta: { who: "man", years: "598–668", name: names("Brahmagupta|ब्रह्मगुप्त|ব্রহ্মগুপ্ত|ब्रह्मगुप्त|బ్రహ్మగుప్తుడు|பிரம்மகுப்தர்|બ્રહ્મગુપ્ત|برہم گپت|ಬ್ರಹ್ಮಗುಪ್ತ|ବ୍ରହ୍ମଗୁପ୍ତ|ബ്രഹ്മഗുപ്തൻ|ਬ੍ਰਹਮਗੁਪਤ") },
};
export const narratorById = (id) => NARRATORS[id] ?? null;

// Written by Claude in the eleven Indian languages, not yet checked by a native speaker.
const IN_VOICE = names("Told in the voice of {x}|{x} की आवाज़ में|{x}-এর কণ্ঠে|{x} यांच्या आवाजात|{x} స్వరంలో|{x} குரலில்|{x}ના અવાજમાં|{x} کی آواز میں|{x} ಅವರ ಧ್ವನಿಯಲ್ಲಿ|{x}ଙ୍କ ସ୍ୱରରେ|{x} എന്നയാളുടെ സ്വരത്തിൽ|{x} ਦੀ ਆਵਾਜ਼ ਵਿੱਚ");
const NOT_THEIR_WORDS = names("Written by BodhiLabs in this teacher's way of thinking. These are not their own words.|BodhiLabs ने इसे उनके सोचने के ढंग में लिखा है। ये उनके अपने शब्द नहीं हैं।|BodhiLabs এটি তাঁর ভাবনার ধরনে লিখেছে। এগুলি তাঁর নিজের কথা নয়।|BodhiLabs ने हे त्यांच्या विचार करण्याच्या पद्धतीत लिहिले आहे. हे त्यांचे स्वतःचे शब्द नाहीत.|BodhiLabs దీన్ని వారి ఆలోచనా పద్ధతిలో రాసింది. ఇవి వారి సొంత మాటలు కావు.|BodhiLabs இதை அவரது சிந்தனை முறையில் எழுதியது. இவை அவரது சொந்த வார்த்தைகள் அல்ல.|BodhiLabs એ આ તેમની વિચારવાની રીતમાં લખ્યું છે. આ તેમના પોતાના શબ્દો નથી.|BodhiLabs نے اسے ان کے سوچنے کے انداز میں لکھا ہے۔ یہ ان کے اپنے الفاظ نہیں ہیں۔|BodhiLabs ಇದನ್ನು ಅವರ ಆಲೋಚನಾ ರೀತಿಯಲ್ಲಿ ಬರೆದಿದೆ. ಇವು ಅವರ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲ.|BodhiLabs ଏହାକୁ ତାଙ୍କ ଚିନ୍ତାଧାରାରେ ଲେଖିଛି। ଏଗୁଡ଼ିକ ତାଙ୍କ ନିଜ ଶବ୍ଦ ନୁହେଁ।|BodhiLabs ഇത് അവരുടെ ചിന്താരീതിയിൽ എഴുതിയതാണ്. ഇവ അവരുടെ സ്വന്തം വാക്കുകളല്ല.|BodhiLabs ਨੇ ਇਹ ਉਨ੍ਹਾਂ ਦੇ ਸੋਚਣ ਦੇ ਢੰਗ ਵਿੱਚ ਲਿਖਿਆ ਹੈ। ਇਹ ਉਨ੍ਹਾਂ ਦੇ ਆਪਣੇ ਸ਼ਬਦ ਨਹੀਂ ਹਨ।");

/** "Told in the voice of Brahmagupta", in the learner's language. */
export const inVoiceOf = (id, lang) => (IN_VOICE[lang] ?? IN_VOICE.en).replace("{x}", NARRATORS[id].name[lang] ?? NARRATORS[id].name.en);
/** The honest line under it: these are BodhiLabs' words, not the person's. */
export const notTheirWords = (lang) => NOT_THEIR_WORDS[lang] ?? NOT_THEIR_WORDS.en;
