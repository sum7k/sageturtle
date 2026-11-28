"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon, { P } from "@/components/Icon";
import Art from "@/components/Art";
import { KHABARS } from "@/lib/khabars";
import { load, save, pick, addWeight, SIGNAL } from "@/lib/taste";
import { load as loadMe } from "@/lib/store";
import { langById } from "@/lib/langs";
import { t } from "@/lib/strings";

const FAR = 90; // how far a card must travel to count as a swipe

/** One khabar at a time, read whole on its card. Swipe left to like, swipe right for not for me. */
export default function Khabri() {
  const [k, setK] = useState(null);
  const [drag, setDrag] = useState(0);
  const [fly, setFly] = useState(null);
  const [lang, setLang] = useState("en");
  const start = useRef(null);
  const opened = useRef(0);

  useEffect(() => {
    setK(pick(KHABARS, load()));
    setLang(loadMe().lang || "en");
    opened.current = Date.now();
  }, []);

  const swipe = (dir) => {
    if (fly || !k) return;
    setFly(dir);
    const t = load();
    addWeight(t, k.topic, dir === "left" ? SIGNAL.like : SIGNAL.pass);
    // Time spent reading is a quiet signal too: half a minute on a card counts as a small like.
    if (Date.now() - opened.current > 30000) addWeight(t, k.topic, 1);
    t.seen[k.id] = Date.now();
    t.count += 1;
    save(t);
    setTimeout(() => {
      setK(pick(KHABARS, t, k.id));
      setFly(null);
      setDrag(0);
      opened.current = Date.now();
    }, 200);
  };

  useEffect(() => {
    const key = (e) => { if (e.key === "ArrowLeft") swipe("left"); if (e.key === "ArrowRight") swipe("right"); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });

  const onDown = (e) => { if (!fly) start.current = { x: e.clientX, y: e.clientY, on: false }; };
  const onMove = (e) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.on) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) { s.on = true; e.currentTarget.setPointerCapture?.(e.pointerId); }
      else { if (Math.abs(dy) > 12) start.current = null; return; }
    }
    setDrag(dx);
  };
  const onUp = (e) => {
    const s = start.current;
    start.current = null;
    if (!s?.on) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > FAR) swipe(dx < 0 ? "left" : "right");
    else setDrag(0);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: k.title, text: k.dek, url: location.href });
      const t = load();
      save(addWeight(t, k.topic, SIGNAL.share));
    } catch {}
  };

  const today = new Intl.DateTimeFormat(langById(lang).locale, { day: "numeric", month: "long" }).format(new Date());
  const x = fly ? (fly === "left" ? -1 : 1) * 600 : drag;
  const liking = fly === "left" || drag < 0;
  return (
    <main className="screen deck">
      <header className="bar">
        <Link href="/home" className="round white" aria-label="Home"><Icon d={P.home} /></Link>
        <b style={{ fontSize: 15 }}>{t(lang, "khabri")} · {today}</b>
        <Link href="/me" className="round white" aria-label="Me"><Icon d={P.person} size={26} /></Link>
      </header>
      {k && (
        <div className="deck-wrap">
          <div aria-hidden="true" className="deck-back" />
          {liking && <span aria-hidden="true" className="mark" style={{ opacity: fly ? 1 : Math.min(1, Math.abs(drag) / FAR) }}><Icon d={P.heart} size={48} /></span>}
          <article key={k.id} className={`card${drag ? " dragging" : ""}`}
            style={x ? { transform: `translateX(${x}px) rotate(${Math.max(-12, Math.min(12, x / 40))}deg)`, opacity: fly ? 0 : 1 } : undefined}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { start.current = null; setDrag(0); }}>
            <div className="art"><Art art={k.art} /></div>
            <div className="body">
              <h1>{k.title}</h1>
              <p className="dek">{k.dek}</p>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <button type="button" className="round" aria-label="Share" onClick={share}><Icon d={P.share} size={22} /></button>
              </div>
              {k.paras.map((p, i) => <p key={i} className="para">{p}</p>)}
              <div className="sources">
                <b>{t(lang, "sources")}</b>
                {k.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener">{s.name}</a>)}
              </div>
            </div>
          </article>
        </div>
      )}
      <p className="sub">{t(lang, "swipe")}</p>
      <p className="sr" aria-live="polite">{fly ? (fly === "left" ? "You like this. Next khabar." : "Not for you. Next khabar.") : ""}</p>
    </main>
  );
}
