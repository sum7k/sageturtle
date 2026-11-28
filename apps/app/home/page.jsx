"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Grid from "@/components/Grid";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { lagna } from "@/lib/lagna";
import { langById } from "@/lib/langs";
import { placeOrUjjain } from "@/lib/place";
import { ring } from "@/lib/subjects";
import { t } from "@/lib/strings";
import { sync } from "@/lib/track";

/**
 * Home: the 4 by 4 grid. The twelve outer boxes are twelve subjects, one for each sign of the
 * zodiac. The houses never move; the subjects turn with the lagna, so the subject of the sign that is rising now is
 * in house 1 (top left, ringed in gold). Only Word, Nature and Lives can be entered yet. The four in the middle are the
 * learner's own: learned, now, next and ask. The small button in the corner is for settings (now: the language).
 */
export default function Home() {
  const router = useRouter();
  const { me } = useMe();
  const [rising, setRising] = useState(null);
  const ready = me && !nextStep(me);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (!ready) return;
    sync();
    const look = () => setRising(lagna(Date.now(), placeOrUjjain()));
    look();
    const again = setInterval(look, 60000); // the sign changes about every two hours
    return () => clearInterval(again);
  }, [me, ready, router]);
  if (!ready || rising === null) return <main className="screen" />;

  const lang = me.lang;
  const date = new Intl.DateTimeFormat(langById(lang).locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{date}</b></div>
        <Link href="/start?step=language" className="round white" aria-label={t(lang, "language")}><Icon d={P.globe} size={26} /></Link>
      </div>
      <Grid level="home" houses={ring(rising)} lang={lang} first={0} />
    </main>
  );
}
