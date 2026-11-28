"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Lesson from "@/components/Lesson";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { chaptersOf, lessonById } from "@/lib/lessons";
import { stageHere } from "@/lib/stages";
import { inVoiceOf, notTheirWords } from "@/lib/narrators";
import { subjectById, nameOf } from "@/lib/subjects";
import { tap } from "@/lib/track";

/**
 * Number at one stage (?stage=, lib/stages.js): its chapters. Only one is written yet, in stage 6: "Zero, fortune and debt", told in the voice
 * of Brahmagupta. A chapter is a card that says whose voice it is told in, and its lessons in order; a press on a
 * lesson plays it (components/Lesson.jsx). Lesson names are in Hindi and English so far.
 */
export default function NumberPage() {
  const router = useRouter();
  const { me } = useMe();
  const [open, setOpen] = useState(null);
  const [stage, setStage] = useState(null);
  useEffect(() => { if (me && nextStep(me)) router.replace("/start"); else if (me) setStage(stageHere(location.search)); }, [me, router]);
  if (!me || nextStep(me) || stage === null) return <main className="screen" />;
  const CHAPTERS = chaptersOf("number").filter((c) => c.stage === stage);
  const lang = me.lang;
  const word = (name) => name[lang] ?? name.en;
  return (
    <main className="screen">
      <Bar back={open ? undefined : `/stage?n=${stage}`} onBack={open ? () => setOpen(null) : undefined} title={open ? word(open.name) : nameOf(subjectById("number"), lang)} />
      {open ? <Lesson key={open.id} lesson={open} lang={lang} onClose={() => setOpen(null)} /> : CHAPTERS.map((c) => (
        <section key={c.id} className="chapter">
          <div className="head">
            <span className="step">{c.stage}</span>
            <h2>{word(c.name)}</h2>
            <p className="by">{inVoiceOf(c.by, lang)} · {c.by.years}</p>
            <p className="honest">{notTheirWords(lang)}</p>
          </div>
          <ol className="lessons">
            {c.lessons.map((l, i) => (
              <li key={l.id}>
                <button type="button" onClick={() => { tap(`lesson:${l.id}`); setOpen(lessonById(l.id)); }}>
                  <span className="n">{i + 1}</span><span className="name">{word(l.name)}</span><span aria-hidden="true">{l.picture}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
