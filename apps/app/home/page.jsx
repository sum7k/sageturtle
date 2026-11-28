"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { useNote } from "@/components/useNote";
import { nextStep } from "@/lib/store";
import { BUTTONS } from "@/lib/buttons";
import { langById } from "@/lib/langs";
import { t } from "@/lib/strings";
import { tap, sync } from "@/lib/track";

/** Home: the ad on top, then the eleven buttons. Only Book is open. A locked button shows a lock and counts the tap. */
export default function Home() {
  const router = useRouter();
  const { me } = useMe();
  const { note, show } = useNote();
  const [shake, setShake] = useState(null);
  const ready = me && !nextStep(me);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (ready) sync(); // gives an id to a phone that chose its language without network
  }, [me, ready, router]);
  if (!ready) return <main className="screen" />;

  const lang = me.lang;
  const today = new Intl.DateTimeFormat(langById(lang).locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const press = (b) => {
    tap(b.id);
    if (b.open) return router.push(b.href);
    setShake(b.id);
    show(t(lang, "soon"));
  };

  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{today}</b></div>
        <Link href="/start?step=language" className="round white" aria-label={t(lang, "language")}><Icon d={P.globe} size={26} /></Link>
      </div>
      {/* This spot will carry advertisements. For now it asks what to build next. */}
      <Link href="/wish" className="ad" onClick={() => tap("ad")}>
        <h2>{t(lang, "ad_q")}</h2>
        <span className="go">{t(lang, "ad_go")}<Icon d={P.next} size={20} sw={2.5} /></span>
      </Link>
      <div className="blocks">
        {BUTTONS.map((b, i) => (
          <button key={b.id} type="button" className={`block t${i % 4}${b.open ? "" : " locked"}${shake === b.id ? " shake" : ""}`}
            onClick={() => press(b)} onAnimationEnd={() => setShake(null)}>
            {!b.open && <span className="pin"><Icon d={P.lock} size={16} sw={2.2} label={t(lang, "soon")} /></span>}
            <Icon d={b.icon} size={30} sw={1.8} />{t(lang, b.id)}
          </button>
        ))}
      </div>
      {note}
    </main>
  );
}
