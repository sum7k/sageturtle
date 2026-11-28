"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { BOOK, JOKER } from "@/lib/buttons";
import { lagna } from "@/lib/lagna";
import { langById } from "@/lib/langs";
import { placeOrUjjain } from "@/lib/place";
import { ring, nameOf } from "@/lib/subjects";
import { t } from "@/lib/strings";
import { tap, sync } from "@/lib/track";

const YEARS = 11; // the time before school, then a first year and ten more

/**
 * Home: a ring of twelve around the learner. The twelve are the eleven subjects and the joker, one for each sign of
 * the zodiac. They sit in twelve houses that never move; house 1 is on top and the others follow to the left, as in
 * a North Indian kundali. The ring turns with the lagna: the subject of the sign that is rising now is in house 1.
 * Only Word (the reading app) and the joker can be entered yet. A tap on a greyed subject is only counted.
 * The centre is the learner: how far they have come through the eleven years.
 */
export default function Home() {
  const router = useRouter();
  const { me } = useMe();
  const [shake, setShake] = useState(null);
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
  const press = (s) => {
    if (s.id === JOKER.id) { tap(JOKER.id); return router.push(s.open); }
    if (s.open) { tap(BOOK.id); return router.push(s.open); }
    tap(`subject:${s.id}`);
    setShake(s.id);
  };
  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{date}</b></div>
        <Link href="/start?step=language" className="round white" aria-label={t(lang, "language")}><Icon d={P.globe} size={26} /></Link>
      </div>
      <div className="ring">
        {ring(rising).map((s, house) => {
          const turn = (-90 - house * 30) * (Math.PI / 180); // house 1 on top, then to the left
          return (
            <button key={s.id} type="button" lang={lang}
              className={`house${s.open ? "" : " locked"}${house === 0 ? " first" : ""}${shake === s.id ? " shake" : ""}`}
              style={{ left: `${50 + 39.5 * Math.cos(turn)}%`, top: `${50 + 39.5 * Math.sin(turn)}%` }}
              onClick={() => press(s)} onAnimationEnd={() => setShake(null)}>
              <span className="emoji" aria-hidden="true">{s.picture}</span>
              <span className="name">{nameOf(s, lang)}</span>
            </button>
          );
        })}
        <button type="button" className="learner" aria-label={t(lang, "name")} onClick={() => tap("centre")}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {Array.from({ length: YEARS }, (_, i) => (
              <circle key={i} cx="50" cy="50" r="46" fill="none" strokeWidth="6" stroke={i === 0 ? "var(--gold)" : "var(--back)"}
                strokeDasharray={`${(2 * Math.PI * 46) / YEARS - 3} 1000`} transform={`rotate(${-90 + (i * 360) / YEARS} 50 50)`} />
            ))}
          </svg>
          <span className="emoji" aria-hidden="true">🐢</span>
        </button>
      </div>
    </main>
  );
}
