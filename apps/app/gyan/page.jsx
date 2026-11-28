"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Grid from "@/components/Grid";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { allOpen, moveUp, setAllOpen, stageHouses } from "@/lib/stages";
import { nameOf } from "@/lib/subjects";
import { topById } from "@/lib/top";

/**
 * Gyan, all of learning: the 4 by 4 grid, and its twelve houses are the twelve stages of the path, in order.
 * The learner's own stage is ringed in gold. That stage and those behind it are open; those ahead are closed.
 * For review, /gyan?all=1 opens every stage on this phone and /gyan?all=0 closes them again (lib/stages.js).
 */
export default function Gyan() {
  const router = useRouter();
  const { me } = useMe();
  const [at, setAt] = useState(null);
  const [all, setAll] = useState(false);
  const ready = me && !nextStep(me);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (!ready) return;
    const asked = new URLSearchParams(location.search).get("all");
    if (asked !== null) setAllOpen(asked === "1");
    setAll(allOpen());
    setAt(moveUp());
  }, [me, ready, router]);
  if (!ready || at === null) return <main className="screen" />;

  return (
    <main className="screen">
      <Bar back="/home" title={nameOf(topById("gyan"), me.lang)} />
      <Grid level="gyan" houses={stageHouses(at, all)} lang={me.lang} first={at - 1} />
    </main>
  );
}
