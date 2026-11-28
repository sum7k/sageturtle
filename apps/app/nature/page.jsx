"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Lesson from "@/components/Lesson";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { lessonsOf } from "@/lib/lessons";
import { stageHere } from "@/lib/stages";
import { subjectById, nameOf } from "@/lib/subjects";
import { tap } from "@/lib/track";

/**
 * Nature at one stage (?stage=, lib/stages.js). Stage 1: the lessons as big pictures, with no written word (nothing is read in stages 1 and 2).
 * A press on a picture plays that lesson (components/Lesson.jsx).
 */
export default function Nature() {
  const router = useRouter();
  const { me } = useMe();
  const [open, setOpen] = useState(null);
  const [stage, setStage] = useState(null);
  useEffect(() => { if (me && nextStep(me)) router.replace("/start"); else if (me) setStage(stageHere(location.search)); }, [me, router]);
  if (!me || nextStep(me) || stage === null) return <main className="screen" />;
  const LESSONS = lessonsOf("nature", stage);
  return (
    <main className="screen">
      <Bar back={open ? undefined : `/stage?n=${stage}`} onBack={open ? () => setOpen(null) : undefined} title={nameOf(subjectById("nature"), me.lang)} />
      {open ? <Lesson key={open.id} lesson={open} lang={me.lang} onClose={() => setOpen(null)} /> : (
        <div className="tiles">
          {LESSONS.map((l, i) => (
            <button key={l.id} type="button" className={`tile t${i % 4}`} aria-label={l.name[me.lang] ?? l.name.en} onClick={() => { tap(`lesson:${l.id}`); setOpen(l); }}>
              <span aria-hidden="true">{l.picture}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
