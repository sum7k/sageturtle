/** Which picture the landing page shows. Its few words follow the browser's language, because the person has not chosen one yet. */
export function browserKind(ua = "") {
  if (/FBAN|FBAV|Instagram|WhatsApp|Line\/|; wv\)/i.test(ua)) return "inapp";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iphone";
  return "chrome";
}
