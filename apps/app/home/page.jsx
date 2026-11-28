"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { BOOK, ICONS, iconsFor } from "@/lib/buttons";
import { langById } from "@/lib/langs";
import { t } from "@/lib/strings";
import { tap, seen, sync, today as dayNow } from "@/lib/track";

/**
 * Home: eleven buttons. Only Book is open. The other ten are greyed out, carry no name, and show a picture that
 * changes from day to day. A tap on one is only counted. Nobody is asked anything.
 */
export default function Home() {
  const router = useRouter();
  const { me } = useMe();
  const [shake, setShake] = useState(null);
  const ready = me && !nextStep(me);
  const day = dayNow();
  const icons = useMemo(() => (ready ? iconsFor(me.username, day) : []), [ready, me?.username, day]);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (ready) { seen(icons, day); sync(); }
  }, [me, ready, router, icons, day]);
  if (!ready) return <main className="screen" />;

  const lang = me.lang;
  const date = new Intl.DateTimeFormat(langById(lang).locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{date}</b></div>
        <Link href="/start?step=language" className="round white" aria-label={t(lang, "language")}><Icon d={P.globe} size={26} /></Link>
      </div>
      <div className="blocks">
        <button type="button" className="block t0" onClick={() => { tap(BOOK.id); router.push(BOOK.href); }}>
          <Icon d={BOOK.icon} size={30} sw={1.8} />{t(lang, "book")}
        </button>
        {icons.map((id) => (
          <button key={id} type="button" className={`block locked${shake === id ? " shake" : ""}`} aria-label={t(lang, "soon")}
            onClick={() => { tap(`icon:${id}`); setShake(id); }} onAnimationEnd={() => setShake(null)}>
            <span className="emoji" aria-hidden="true">{ICONS[id]}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
