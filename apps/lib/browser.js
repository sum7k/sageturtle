/** Which picture the landing page shows. Its few words follow the browser's language, because the person has not chosen one yet. */
export function browserKind(ua = "") {
  if (/FBAN|FBAV|Instagram|WhatsApp|Line\/|; wv\)/i.test(ua)) return "inapp";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iphone";
  return "chrome";
}

/**
 * The link behind "Open the app" in a browser tab. A plain link to our own address stays in the browser, so on
 * Android the link is an intent: Android then offers the installed app for our address. If nothing takes it,
 * the browser opens the fallback, which is the app's start page in the tab.
 */
export function openAppUrl(ua = "", origin = "") {
  const host = origin.replace(/^https?:\/\//, "");
  if (!/Android/i.test(ua) || !origin.startsWith("https://")) return "/app";
  return `intent://${host}/app#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${encodeURIComponent(origin + "/app")};end`;
}
