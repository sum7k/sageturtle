"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Grid from "@/components/Grid";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { lagna } from "@/lib/lagna";
import { placeOrUjjain } from "@/lib/place";
import { ring, nameOf } from "@/lib/subjects";
import { topById } from "@/lib/top";

/**
 * Gyan, all of learning: the 4 by 4 grid. The twelve outer boxes are twelve subjects, one for each sign of the
 * zodiac. The houses never move; the subjects turn with the lagna, so the subject of the sign that is rising now is
 * in house 1 (top left, ringed in gold). Only Word and Lives can be entered yet. The four in the middle are the
 * learner's own: learned, now, next and ask.
 */
export default function Gyan() {
  const router = useRouter();
  const { me } = useMe();
  const [rising, setRising] = useState(null);
  const ready = me && !nextStep(me);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (!ready) return;
    const look = () => setRising(lagna(Date.now(), placeOrUjjain()));
    look();
    const again = setInterval(look, 60000); // the sign changes about every two hours
    return () => clearInterval(again);
  }, [me, ready, router]);
  if (!ready || rising === null) return <main className="screen" />;

  const lang = me.lang;
  return (
    <main className="screen">
      <Bar back="/home" title={nameOf(topById("gyan"), lang)} />
      <Grid level="gyan" houses={ring(rising)} lang={lang} first={0} />
    </main>
  );
}
