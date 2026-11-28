"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { Turtle } from "@/components/Art";
import { browserKind, openAppUrl } from "@/lib/browser";
import { guessLang } from "@/lib/langs";
import { t } from "@/lib/strings";

/**
 * The landing page, seen only in a browser tab. Its job is to get the app installed, and then to send the person
 * into the installed app. A page is not allowed to start an installed app by itself, so once the app is installed
 * the page turns into one big "Open the app" button. The same button shows on any later visit in the browser.
 */
export default function Landing() {
  const router = useRouter();
  const prompt = useRef(null);
  const [kind, setKind] = useState(null);
  const [lang, setLang] = useState("en");
  const [stage, setStage] = useState("install"); // install, installing, open
  const [canAsk, setCanAsk] = useState(false);

  useEffect(() => {
    // Inside the installed app this page is never shown.
    if (matchMedia("(display-mode: standalone)").matches || navigator.standalone === true) return router.replace("/app");
    setLang(guessLang(navigator.language));
    setKind(browserKind(navigator.userAgent));
    const ask = (e) => { e.preventDefault(); prompt.current = e; setCanAsk(true); };
    const done = () => setStage("open");
    addEventListener("beforeinstallprompt", ask);
    addEventListener("appinstalled", done);
    // A phone that already has the app: say so at once (Chrome on Android can tell).
    navigator.getInstalledRelatedApps?.().then((apps) => { if (apps.length) setStage("open"); }).catch(() => {});
    return () => { removeEventListener("beforeinstallprompt", ask); removeEventListener("appinstalled", done); };
  }, [router]);

  const install = async () => {
    // Where the browser cannot install, the person simply goes on inside the browser.
    if (!prompt.current) return router.push("/app");
    prompt.current.prompt();
    const choice = await prompt.current.userChoice.catch(() => null);
    prompt.current = null;
    setCanAsk(false);
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
      {stage === "install" && kind === "chrome" && (
        <>
          <button type="button" className="round gold huge" aria-label={t(lang, "install")} onClick={install}><Icon d={P.down} size={64} /></button>
          <p className="sub strong">{t(lang, "install")}</p>
        </>
      )}
      {stage === "install" && kind === "iphone" && (
        <>
          <span className="round gold huge"><Icon d={P.share} size={64} /></span>
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
      {/* The small way on: use it here in the browser. Not offered while Chrome can still install. */}
      {(stage === "open" || (stage === "install" && kind !== "chrome") || (stage === "install" && !canAsk)) && kind !== "inapp" && (
        <button type="button" className="round white" aria-label="Continue in the browser" onClick={() => router.push("/app")}><Icon d={P.next} sw={2.5} /></button>
      )}
    </main>
  );
}
