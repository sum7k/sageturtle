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

/**
 * The app is used only as the installed app. Any app page opened in a browser tab goes to the install page ("/").
 * The installed app is never sent away. A developer's own computer (localhost) is left alone, so the pages can be tried.
 */
export function mustInstall({ path = "/", standalone = false, host = "" }) {
  if (standalone || path === "/" || path.startsWith("/admin")) return false;
  return !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host);
}

/** The ways a browser shows an installed app's own window. A plain tab is "browser". */
export const APP_MODES = ["standalone", "minimal-ui", "window-controls-overlay", "tabbed"];
const MARK = "bodhilabs.installed.v1"; // set for this window once it was seen running as the installed app

/**
 * Is this window the installed app? `media` answers a media query, `standalone` is iPhone's own flag, `referrer`
 * tells an Android app launch, and `marked` is true when this window was opened at the app's start page.
 */
export function isInstalled({ media = () => false, standalone = false, referrer = "", marked = false } = {}) {
  return standalone === true || marked || referrer.startsWith("android-app://") || APP_MODES.some((m) => media(`(display-mode: ${m})`));
}

/** The same, asked of the real window. Once true it stays true for the window, so a later page never asks to install. */
export function installedHere() {
  let marked = false;
  try { marked = sessionStorage.getItem(MARK) === "1"; } catch {}
  const yes = isInstalled({ media: (q) => matchMedia(q).matches, standalone: navigator.standalone, referrer: document.referrer, marked });
  if (yes && !marked) markInstalled();
  return yes;
}
export function markInstalled() { try { sessionStorage.setItem(MARK, "1"); } catch {} }

/** Call `then` when this window turns into the installed app (desktop Chrome moves the tab into an app window on install). */
export function onInstalled(then) {
  const lists = APP_MODES.map((m) => matchMedia(`(display-mode: ${m})`));
  const look = () => { if (installedHere()) then(); };
  for (const l of lists) l.addEventListener?.("change", look);
  return () => { for (const l of lists) l.removeEventListener?.("change", look); };
}
