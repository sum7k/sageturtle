// Inside Word (शब्द): its own twelve houses, from hearing names to being a writer (gyan/docs/shabd.md).
// Houses 1 to 11 are the Word part of the eleven stages of the Gyan path; house 12 is the writer.
// House n is what Word holds at stage n of Gyan (lib/stages.js). Only house 3, Letters, is built: the game of
// seeing a picture and picking the written word, and the letters. So Word opens at stage 3 only.
import { names } from "./subjects.js";

export const WORD_HOUSES = [
  { id: "names", picture: "🖼️", name: names("Names|नाम|নাম|नावे|పేర్లు|பெயர்கள்|નામ|نام|ಹೆಸರುಗಳು|ନାମ|പേരുകൾ|ਨਾਮ") },
  { id: "sounds", picture: "👂", name: names("Sounds|ध्वनि|ধ্বনি|ध्वनी|ధ్వనులు|ஒலிகள்|ધ્વનિ|آوازیں|ಧ್ವನಿಗಳು|ଧ୍ୱନି|ശബ്ദങ്ങൾ|ਧੁਨੀਆਂ") },
  { id: "letters", picture: "✏️", open: "/book", name: names("Letters|अक्षर|অক্ষর|अक्षरे|అక్షరాలు|எழுத்துகள்|અક્ષર|حروف|ಅಕ್ಷರಗಳು|ଅକ୍ଷର|അക്ഷരങ്ങൾ|ਅੱਖਰ") },
  { id: "sentences", picture: "💬", name: names("Sentences|वाक्य|বাক্য|वाक्ये|వాక్యాలు|வாக்கியங்கள்|વાક્ય|جملے|ವಾಕ್ಯಗಳು|ବାକ୍ୟ|വാക്യങ്ങൾ|ਵਾਕ") },
  { id: "stories", picture: "📚", name: names("Stories|कहानी|গল্প|गोष्टी|కథలు|கதைகள்|વાર્તા|کہانی|ಕಥೆಗಳು|ଗପ|കഥകൾ|ਕਹਾਣੀਆਂ") },
  { id: "facts", picture: "📰", name: names("Facts|जानकारी|তথ্য|माहिती|సమాచారం|தகவல்|માહિતી|معلومات|ಮಾಹಿತಿ|ତଥ୍ୟ|വിവരങ്ങൾ|ਜਾਣਕਾਰੀ") },
  { id: "essay", picture: "✉️", name: names("Essay|निबंध|রচনা|निबंध|వ్యాసం|கட்டுரை|નિબંધ|مضمون|ಪ್ರಬಂಧ|ରଚନା|ഉപന്യാസം|ਲੇਖ") },
  { id: "building", picture: "🧩", name: names("Word-building|रचना|শব্দ গঠন|शब्दरचना|పద నిర్మాణం|சொல்லாக்கம்|શબ્દરચના|لفظ سازی|ಪದ ರಚನೆ|ଶବ୍ଦ ଗଠନ|പദനിർമ്മാണം|ਸ਼ਬਦ ਰਚਨਾ") },
  { id: "style", picture: "🌸", name: names("Style|अलंकार|অলংকার|अलंकार|అలంకారం|அணி|અલંકાર|صنائع|ಅಲಂಕಾರ|ଅଳଙ୍କାର|അലങ്കാരം|ਅਲੰਕਾਰ") },
  { id: "reading", picture: "🔍", name: names("Close reading|पाठ|পাঠ|पाठ|పఠనం|வாசிப்பு|પાઠ|مطالعہ|ಓದು|ପାଠ|വായന|ਪਾਠ") },
  { id: "ideas", picture: "💡", name: names("Ideas|विचार|ভাবনা|विचार|ఆలోచనలు|சிந்தனை|વિચાર|خیالات|ವಿಚಾರ|ବିଚାର|ആശയങ്ങൾ|ਵਿਚਾਰ") },
  { id: "writer", picture: "🖋️", name: names("Writer|लेखक|লেখক|लेखक|రచయిత|எழுத்தாளர்|લેખક|مصنف|ಲೇಖಕ|ଲେଖକ|എഴുത്തുകാരൻ|ਲੇਖਕ") },
];
