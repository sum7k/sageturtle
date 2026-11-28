// Horoscope, first version: the person picks one of the twelve signs and reads one line for today.
// The lines are a small hand-written set of gentle advice, not predictions. Each sign gets a different line each day.
// Sign names are in lib/strings.js (s0 to s11). Lines exist in English and Hindi; other languages show English for now.
export const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((glyph, i) => ({ id: String(i), key: `s${i}`, glyph: glyph + "︎" }));

export const LINES = {
  en: [
    "Finish one small thing you have been putting off.",
    "Talk to someone you have not spoken to for a long time.",
    "Spend a little less today than you planned.",
    "Listen more than you speak today.",
    "Learn one new thing and tell someone about it.",
    "Take a short walk and rest your eyes.",
    "Say thank you to someone who helps you every day.",
  ],
  hi: [
    "एक छोटा काम पूरा कीजिए जो आप टालते आ रहे हैं।",
    "किसी ऐसे व्यक्ति से बात कीजिए जिससे बहुत समय से बात नहीं हुई।",
    "आज जितना सोचा था उससे थोड़ा कम ख़र्च कीजिए।",
    "आज बोलिए कम, सुनिए ज़्यादा।",
    "एक नई बात सीखिए और किसी को बताइए।",
    "थोड़ी देर टहलिए और आँखों को आराम दीजिए।",
    "जो रोज़ आपकी मदद करता है उसे धन्यवाद कहिए।",
  ],
};

/** Days since 1 January 1970 in India's time, so the line changes at midnight in India. */
export const dayNumber = (now = Date.now()) => Math.floor((now + 19800000) / 86400000);

/** Today's line for a sign. */
export function lineFor(sign, lang, now = Date.now()) {
  const pool = LINES[lang] ?? LINES.en;
  return pool[(dayNumber(now) + Number(sign)) % pool.length];
}
