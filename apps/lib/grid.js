// Every level of CubeGullak looks the same (sumeet, 2026-11-28): a grid of 4 by 4, sixteen boxes.
// The twelve outer boxes are the twelve houses of that level: the subjects on Home, a subject's own twelve steps
// inside it. The four boxes in the middle are the same everywhere: the learner's own page, a place to ask, the
// settings, and one kept empty.
import { names } from "./subjects.js";

/**
 * Where each house sits, as [row, column] from 1 (sumeet, 2026-11-28). The bottom right box is always the last
 * house, the twelfth. Counting starts in the box just left of it: house 1, then left along the bottom row, up the
 * left side, right along the top row, and down the right side to end in the bottom right.
 */
export const AROUND = [[4, 3], [4, 2], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4]];

/**
 * The four in the middle (sumeet, 2026-11-28): the learner's own page, a place to ask, the settings, and one box
 * kept empty for later (the joker). Each of the first three is one page (app/self, app/ask, app/settings) that
 * shows one thing on Home, the top level, and another inside an app: see `whereOf`.
 */
export const CENTRE = [
  { id: "self", picture: "🙂", at: [2, 2], name: names("Me|मैं|আমি|मी|నేను|நான்|હું|میں|ನಾನು|ମୁଁ|ഞാൻ|ਮੈਂ") },
  { id: "ask", picture: "❓", at: [2, 3], name: names("Ask|पूछो|জিজ্ঞাসা|विचारा|అడగండి|கேள்|પૂછો|پوچھو|ಕೇಳಿ|ପଚାର|ചോദിക്കൂ|ਪੁੱਛੋ") },
  { id: "settings", picture: "⚙️", at: [3, 2], name: names("Settings|सेटिंग|সেটিংস|सेटिंग्ज|సెట్టింగ్‌లు|அமைப்புகள்|સેટિંગ|ترتیبات|ಸೆಟ್ಟಿಂಗ್‌ಗಳು|ସେଟିଂ|ക്രമീകരണം|ਸੈਟਿੰਗ") },
  { id: "joker", picture: "🃏", at: [3, 3], name: { en: "" }, empty: true }, // nothing behind it yet; a press is only counted
];
/** Which side of a middle page a grid opens: "top" from Home, "gyan" from the grids inside Gyan (the stages, a stage). */
export const whereOf = (level) => (level === "top" ? "top" : "gyan");
export const centreById = (id) => CENTRE.find((c) => c.id === id);

/** The few words the four pages need. Written by Claude in the eleven Indian languages, not yet checked by a native speaker. */
export const SAY = {
  strong: names("Strong|अच्छा आता है|ভালো পারি|चांगले येते|బాగా వచ్చు|நன்றாக வரும்|સારું આવડે છે|اچھا آتا ہے|ಚೆನ್ನಾಗಿ ಬರುತ್ತದೆ|ଭଲ ଆସେ|നന്നായി അറിയാം|ਚੰਗਾ ਆਉਂਦਾ ਹੈ"),
  weak: names("Practise more|और अभ्यास|আরও অভ্যাস|अजून सराव|ఇంకా సాధన|இன்னும் பயிற்சி|વધુ અભ્યાસ|مزید مشق|ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸ|ଆହୁରି ଅଭ୍ୟାସ|കൂടുതൽ പരിശീലനം|ਹੋਰ ਅਭਿਆਸ"),
  empty: names("Nothing yet|अभी कुछ नहीं|এখনও কিছু নেই|अजून काही नाही|ఇంకా ఏమీ లేదు|இன்னும் எதுவும் இல்லை|હજી કંઈ નથી|ابھی کچھ نہیں|ಇನ್ನೂ ಏನೂ ಇಲ್ಲ|ଏବେ କିଛି ନାହିଁ|ഇതുവരെ ഒന്നുമില്ല|ਅਜੇ ਕੁਝ ਨਹੀਂ"),
  first: names("Right the first time|पहली बार में सही|প্রথমবারেই ঠিক|पहिल्याच वेळी बरोबर|మొదటిసారే సరైనవి|முதல் முறையே சரி|પહેલી વારમાં સાચું|پہلی بار میں صحیح|ಮೊದಲ ಸಲವೇ ಸರಿ|ପ୍ରଥମ ଥରରେ ଠିକ୍|ആദ്യ തവണ തന്നെ ശരി|ਪਹਿਲੀ ਵਾਰ ਵਿੱਚ ਸਹੀ"),
  words: names("Words|शब्द|শব্দ|शब्द|పదాలు|சொற்கள்|શબ્દો|الفاظ|ಪದಗಳು|ଶବ୍ଦ|വാക്കുകൾ|ਸ਼ਬਦ"),
  write: names("Write your question|अपना सवाल लिखो|তোমার প্রশ্ন লেখো|तुमचा प्रश्न लिहा|మీ ప్రశ్న రాయండి|உங்கள் கேள்வியை எழுதுங்கள்|તમારો સવાલ લખો|اپنا سوال لکھو|ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ|ତୁମ ପ୍ରଶ୍ନ ଲେଖ|നിങ്ങളുടെ ചോദ്യം എഴുതൂ|ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ"),
  send: names("Send|भेजो|পাঠাও|पाठवा|పంపండి|அனுப்பு|મોકલો|بھیجو|ಕಳುಹಿಸಿ|ପଠାଅ|അയയ്ക്കൂ|ਭੇਜੋ"),
  sent: names("The answer will come here|जवाब यहीं आएगा|উত্তর এখানেই আসবে|उत्तर इथेच येईल|జవాబు ఇక్కడే వస్తుంది|பதில் இங்கே வரும்|જવાબ અહીં આવશે|جواب یہیں آئے گا|ಉತ್ತರ ಇಲ್ಲೇ ಬರುತ್ತದೆ|ଉତ୍ତର ଏଠି ଆସିବ|ഉത്തരം ഇവിടെ വരും|ਜਵਾਬ ਇੱਥੇ ਹੀ ਆਵੇਗਾ"),
  voice: names("Voice|आवाज़|কণ্ঠ|आवाज|స్వరం|குரல்|અવાજ|آواز|ಧ್ವನಿ|ସ୍ୱର|ശബ്ദം|ਆਵਾਜ਼"),
  speed: names("Speed|रफ़्तार|গতি|वेग|వేగం|வேகம்|ઝડપ|رفتار|ವೇಗ|ଗତି|വേഗത|ਰਫ਼ਤਾਰ"),
  next: names("Next|आगे|এরপর|पुढे|తర్వాత|அடுத்து|આગળ|آگے|ಮುಂದೆ|ଆଗକୁ|അടുത്തത്|ਅੱਗੇ"),
  failed: names("Not sent. Try again|नहीं गया। फिर भेजो|যায়নি। আবার পাঠাও|गेले नाही. पुन्हा पाठवा|వెళ్లలేదు. మళ్లీ పంపండి|போகவில்லை. மீண்டும் அனுப்பு|ગયું નથી. ફરી મોકલો|نہیں گیا۔ پھر بھیجو|ಹೋಗಿಲ್ಲ. ಮತ್ತೆ ಕಳುಹಿಸಿ|ଗଲା ନାହିଁ। ପୁଣି ପଠାଅ|പോയില്ല. വീണ്ടും അയയ്ക്കൂ|ਨਹੀਂ ਗਿਆ। ਫਿਰ ਭੇਜੋ"),
};
export const say = (key, lang) => SAY[key][lang] ?? SAY[key].en;
