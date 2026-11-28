"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { Turtle } from "@/components/Art";
import { load, nextStep } from "@/lib/store";
import { browserKind } from "@/lib/browser";
import { guessLang } from "@/lib/langs";
import { t } from "@/lib/strings";

export default function Landing() {
  const router = useRouter();
  const prompt = useRef(null);
  const [kind, setKind] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const installed = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    const me = load();
    // An installed app, or a phone that has already begun, never sees the landing page again.
    if (installed || me.lang) return router.replace(nextStep(me) ? "/start" : "/home");
    setLang(guessLang(navigator.language));
    setKind(browserKind(navigator.userAgent));
    const on = (e) => { e.preventDefault(); prompt.current = e; };
    addEventListener("beforeinstallprompt", on);
    return () => removeEventListener("beforeinstallprompt", on);
  }, [router]);

  const install = async () => {
    if (prompt.current) {
      prompt.current.prompt();
      await prompt.current.userChoice.catch(() => {});
      prompt.current = null;
    }
    // Where the browser cannot install, the person simply goes on inside the browser.
    router.push("/start");
  };

  if (!kind) return <main className="screen" />;
  return (
    <main className="screen landing center">
      <Turtle />
      <h1 className="brand">BodhiLabs</h1>
      {kind === "chrome" && (
        <>
        <button type="button" className="round gold huge" aria-label={t(lang, "install")} onClick={install}><Icon d={P.down} size={64} /></button>
        <p className="sub">{t(lang, "install")}</p>
        </>
      )}
      {kind === "iphone" && (
        <>
          <span className="round gold huge"><Icon d={P.share} size={64} /></span>
          <p className="sub">{t(lang, "ios")}</p>
          <span className="hint bottom"><Icon d={P.down} size={56} sw={2.5} /></span>
        </>
      )}
      {kind === "inapp" && (
        <>
          <span className="round gold huge"><Icon d={P.dots} size={64} sw={3} /></span>
          <p className="sub">{t(lang, "inapp")}</p>
          <span className="hint top"><Icon d={P.down} size={56} sw={2.5} style={{ transform: "rotate(180deg)" }} /></span>
        </>
      )}
    </main>
  );
}
