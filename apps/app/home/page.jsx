"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import Art from "@/components/Art";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { tilesFor, variantById } from "@/lib/variants";
import { micSpan } from "@/lib/browser";
import { langById } from "@/lib/langs";
import { say, sayLine } from "@/lib/speak";
import { KHABARS } from "@/lib/khabars";
import { load as loadTaste, pick } from "@/lib/taste";

export default function Home() {
  const router = useRouter();
  const { me, change } = useMe();
  const [sel, setSel] = useState(null);
  const [top, setTop] = useState(null);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (me) setTop(pick(KHABARS, loadTaste()));
  }, [me, router]);
  if (!me || nextStep(me)) return <main className="screen" />;

  const lang = me.lang;
  const tiles = tilesFor(me.variant);
  const today = new Intl.DateTimeFormat(langById(lang).speech, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  // A tap speaks the tile's name and selects it. A second tap opens it.
  const tap = (t) => {
    if (sel !== t.app) { setSel(t.app); return say(t.name, lang); }
    sayLine("soon", lang);
  };

  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{today}</b><span>{me.pin}</span></div>
        <Link href="/me" className="round white" aria-label="Me"><Icon d={P.person} size={26} /></Link>
      </div>
      {me.variants.length > 1 && (
        <div className="hats" role="group" aria-label="What I do">
          {me.variants.map((id) => {
            const v = variantById(id);
            // Switching between your own variants needs no lock: they are all yours.
            return v && (
              <button key={id} type="button" className="round white" aria-label={v.label} aria-pressed={me.variant === id}
                onClick={() => { setSel(null); change((m) => { m.variant = id; }); say(v.label, lang); }}><Icon d={v.icon} size={26} sw={1.8} /></button>
            );
          })}
        </div>
      )}
      {top && (
        <section className="kcard">
          <div className="art"><Art art={top.art} /></div>
          <div className="in">
            <span className="tag">Khabri</span>
            <h2>{top.title}</h2>
            <div className="row">
              <button type="button" className="round" aria-label="Listen" onClick={() => say(`${top.title}. ${top.dek}`, "en")}><Icon d={P.speak} size={22} /></button>
              <Link href="/khabri" className="round navy" aria-label="Open Khabri"><Icon d={P.next} sw={2.5} /></Link>
            </div>
          </div>
        </section>
      )}
      <div className="blocks">
        {tiles.map((t, i) => (
          <button key={t.app} type="button" className={`block t${i % 4}`} aria-pressed={sel === t.app} onClick={() => tap(t)}>
            <Icon d={t.icon} size={30} sw={1.8} />{t.name}
          </button>
        ))}
        <button type="button" className="wide" style={{ gridColumn: `span ${micSpan(tiles.length)}` }} aria-label="Press and speak" onClick={() => sayLine("soon", lang)}>
          <Icon d={P.mic} size={32} />
        </button>
      </div>
    </main>
  );
}
