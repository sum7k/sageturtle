"use client";

import Link from "next/link";
import Icon, { P } from "./Icon";
import { sayLine } from "@/lib/speak";

/** The top of an inner screen: a way back on the left and a button that speaks the screen on the right. No words. */
export default function Bar({ back, onBack, speakKey, lang, right }) {
  return (
    <header className="bar">
      {back ? <Link href={back} className="round white" aria-label="Back"><Icon d={P.back} sw={2.5} /></Link>
        : onBack ? <button type="button" className="round white" aria-label="Back" onClick={onBack}><Icon d={P.back} sw={2.5} /></button>
        : <span />}
      {right ?? (speakKey && <button type="button" className="round white" aria-label="Listen" onClick={() => sayLine(speakKey, lang)}><Icon d={P.speak} size={22} /></button>)}
    </header>
  );
}
