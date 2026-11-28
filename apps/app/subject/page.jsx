"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Grid from "@/components/Grid";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { lessonHouses, seenLessons, stageHere } from "@/lib/stages";
import { nameOf, subjectById } from "@/lib/subjects";

/**
 * One subject at one stage (?s=nature&stage=1): the 4 by 4 grid with its twelve lesson houses, the twelfth bottom
 * right as on every level. A house holds one lesson, or several parts of one; a house with nothing made yet is a
 * greyed box. A small tick marks a house the learner has seen to the end: their own road, nobody else's.
 */
export default function SubjectPage() {
  const router = useRouter();
  const { me } = useMe();
  const [here, setHere] = useState(null);
  useEffect(() => {
    if (me && nextStep(me)) return router.replace("/start");
    if (!me) return;
    const subject = subjectById(new URLSearchParams(location.search).get("s"));
    if (!subject) return router.replace("/gyan");
    setHere({ subject, stage: stageHere(location.search), seen: seenLessons() });
  }, [me, router]);
  if (!me || nextStep(me) || !here) return <main className="screen" />;
  const { subject, stage, seen } = here;
  return (
    <main className="screen">
      <Bar back={`/stage?n=${stage}`} title={nameOf(subject, me.lang)} />
      <Grid level="subject" houses={lessonHouses(subject.id, stage, seen)} lang={me.lang} />
    </main>
  );
}
