"use client";

import Bar from "@/components/Bar";
import { useLearner } from "@/components/useLearner";
import { PICTURE, WORD_KEYS, wordFor } from "@/lib/book";
import { centreById, say } from "@/lib/grid";
import { report } from "@/lib/learn";
import { nameOf } from "@/lib/subjects";

const Chips = ({ keys, lang }) => (
  <div className="chips">{keys.map((k) => <span key={k} className="chip" lang={lang}><span aria-hidden="true">{PICTURE[k]}</span> {wordFor(lang, k)}</span>)}</div>
);

/** Learned: what the learner has done so far. For now, the words whose picture they have matched. */
export default function Past() {
  const { ready, lang, stats, back } = useLearner();
  if (!ready) return <main className="screen" />;
  const r = report(stats, WORD_KEYS);
  return (
    <main className="screen">
      <Bar onBack={back} title={nameOf(centreById("past"), lang)} />
      <section className="panel">
        <p className="big"><b>{r.learned.length}</b> / {WORD_KEYS.length}</p>
        <p className="sub">{say("words", lang)}</p>
        {r.learned.length ? <Chips keys={r.learned} lang={lang} /> : <p className="sub">{say("empty", lang)}</p>}
      </section>
    </main>
  );
}
