"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Grid from "@/components/Grid";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { lagna } from "@/lib/lagna";
import { placeOrUjjain } from "@/lib/place";
import { stageHere, subjectsAt } from "@/lib/stages";

/**
 * One stage of Gyan: the 4 by 4 grid with the twelve subjects, one for each sign of the zodiac. The houses never
 * move; the subjects turn with the lagna, so the subject of the sign that is rising now is in house 1 (ringed in gold). A subject is open only when something is made for this stage; else a press is only counted.
 */
export default function Stage() {
  const router = useRouter();
  const { me } = useMe();
  const [stage, setStage] = useState(null);
  const [rising, setRising] = useState(null);
  const ready = me && !nextStep(me);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (!ready) return;
    setStage(stageHere(location.search));
    const look = () => setRising(lagna(Date.now(), placeOrUjjain()));
    look();
    const again = setInterval(look, 60000); // the sign changes about every two hours
    return () => clearInterval(again);
  }, [me, ready, router]);
  if (!ready || rising === null || stage === null) return <main className="screen" />;

  return (
    <main className="screen">
      <Bar back="/gyan" title={String(stage)} />
      <Grid level="stage" houses={subjectsAt(stage, rising)} lang={me.lang} first={0} />
    </main>
  );
}
