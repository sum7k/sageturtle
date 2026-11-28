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

const YEARS = 12; // the path has twelve steps, like everything else here (sumeet, 2026-11-28)

/** Now: where the learner stands. The twelve steps of the path on top, then what goes well and what needs more practice. */
export default function Now() {
  const { ready, lang, stats, back } = useLearner();
  if (!ready) return <main className="screen" />;
  const r = report(stats, WORD_KEYS);
  return (
    <main className="screen">
      <Bar onBack={back} title={nameOf(centreById("now"), lang)} />
      <div className="dots" aria-hidden="true">{Array.from({ length: YEARS }, (_, i) => <i key={i} className={i === 0 ? "now" : ""} />)}</div>
      {!r.seen ? <section className="panel"><p className="sub">{say("empty", lang)}</p></section> : (
        <>
          <section className="panel">
            <p className="big"><b>{r.first}</b> / {r.seen}</p>
            <p className="sub">{say("first", lang)}</p>
          </section>
          <section className="panel"><h2>💪 {say("strong", lang)}</h2>{r.strong.length ? <Chips keys={r.strong} lang={lang} /> : <p className="sub">{say("empty", lang)}</p>}</section>
          <section className="panel"><h2>🔁 {say("weak", lang)}</h2>{r.weak.length ? <Chips keys={r.weak} lang={lang} /> : <p className="sub">{say("empty", lang)}</p>}</section>
        </>
      )}
    </main>
  );
}
