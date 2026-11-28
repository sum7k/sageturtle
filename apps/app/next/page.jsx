"use client";

import { useEffect, useState } from "react";
import Bar from "@/components/Bar";
import { useLearner } from "@/components/useLearner";
import { PICTURE, round, wordFor } from "@/lib/book";
import { centreById, say } from "@/lib/grid";
import { nameOf } from "@/lib/subjects";
import { WORD_HOUSES } from "@/lib/word";

/** Next: what comes. The next three words of the game, then the houses of Word that follow the open one. */
export default function Next() {
  const { ready, lang, back } = useLearner();
  const [n, setN] = useState(0);
  useEffect(() => { try { setN(Number(localStorage.getItem("bodhilabs.book.v1")) || 0); } catch {} }, []);
  if (!ready) return <main className="screen" />;
  const words = [...new Set([0, 1, 2].map((i) => round(n + i).answer))];
  const open = WORD_HOUSES.findIndex((h) => h.open);
  return (
    <main className="screen">
      <Bar onBack={back} title={nameOf(centreById("next"), lang)} />
      <section className="panel">
        <h2>{say("words", lang)}</h2>
        <div className="chips">{words.map((k) => <span key={k} className="chip" lang={lang}><span aria-hidden="true">{PICTURE[k]}</span> {wordFor(lang, k)}</span>)}</div>
      </section>
      <section className="panel">
        <div className="chips">{WORD_HOUSES.slice(open + 1, open + 4).map((h) => <span key={h.id} className="chip later" lang={lang}><span aria-hidden="true">{h.picture}</span> {nameOf(h, lang)}</span>)}</div>
      </section>
    </main>
  );
}
