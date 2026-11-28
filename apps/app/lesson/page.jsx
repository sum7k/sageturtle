"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Lesson from "@/components/Lesson";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { notTheirWords } from "@/lib/narrators";
import { stageHere, unitsOf } from "@/lib/stages";
import { nameOf, subjectById } from "@/lib/subjects";
import { tap } from "@/lib/track";

/**
 * One lesson house (?s=nature&stage=1&h=3): its parts, played one after another (components/Lesson.jsx). When a
 * part ends the next one begins; the dots on top show the parts. The house counts as seen when every part is.
 */
export default function LessonPage() {
  const router = useRouter();
  const { me } = useMe();
  const [here, setHere] = useState(null);
  const [part, setPart] = useState(0);
  useEffect(() => {
    if (me && nextStep(me)) return router.replace("/start");
    if (!me) return;
    const q = new URLSearchParams(location.search);
    const subject = subjectById(q.get("s")), stage = stageHere(location.search);
    const parts = subject ? unitsOf(subject.id, stage)[Number(q.get("h")) - 1] ?? [] : [];
    if (!parts.length) return router.replace(subject ? `/subject?s=${subject.id}&stage=${stage}` : "/gyan");
    tap(`lesson:${parts[0].id}`);
    setHere({ subject, stage, parts });
  }, [me, router]);
  if (!me || nextStep(me) || !here) return <main className="screen" />;
  const { subject, stage, parts } = here;
  const back = `/subject?s=${subject.id}&stage=${stage}`;
  const lesson = parts[part];
  const later = () => { if (part < parts.length - 1) setTimeout(() => setPart((p) => Math.min(p + 1, parts.length - 1)), 1200); };
  return (
    <main className="screen">
      <Bar back={back} title={lesson.chapter ? (lesson.name[me.lang] ?? lesson.name.en) : nameOf(subject, me.lang)} />
      {parts.length > 1 && <div className="dots" aria-hidden="true">{parts.map((p, i) => <i key={p.id} className={i === part ? "on" : i < part ? "seen" : ""} />)}</div>}
      <Lesson key={lesson.id} lesson={lesson} lang={me.lang} onClose={() => router.push(back)} onEnded={later} />
      {lesson.chapter && <p className="sub">{notTheirWords(me.lang)}</p>}
    </main>
  );
}
