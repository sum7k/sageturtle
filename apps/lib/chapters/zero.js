// Number, stage 6 (600 to 1200): "Zero as a number; the rules for negative numbers (Brahmagupta, 628)".
// One whole chapter, told in the voice of Brahmagupta (lib/narrators.js): short rules, then a trader's example,
// in his own words for the two kinds of number, fortune (धन) and debt (ऋण). Written by Claude as him, in the first
// person; nothing here is a quotation. The facts follow chapter 18 of his Brahmasphutasiddhanta (628): the rules
// for adding, subtracting and multiplying fortunes, debts and zero; that he wrote 0 ÷ 0 = 0; and that he left a
// number divided by zero as it stood. Later mathematicians showed that division by zero has no answer.
// Each lesson ends with a few sums to try (`ask`: the sum, the choices, which one is right). They are not marked.
const M = "−"; // the minus sign

export const ZERO = {
  id: "zero", subject: "number", stage: 6, picture: "०",
  by: { id: "brahmagupta", en: "Brahmagupta", hi: "ब्रह्मगुप्त", years: "598–668" }, who: "man",
  name: { en: "Zero, fortune and debt", hi: "शून्य, धन और ऋण" },
  lessons: [
    {
      id: "shunya", picture: "०", name: { en: "Zero is a number", hi: "शून्य भी एक संख्या है" },
      scenes: [
        { art: "teller", prop: "✨", say: { hi: "मैं ब्रह्मगुप्त हूँ, भिल्लमाल का। मैं आकाश के ग्रहों और तारों की चाल गिनता हूँ।", en: "I am Brahmagupta, of Bhillamala. I reckon the motions of the planets and the stars." } },
        { art: "z_sky", say: { hi: "तीस वर्ष की आयु में मैंने अपना ग्रंथ लिखा। उसमें गिनती की एक बात है, जो आज तुम्हें बताता हूँ।", en: "At thirty I wrote my book. In it there is a matter of counting that I will tell you today." } },
        { art: "z_place", say: { hi: "गिनने वाले खाली स्थान पर एक बिंदु रखते आए हैं। दो सौ पाँच लिखना हो, तो दहाई के खाली स्थान पर बिंदु। पर वह बस एक निशान था कि यहाँ कुछ नहीं है। वह संख्या नहीं था।", en: "Those who count have long put a dot in an empty place. To write two hundred and five, a dot goes where the tens are empty. But it was only a mark that nothing is here. It was not a number." } },
        { art: "z_take", say: { hi: "अब देखो। मेरे पास पाँच मुद्राएँ हैं। मैं पाँचों दे देता हूँ। क्या बचा? तुम कहोगे, कुछ नहीं। मैं कहता हूँ, इस कुछ नहीं को भी गिना जा सकता है। इसका नाम शून्य है।", en: "Now look. I have five coins. I give away all five. What is left? You will say, nothing. I say this nothing can be counted too. Its name is zero." } },
        { art: "z_same", say: { hi: "कोई भी संख्या लो और उसे उसी में से घटाओ। तीन में से तीन। सौ में से सौ। हर बार शून्य मिलता है। जो घटाने से मिलता है, वह संख्या है। इसलिए मैं शून्य के नियम लिखता हूँ, जैसे दूसरी संख्याओं के।", en: "Take any number and subtract it from itself. Three from three. A hundred from a hundred. Each time you get zero. What comes out of a subtraction is a number. So I write rules for zero, as for other numbers." } },
        { art: "z_add", say: { hi: "पहला नियम। किसी संख्या में शून्य जोड़ो, या उसमें से शून्य घटाओ, वह जैसी थी वैसी ही रहती है। सात में शून्य जोड़ा, सात। सात में से शून्य घटाया, सात।", en: "The first rule. Add zero to a number, or take zero from it, and it stays as it was. Seven and zero, seven. Seven less zero, seven." } },
        { art: "z_times", say: { hi: "दूसरा नियम। किसी भी संख्या को शून्य से गुणा करो, शून्य मिलता है। सात पात्र हों और हर पात्र खाली हो, तो कुल मुद्राएँ शून्य।", en: "The second rule. Multiply any number by zero and you get zero. Seven pots, each one empty: the coins in all are zero." } },
        { art: "z_line", say: { hi: "शून्य गिनती के आरंभ पर बैठा है। उसके एक ओर एक, दो, तीन हैं। पर उसके दूसरी ओर भी संख्याएँ हैं। वे अगले पाठ में।", en: "Zero sits where counting begins. On one side of it are one, two, three. But there are numbers on its other side too. They come in the next lesson." } },
      ],
      ask: [[`8 ${M} 8`, ["8", "0", "16"], 1], ["6 + 0", ["0", "60", "6"], 2], ["9 × 0", ["0", "9", "90"], 0], [`0 + 0 ${M} 0`, ["1", "0", "3"], 1]],
    },
    {
      id: "dhanrin", picture: "⚖️", name: { en: "Fortune and debt", hi: "धन और ऋण" },
      scenes: [
        { art: "teller", prop: "⚖️", say: { hi: "मैं ब्रह्मगुप्त हूँ। पिछली बार हम शून्य तक पहुँचे थे। आज शून्य के उस पार चलते हैं।", en: "I am Brahmagupta. Last time we reached zero. Today we go to the other side of zero." } },
        { art: "d_owe", say: { hi: "किसी व्यापारी से पूछो। उसके पास तीन मुद्राएँ हैं और उसे पाँच चुकानी हैं। तीनों दे दीं, फिर भी दो देनी बाक़ी हैं। यह बाक़ी भी एक संख्या है।", en: "Ask any trader. A trader holds three coins and must pay five. All three are given, and still two are owed. What is still owed is a number too." } },
        { art: "d_names", say: { hi: "जो पास है, उसे मैं धन कहता हूँ। जो देना है, उसे ऋण। ऋण शून्य से छोटी संख्या है। तुम्हारे समय में इन्हें धनात्मक और ऋणात्मक संख्या कहते हैं, और ऋण के आगे एक छोटी रेखा लगाते हैं।", en: "What is held, I call a fortune. What is owed, I call a debt. A debt is a number less than zero. In your time these are called positive and negative numbers, and a small stroke is written before a debt." } },
        { art: "d_line", say: { hi: "एक रेखा खींचो। बीच में शून्य रखो। दाईं ओर धन हैं: एक, दो, तीन। बाईं ओर ऋण हैं: ऋण एक, ऋण दो, ऋण तीन। जितना बाएँ जाओ, संख्या उतनी छोटी।", en: "Draw a line. Put zero in the middle. To the right are the fortunes: one, two, three. To the left are the debts: minus one, minus two, minus three. The further left, the smaller the number." } },
        { art: "d_mirror", say: { hi: "हर धन के सामने एक ऋण है, शून्य से उतनी ही दूर, पर दूसरी ओर। तीन के सामने ऋण तीन।", en: "Facing every fortune there is a debt, just as far from zero, on the other side. Facing three is minus three." } },
        { art: "d_cancel", say: { hi: "बराबर धन और बराबर ऋण मिलें, तो शून्य। तीन मुद्राएँ पास हैं और तीन देनी हैं। दे दो, हिसाब बराबर।", en: "A fortune and an equal debt together make zero. Three coins held and three owed. Pay them, and the account is level." } },
        { art: "d_well", say: { hi: "यह केवल मुद्राओं की बात नहीं है। भूमि को शून्य मानो। पेड़ की ऊँचाई धन है। कुएँ की गहराई ऋण है। जहाँ भी दो उलटी दिशाएँ हों, वहाँ धन और ऋण काम आते हैं।", en: "This is not only about coins. Take the ground as zero. The height of a tree is a fortune. The depth of a well is a debt. Wherever there are two opposite directions, fortune and debt are of use." } },
      ],
      ask: [[`2 ${M} 6`, [`${M}4`, "4", `${M}8`], 0], [`4 + (${M}4)`, ["8", `${M}8`, "0"], 2], [`${M}5 ◻ ${M}2`, ["<", ">", "="], 0], [`1 ${M} 4`, ["3", `${M}3`, `${M}5`], 1]],
    },
    {
      id: "jod", picture: "➕", name: { en: "The rules of adding", hi: "जोड़ के नियम" },
      scenes: [
        { art: "teller", prop: "➕", say: { hi: "मैं ब्रह्मगुप्त हूँ। धन और ऋण के नाम तुम जानते हो। आज उन्हें जोड़ने के नियम।", en: "I am Brahmagupta. You know the names fortune and debt. Today, the rules for adding them." } },
        { art: "a_pp", say: { hi: "धन और धन का जोड़, धन। दो और तीन, पाँच। रेखा पर दाईं ओर दो चलो, फिर तीन और।", en: "A fortune and a fortune make a fortune. Two and three, five. On the line, go two to the right, then three more." } },
        { art: "a_dd", say: { hi: "ऋण और ऋण का जोड़, ऋण। दो का ऋण और तीन का ऋण, पाँच का ऋण। रेखा पर बाईं ओर दो चलो, फिर तीन और।", en: "A debt and a debt make a debt. A debt of two and a debt of three, a debt of five. On the line, go two to the left, then three more." } },
        { art: "a_pd", say: { hi: "धन और ऋण मिलें, तो उनका अंतर लो, और जो बड़ा था उसी का नाम रखो। पाँच का धन और तीन का ऋण। तीन जोड़े कट गए। दो का धन बचा।", en: "When a fortune meets a debt, take their difference, and keep the name of the larger. A fortune of five and a debt of three. Three pairs cancel. A fortune of two is left." } },
        { art: "a_dp", say: { hi: "अब तीन का धन और सात का ऋण। तीन जोड़े कट गए। चार का ऋण बचा, क्योंकि ऋण बड़ा था।", en: "Now a fortune of three and a debt of seven. Three pairs cancel. A debt of four is left, because the debt was the larger." } },
        { art: "a_walk", say: { hi: "रेखा पर यह बस चलना है। धन जोड़ो, तो दाईं ओर चलो। ऋण जोड़ो, तो बाईं ओर। ऋण चार पर खड़े हो और छह जोड़ते हो: छह क़दम दाएँ, और तुम दो पर हो।", en: "On the line this is only walking. Add a fortune, walk right. Add a debt, walk left. You stand on minus four and add six: six steps right, and you are on two." } },
        { art: "a_zero", say: { hi: "और शून्य? धन में शून्य जोड़ो, वही धन। ऋण में शून्य जोड़ो, वही ऋण। शून्य में शून्य जोड़ो, शून्य।", en: "And zero? Add zero to a fortune, the same fortune. Add zero to a debt, the same debt. Add zero to zero, zero." } },
      ],
      ask: [[`(${M}3) + (${M}4)`, ["7", `${M}7`, `${M}1`], 1], [`6 + (${M}2)`, ["4", "8", `${M}4`], 0], [`2 + (${M}9)`, ["7", `${M}11`, `${M}7`], 2], [`(${M}5) + 5`, ["10", "0", `${M}10`], 1]],
    },
    {
      id: "ghata", picture: "➖", name: { en: "The rules of subtracting", hi: "घटाने के नियम" },
      scenes: [
        { art: "teller", prop: "➖", say: { hi: "मैं ब्रह्मगुप्त हूँ। जोड़ना हो गया। आज घटाना, जहाँ हिसाब करने वाले सबसे अधिक उलझते हैं।", en: "I am Brahmagupta. Adding is done. Today subtracting, where those who reckon get tangled the most." } },
        { art: "s_less", say: { hi: "छोटी संख्या में से बड़ी घटाओ। तीन में से पाँच। रेखा पर तीन से पाँच क़दम बाएँ चलो। तुम शून्य को पार कर ऋण दो पर पहुँचे।", en: "Take a larger number from a smaller. Five from three. On the line, walk five steps left from three. You cross zero and reach minus two." } },
        { art: "s_zero", say: { hi: "शून्य में से धन घटाओ, तो ऋण मिलता है। शून्य में से ऋण घटाओ, तो धन मिलता है। दूसरी बात पर ठहरो। उसे अभी दिखाता हूँ।", en: "Take a fortune from zero and you get a debt. Take a debt from zero and you get a fortune. Stay with the second one. I will show it now." } },
        { art: "s_debt", say: { hi: "तुम्हें चार मुद्राएँ देनी थीं। तुम ऋण चार पर थे। किसी ने वह ऋण हटा दिया। अब तुम शून्य पर हो, पहले से चार ऊपर। ऋण का हटना वही है जो धन का जुड़ना।", en: "You owed four coins. You stood on minus four. Someone took that debt away. Now you are on zero, four higher than before. To take away a debt is the same as to add a fortune." } },
        { art: "s_rule", say: { hi: "इसलिए घटाने का एक ही नियम है। जिसे घटाना है, उसका नाम पलट दो, और जोड़ दो। पाँच में से ऋण तीन घटाना है। ऋण तीन पलट कर धन तीन हुआ। पाँच और तीन, आठ।", en: "So there is one rule for subtracting. Turn the name of what is to be taken away, and add. Take minus three from five. Minus three turns into three. Five and three, eight." } },
        { art: "s_ex", say: { hi: "ऋण दो में से ऋण छह घटाओ। ऋण छह पलट कर धन छह हुआ। ऋण दो और धन छह। उत्तर चार।", en: "Take minus six from minus two. Minus six turns into six. Minus two and six. The answer is four." } },
        { art: "s_ex2", say: { hi: "ऋण तीन में से धन चार घटाओ। धन चार पलट कर ऋण चार हुआ। ऋण तीन और ऋण चार। उत्तर ऋण सात।", en: "Take four from minus three. Four turns into minus four. Minus three and minus four. The answer is minus seven." } },
      ],
      ask: [[`4 ${M} 9`, ["5", `${M}5`, `${M}13`], 1], [`7 ${M} (${M}2)`, ["9", "5", `${M}9`], 0], [`(${M}3) ${M} (${M}8)`, [`${M}11`, `${M}5`, "5"], 2], [`0 ${M} (${M}6)`, [`${M}6`, "6", "0"], 1]],
    },
    {
      id: "guna", picture: "✖️", name: { en: "The rules of multiplying", hi: "गुणा के नियम" },
      scenes: [
        { art: "teller", prop: "✖️", say: { hi: "मैं ब्रह्मगुप्त हूँ। आज गुणा। इसमें एक नियम ऐसा है जिसे लोग बिना समझे मान लेते हैं। हम उसे समझ कर मानेंगे।", en: "I am Brahmagupta. Today, multiplying. One rule in it is often taken without being understood. We will understand it first." } },
        { art: "m_pp", say: { hi: "गुणा बार बार जोड़ना है। तीन बार दो मुद्राएँ, छह मुद्राएँ। धन गुणा धन, धन।", en: "To multiply is to add again and again. Three times two coins, six coins. A fortune times a fortune is a fortune." } },
        { art: "m_pd", say: { hi: "तीन बार दो का ऋण, छह का ऋण। धन गुणा ऋण, ऋण।", en: "Three times a debt of two, a debt of six. A fortune times a debt is a debt." } },
        { art: "m_fall", say: { hi: "अब ऋण गुणा ऋण। इसे मान मत लो, क्रम से देखो। ऋण दो को तीन से, दो से, एक से और शून्य से गुणा करो। ऋण छह, ऋण चार, ऋण दो, शून्य। हर पंक्ति में उत्तर दो बढ़ता है।", en: "Now a debt times a debt. Do not take it on trust; watch the order. Multiply minus two by three, by two, by one and by zero. Minus six, minus four, minus two, zero. On each line the answer rises by two." } },
        { art: "m_rise", say: { hi: "क्रम को रुकने का कोई कारण नहीं। शून्य के बाद ऋण एक से गुणा करो: दो। ऋण दो से: चार। ऋण तीन से: छह। ऋण गुणा ऋण, धन।", en: "The order has no reason to stop. After zero, multiply by minus one: two. By minus two: four. By minus three: six. A debt times a debt is a fortune." } },
        { art: "m_why", say: { hi: "इसे ऐसे भी देखो। दो का ऋण तीन बार हटाया गया। ऋण का हटना धन का जुड़ना है। तो छह का धन आया।", en: "See it this way too. A debt of two is taken away three times. To take away a debt is to add a fortune. So a fortune of six comes." } },
        { art: "m_signs", say: { hi: "चारों नियम एक साथ। दोनों के नाम एक जैसे हों, तो उत्तर धन। नाम अलग हों, तो उत्तर ऋण। और शून्य से गुणा, हमेशा शून्य।", en: "The four rules together. When the two names are alike, the answer is a fortune. When they differ, the answer is a debt. And times zero, always zero." } },
        { art: "m_sq", say: { hi: "इसका एक फल देखो। तीन गुणा तीन, नौ। ऋण तीन गुणा ऋण तीन भी नौ। इसलिए नौ जिसका वर्ग है, ऐसी दो संख्याएँ हैं: तीन और ऋण तीन।", en: "See one fruit of this. Three times three, nine. Minus three times minus three, nine as well. So there are two numbers whose square is nine: three and minus three." } },
      ],
      ask: [[`4 × (${M}3)`, ["12", `${M}12`, `${M}7`], 1], [`(${M}5) × (${M}2)`, ["10", `${M}10`, `${M}7`], 0], [`(${M}6) × 0`, [`${M}6`, "6", "0"], 2], [`(${M}4) × (${M}4)`, [`${M}16`, "16", `${M}8`], 1]],
    },
    {
      id: "bhag", picture: "➗", name: { en: "Dividing, and where I stopped", hi: "भाग, और जहाँ मैं रुका" },
      scenes: [
        { art: "teller", prop: "➗", say: { hi: "मैं ब्रह्मगुप्त हूँ। आज भाग, और वह स्थान जहाँ मेरा अपना नियम ठीक नहीं बैठा।", en: "I am Brahmagupta. Today, dividing, and the place where my own rule did not hold." } },
        { art: "v_share", say: { hi: "भाग गुणा का उलटा है। छह को दो से भाग दो, तो पूछो: कौन सी संख्या दो से गुणा होकर छह देती है? तीन।", en: "To divide is to multiply backwards. Divide six by two and ask: which number, times two, gives six? Three." } },
        { art: "v_signs", say: { hi: "इसलिए भाग में नाम वैसे ही चलते हैं जैसे गुणा में। नाम एक जैसे, तो उत्तर धन। नाम अलग, तो उत्तर ऋण।", en: "So in dividing the names go as they do in multiplying. Names alike, the answer is a fortune. Names different, the answer is a debt." } },
        { art: "v_zeroby", say: { hi: "शून्य को किसी संख्या से भाग दो, शून्य। बाँटने को कुछ है ही नहीं, तो पाँचों के हिस्से में शून्य।", en: "Divide zero by a number and you get zero. There is nothing to share, so each of the five gets zero." } },
        { art: "v_byzero", say: { hi: "अब कठिन प्रश्न। किसी संख्या को शून्य से भाग दें, तो? छह भाग शून्य का अर्थ है वह संख्या जो शून्य से गुणा होकर छह दे। पर शून्य से गुणा तो हमेशा शून्य देता है। ऐसी कोई संख्या नहीं मिलती।", en: "Now the hard question. What if a number is divided by zero? Six divided by zero means the number that, times zero, gives six. But times zero always gives zero. No such number is found." } },
        { art: "v_honest", say: { hi: "मैंने अपने ग्रंथ में शून्य भाग शून्य को शून्य लिखा था, और किसी संख्या भाग शून्य को वैसा ही छोड़ दिया था। मेरे बाद आने वालों ने इसे परखा और पाया कि यह ठीक नहीं बैठता। आज माना जाता है कि शून्य से भाग का कोई उत्तर नहीं है।", en: "In my book I wrote zero divided by zero as zero, and I left a number divided by zero as it stood. Those who came after me tested this and found it does not hold. Today it is held that division by zero has no answer." } },
        { art: "v_grow", say: { hi: "इसमें कोई लज्जा नहीं। एक नियम लिखता है, दूसरा उसे परखता है, तीसरा उसे सुधारता है। ज्ञान ऐसे ही बढ़ता है। हर नियम को परख कर ही मानना। मेरे नियम को भी।", en: "There is no shame in this. One writes a rule, another tests it, a third mends it. That is how knowledge grows. Accept a rule only after testing it. Mine as well." } },
      ],
      ask: [[`(${M}8) ÷ 2`, ["4", `${M}4`, `${M}6`], 1], [`(${M}9) ÷ (${M}3)`, ["3", `${M}3`, `${M}6`], 0], ["0 ÷ 7", ["7", "0", "1"], 1], [`12 ÷ (${M}4)`, ["3", "8", `${M}3`], 2]],
    },
  ],
};
