"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { Turtle } from "@/components/Art";
import { browserKind, installedHere, onInstalled, openAppUrl } from "@/lib/browser";
import { guessLang } from "@/lib/langs";
import { t } from "@/lib/strings";
import { count, visit } from "@/lib/track";

/**
 * The landing page, seen only in a browser tab. Its job is to get the app installed, and then to send the person
 * into the installed app. A page is not allowed to start an installed app by itself, so once the app is installed
 * the page turns into one big "Open the app" button. The same button shows on any later visit in the browser.
 * App pages opened in a browser tab are sent here (components/Offline.jsx), so there is no way on inside the browser.
 * Chrome does not always offer its install prompt (for some time after the app was removed or the prompt was closed).
 * Then the page shows the way by hand, in pictures: the browser's menu, then "Install app".
 */
export default function Landing() {
  const router = useRouter();
  const prompt = useRef(null);
  const [kind, setKind] = useState(null);
  const [lang, setLang] = useState("en");
  const [stage, setStage] = useState("install"); // install, installing, open
  const [byHand, setByHand] = useState(false); // Chrome gave no prompt: show the menu steps

  useEffect(() => {
    // Inside the installed app this page is never shown. On a computer, Chrome moves this very tab into the app's
    // window when the app is installed or opened from the address bar, so the page also watches for that.
    if (installedHere()) return router.replace("/app");
    const leave = onInstalled(() => router.replace("/app"));
    visit();
    setLang(guessLang(navigator.language));
    setKind(browserKind(navigator.userAgent));
    const ask = (e) => { e.preventDefault(); prompt.current = e; setByHand(false); };
    const wait = setTimeout(() => { if (!prompt.current) setByHand(true); }, 3000);
    const done = () => { count("install"); if (installedHere()) router.replace("/app"); else setStage("open"); };
    addEventListener("beforeinstallprompt", ask);
    addEventListener("appinstalled", done);
    // A phone that already has the app: say so at once (Chrome on Android can tell).
    navigator.getInstalledRelatedApps?.().then((apps) => { if (apps.length) setStage("open"); }).catch(() => {});
    return () => { leave(); clearTimeout(wait); removeEventListener("beforeinstallprompt", ask); removeEventListener("appinstalled", done); };
  }, [router]);

  const install = async () => {
    // No prompt from the browser: show the way through its menu.
    if (!prompt.current) return setByHand(true);
    prompt.current.prompt();
    const choice = await prompt.current.userChoice.catch(() => null);
    prompt.current = null;
    if (choice?.outcome === "accepted") setStage((s) => (s === "open" ? s : "installing")); // `appinstalled` follows
  };

  if (!kind) return <main className="screen" />;
  return (
    <main className="screen landing center">
      <Turtle />
      <h1 className="brand">BodhiLabs</h1>
      {stage === "open" && (
        <>
          <a className="round gold huge" href={openAppUrl(navigator.userAgent, location.origin)} aria-label={t(lang, "open")}><Icon d={P.open} size={64} /></a>
          <p className="sub strong">{t(lang, "open")}</p>
        </>
      )}
      {stage === "installing" && <span className="round gold huge pulse" role="status" aria-label={t(lang, "install")}><Icon d={P.down} size={64} /></span>}
      {stage === "install" && kind === "chrome" && byHand && (
        <>
          <div className="steps" role="img" aria-label={t(lang, "install")}>
            <span className="round gold big"><Icon d={P.dots} size={44} sw={3.5} style={{ transform: "rotate(90deg)" }} /></span>
            <Icon d={P.next} size={32} sw={2.5} />
            <span className="round gold big"><Icon d={P.addphone} size={44} /></span>
          </div>
          <p className="sub strong">{t(lang, "install")}</p>
          <span className="hint top"><Icon d={P.down} size={56} sw={2.5} style={{ transform: "rotate(180deg)" }} /></span>
        </>
      )}
      {stage === "install" && kind === "chrome" && !byHand && (
        <>
          <button type="button" className="round gold huge" aria-label={t(lang, "install")} onClick={install}><Icon d={P.down} size={64} /></button>
          <p className="sub strong">{t(lang, "install")}</p>
        </>
      )}
      {stage === "install" && kind === "iphone" && (
        <>
          <div className="steps" role="img" aria-label={t(lang, "ios")}>
            <span className="round gold big"><Icon d={P.share} size={44} /></span>
            <Icon d={P.next} size={32} sw={2.5} />
            <span className="round gold big"><Icon d={P.addbox} size={44} /></span>
          </div>
          <p className="sub">{t(lang, "ios")}</p>
          <span className="hint bottom"><Icon d={P.down} size={56} sw={2.5} /></span>
        </>
      )}
      {stage === "install" && kind === "inapp" && (
        <>
          <span className="round gold huge"><Icon d={P.dots} size={64} sw={3} /></span>
          <p className="sub">{t(lang, "inapp")}</p>
          <span className="hint top"><Icon d={P.down} size={56} sw={2.5} style={{ transform: "rotate(180deg)" }} /></span>
        </>
      )}
    </main>
  );
}
