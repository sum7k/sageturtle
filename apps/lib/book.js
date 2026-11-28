// Book, first version: learn to read a word by seeing its picture and hearing it.
// A round shows one picture. A button says the word. The person picks the written word that matches, out of three.
// Tapping a wrong word says that word too, so every tap teaches one word. Pictures are emoji: they cost nothing.
const KEYS = "bird|cow|fish|tree|sun|house|water|dog|cat|mango|moon|flower".split("|");
export const PICTURE = { bird: "🐦", cow: "🐄", fish: "🐟", tree: "🌳", sun: "☀️", house: "🏠", water: "💧", dog: "🐕", cat: "🐈", mango: "🥭", moon: "🌙", flower: "🌸" };

const W = {
  en: "bird|cow|fish|tree|sun|house|water|dog|cat|mango|moon|flower",
  hi: "चिड़िया|गाय|मछली|पेड़|सूरज|घर|पानी|कुत्ता|बिल्ली|आम|चाँद|फूल",
  bn: "পাখি|গরু|মাছ|গাছ|সূর্য|বাড়ি|জল|কুকুর|বিড়াল|আম|চাঁদ|ফুল",
  mr: "पक्षी|गाय|मासा|झाड|सूर्य|घर|पाणी|कुत्रा|मांजर|आंबा|चंद्र|फूल",
  te: "పక్షి|ఆవు|చేప|చెట్టు|సూర్యుడు|ఇల్లు|నీరు|కుక్క|పిల్లి|మామిడి|చంద్రుడు|పువ్వు",
  ta: "பறவை|பசு|மீன்|மரம்|சூரியன்|வீடு|தண்ணீர்|நாய்|பூனை|மாம்பழம்|நிலா|பூ",
  gu: "પક્ષી|ગાય|માછલી|ઝાડ|સૂરજ|ઘર|પાણી|કૂતરો|બિલાડી|કેરી|ચાંદ|ફૂલ",
  ur: "چڑیا|گائے|مچھلی|پیڑ|سورج|گھر|پانی|کتا|بلی|آم|چاند|پھول",
  kn: "ಹಕ್ಕಿ|ಹಸು|ಮೀನು|ಮರ|ಸೂರ್ಯ|ಮನೆ|ನೀರು|ನಾಯಿ|ಬೆಕ್ಕು|ಮಾವು|ಚಂದ್ರ|ಹೂವು",
  or: "ଚଢ଼େଇ|ଗାଈ|ମାଛ|ଗଛ|ସୂର୍ଯ୍ୟ|ଘର|ପାଣି|କୁକୁର|ବିଲେଇ|ଆମ୍ବ|ଜହ୍ନ|ଫୁଲ",
  ml: "പക്ഷി|പശു|മീൻ|മരം|സൂര്യൻ|വീട്|വെള്ളം|നായ|പൂച്ച|മാങ്ങ|ചന്ദ്രൻ|പൂവ്",
};
export const WORDS = Object.fromEntries(Object.entries(W).map(([lang, line]) => [lang, Object.fromEntries(line.split("|").map((w, i) => [KEYS[i], w]))]));
export const WORD_KEYS = KEYS;
export const wordFor = (lang, key) => (WORDS[lang] ?? WORDS.en)[key];

/**
 * Round number `n` (0, 1, 2 ...): the word to find and three choices in a mixed order.
 * The same `n` always gives the same round, so a round can be tested and comes back the same after a reload.
 */
export function round(n) {
  const at = ((n % KEYS.length) + KEYS.length) % KEYS.length;
  const lap = Math.floor(n / KEYS.length);
  const answer = KEYS[at];
  const others = [KEYS[(at + 3 + lap) % KEYS.length], KEYS[(at + 7 + lap * 2) % KEYS.length]].map((k, i) => (k === answer ? KEYS[(at + 1 + i) % KEYS.length] : k));
  if (others[0] === others[1]) others[1] = KEYS[(at + 5) % KEYS.length];
  const choices = [answer, ...others];
  const turn = (n * 2 + lap) % 3; // where the right word sits
  return { answer, choices: [...choices.slice(3 - turn), ...choices.slice(0, 3 - turn)] };
}

// The letters of each language, for the second page of Book. Vowels first, then consonants.
const DEVA = "अ आ इ ई उ ऊ ऋ ए ऐ ओ औ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह";
export const LETTERS = {
  en: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
  hi: DEVA,
  mr: DEVA + " ळ",
  bn: "অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ",
  te: "అ ఆ ఇ ఈ ఉ ఊ ఋ ఎ ఏ ఐ ఒ ఓ ఔ క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ ట ఠ డ ఢ ణ త థ ద ధ న ప ఫ బ భ మ య ర ల వ శ ష స హ ళ",
  ta: "அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன",
  gu: "અ આ ઇ ઈ ઉ ઊ ઋ એ ઐ ઓ ઔ ક ખ ગ ઘ ચ છ જ ઝ ટ ઠ ડ ઢ ણ ત થ દ ધ ન પ ફ બ ભ મ ય ર લ વ શ ષ સ હ ળ",
  ur: "ا ب پ ت ٹ ث ج چ ح خ د ڈ ذ ر ڑ ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ہ ھ ء ی ے",
  kn: "ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ",
  or: "ଅ ଆ ଇ ଈ ଉ ଊ ଋ ଏ ଐ ଓ ଔ କ ଖ ଗ ଘ ଙ ଚ ଛ ଜ ଝ ଞ ଟ ଠ ଡ ଢ ଣ ତ ଥ ଦ ଧ ନ ପ ଫ ବ ଭ ମ ଯ ର ଲ ଳ ଶ ଷ ସ ହ",
  ml: "അ ആ ഇ ഈ ഉ ഊ ഋ എ ഏ ഐ ഒ ഓ ഔ ക ഖ ഗ ഘ ങ ച ഛ ജ ഝ ഞ ട ഠ ഡ ഢ ണ ത ഥ ദ ധ ന പ ഫ ബ ഭ മ യ ര ല വ ശ ഷ സ ഹ ള ഴ റ",
};
export const lettersFor = (lang) => (LETTERS[lang] ?? LETTERS.en).split(" ");
