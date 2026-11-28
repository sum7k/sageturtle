"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Grid from "@/components/Grid";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { langById } from "@/lib/langs";
import { t } from "@/lib/strings";
import { TOP } from "@/lib/top";
import { sync } from "@/lib/track";

/**
 * Home, the top level: the 4 by 4 grid. House 1 is Gyan, all of learning. House 2 is Vartaman, the present, which
 * is not built yet. The other ten are empty for now. The four in the middle are the learner's own, as on every
 * level. The small button in the corner is for settings (now: the language).
 */
export default function Home() {
  const router = useRouter();
  const { me } = useMe();
  const ready = me && !nextStep(me);
  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (ready) sync();
  }, [me, ready, router]);
  if (!ready) return <main className="screen" />;

  const lang = me.lang;
  const date = new Intl.DateTimeFormat(langById(lang).locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{date}</b></div>
        <Link href="/start?step=language" className="round white" aria-label={t(lang, "language")}><Icon d={P.globe} size={26} /></Link>
      </div>
      <Grid level="top" houses={TOP} lang={lang} />
    </main>
  );
}
