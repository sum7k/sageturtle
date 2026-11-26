/** Which picture the landing page shows. The page has no words, because the language is not known yet. */
export function browserKind(ua = "") {
  if (/FBAN|FBAV|Instagram|WhatsApp|Line\/|; wv\)/i.test(ua)) return "inapp";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iphone";
  return "chrome";
}

/** How wide the gold mic is, so that the Home grid of three always ends in a full row. */
export const micSpan = (tiles) => 3 - (tiles % 3);
