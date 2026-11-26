"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { Turtle } from "@/components/Art";
import { load, nextStep } from "@/lib/store";
import { browserKind } from "@/lib/browser";

export default function Landing() {
  const router = useRouter();
  const prompt = useRef(null);
  const [kind, setKind] = useState(null);

  useEffect(() => {
    const installed = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    const me = load();
    // An installed app, or a phone that has already begun, never sees the landing page again.
    if (installed || me.lang) return router.replace(nextStep(me) ? "/start" : "/home");
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
      {kind === "chrome" && (
        <button type="button" className="round gold huge" aria-label="Install" onClick={install}><Icon d={P.down} size={64} /></button>
      )}
      {kind === "iphone" && (
        <>
          <span className="round gold huge"><Icon d={P.share} size={64} label="Tap Share, then Add to Home Screen" /></span>
          <span className="hint bottom"><Icon d={P.down} size={56} sw={2.5} /></span>
        </>
      )}
      {kind === "inapp" && (
        <>
          <span className="round gold huge"><Icon d={P.dots} size={64} sw={3} label="Open the menu, then open in your browser" /></span>
          <span className="hint top"><Icon d={P.down} size={56} sw={2.5} style={{ transform: "rotate(180deg)" }} /></span>
        </>
      )}
    </main>
  );
}
