// Every lesson is told by a great person of its field (sumeet, 2026-11-28; lib/lessons.js `by`, and CLAUDE.md).
// These are the words the screen uses to say so honestly, for learners who read: "told in the voice of X", and that
// the words are CubeGullak's own, not a quotation. A teller's name is written in Hindi and English so far.
import { names } from "./subjects.js";

// Written by Claude in the eleven Indian languages, not yet checked by a native speaker.
const IN_VOICE = names("Told in the voice of {x}|{x} की आवाज़ में|{x}-এর কণ্ঠে|{x} यांच्या आवाजात|{x} స్వరంలో|{x} குரலில்|{x}ના અવાજમાં|{x} کی آواز میں|{x} ಅವರ ಧ್ವನಿಯಲ್ಲಿ|{x}ଙ୍କ ସ୍ୱରରେ|{x} എന്നയാളുടെ സ്വരത്തിൽ|{x} ਦੀ ਆਵਾਜ਼ ਵਿੱਚ");
const NOT_THEIR_WORDS = names("Written by CubeGullak in this teacher's way of thinking. These are not their own words.|CubeGullak ने इसे उनके सोचने के ढंग में लिखा है। ये उनके अपने शब्द नहीं हैं।|CubeGullak এটি তাঁর ভাবনার ধরনে লিখেছে। এগুলি তাঁর নিজের কথা নয়।|CubeGullak ने हे त्यांच्या विचार करण्याच्या पद्धतीत लिहिले आहे. हे त्यांचे स्वतःचे शब्द नाहीत.|CubeGullak దీన్ని వారి ఆలోచనా పద్ధతిలో రాసింది. ఇవి వారి సొంత మాటలు కావు.|CubeGullak இதை அவரது சிந்தனை முறையில் எழுதியது. இவை அவரது சொந்த வார்த்தைகள் அல்ல.|CubeGullak એ આ તેમની વિચારવાની રીતમાં લખ્યું છે. આ તેમના પોતાના શબ્દો નથી.|CubeGullak نے اسے ان کے سوچنے کے انداز میں لکھا ہے۔ یہ ان کے اپنے الفاظ نہیں ہیں۔|CubeGullak ಇದನ್ನು ಅವರ ಆಲೋಚನಾ ರೀತಿಯಲ್ಲಿ ಬರೆದಿದೆ. ಇವು ಅವರ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲ.|CubeGullak ଏହାକୁ ତାଙ୍କ ଚିନ୍ତାଧାରାରେ ଲେଖିଛି। ଏଗୁଡ଼ିକ ତାଙ୍କ ନିଜ ଶବ୍ଦ ନୁହେଁ।|CubeGullak ഇത് അവരുടെ ചിന്താരീതിയിൽ എഴുതിയതാണ്. ഇവ അവരുടെ സ്വന്തം വാക്കുകളല്ല.|CubeGullak ਨੇ ਇਹ ਉਨ੍ਹਾਂ ਦੇ ਸੋਚਣ ਦੇ ਢੰਗ ਵਿੱਚ ਲਿਖਿਆ ਹੈ। ਇਹ ਉਨ੍ਹਾਂ ਦੇ ਆਪਣੇ ਸ਼ਬਦ ਨਹੀਂ ਹਨ।");

/** "Told in the voice of Brahmagupta", in the learner's language. `by` is a lesson's or a chapter's teller. */
export const inVoiceOf = (by, lang) => (IN_VOICE[lang] ?? IN_VOICE.en).replace("{x}", by[lang] ?? by.en);
/** The honest line under it: these are CubeGullak's words, not the person's. */
export const notTheirWords = (lang) => NOT_THEIR_WORDS[lang] ?? NOT_THEIR_WORDS.en;
