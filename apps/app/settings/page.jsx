"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useLearner } from "@/components/useLearner";
import { centreById, say } from "@/lib/grid";
import { langById } from "@/lib/langs";
import { askPlace, savedPlace } from "@/lib/place";
import { SPEEDS, VOICES, loadPrefs, savePrefs } from "@/lib/prefs";
import { say as speak } from "@/lib/speak";
import { t } from "@/lib/strings";
import { nameOf } from "@/lib/subjects";

const VOICE_PICTURE = { both: "👨👩", man: "👨", woman: "👩" };
const SPEED_PICTURE = { 0.8: "🐢", 1: "🚶", 1.2: "🐇" };

/**
 * Settings, the third box in the middle. From Home they are the ones for the whole app: the language, and the
 * place the phone gave (it turns the houses by the rising sign, and stays on the phone). Inside Gyan they are the
 * ones for learning: which voice speaks (both, a man's or a woman's) and how fast. A choice is heard at once.
 */
export default function Settings() {
  const { ready, lang, back, where } = useLearner();
  const [prefs, setPrefs] = useState(null);
  const [place, setPlace] = useState(null);
  useEffect(() => { setPrefs(loadPrefs()); setPlace(savedPlace()); }, []);
  if (!ready || !prefs) return <main className="screen" />;
  const choose = (change) => { setPrefs(savePrefs(change)); speak(langById(lang).hello, lang); };
  return (
    <main className="screen">
      <Bar onBack={back} title={nameOf(centreById("settings"), lang)} />
      {where === "top" ? (
        <div className="blocks">
          <Link href="/start?step=language" className="block" lang={lang}><Icon d={P.globe} size={28} sw={1.8} /><small>{t(lang, "language")}</small>{langById(lang).name}</Link>
          <button type="button" className="block" lang={lang} onClick={() => askPlace().then((p) => p && setPlace(p))}>
            <Icon d={P.pin} size={28} sw={1.8} /><small>{t(lang, "place")}</small><Icon d={place ? P.tick : P.cross} size={18} sw={3} />
          </button>
        </div>
      ) : (
        <>
          <section className="panel">
            <h2 lang={lang}>{say("voice", lang)}</h2>
            <div className="blocks">{VOICES.map((v) => <button key={v} type="button" className="block pick" aria-label={v} aria-pressed={prefs.voice === v} onClick={() => choose({ voice: v })}><span className="emoji" aria-hidden="true">{VOICE_PICTURE[v]}</span></button>)}</div>
          </section>
          <section className="panel">
            <h2 lang={lang}>{say("speed", lang)}</h2>
            <div className="blocks">{SPEEDS.map((v) => <button key={v} type="button" className="block pick" aria-label={`${v}`} aria-pressed={prefs.speed === v} onClick={() => choose({ speed: v })}><span className="emoji" aria-hidden="true">{SPEED_PICTURE[v]}</span></button>)}</div>
          </section>
        </>
      )}
    </main>
  );
}
