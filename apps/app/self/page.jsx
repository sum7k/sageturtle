"use client";

import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useLearner } from "@/components/useLearner";
import { PICTURE, WORD_KEYS, wordFor } from "@/lib/book";
import { centreById, say } from "@/lib/grid";
import { langById } from "@/lib/langs";
import { report } from "@/lib/learn";
import { READS_FROM, STAGES, loadStage } from "@/lib/stages";
import { t } from "@/lib/strings";
import { nameOf } from "@/lib/subjects";

const Chips = ({ keys, lang }) => (
  <div className="chips">{keys.map((k) => <span key={k} className="chip" lang={lang}><span aria-hidden="true">{PICTURE[k]}</span> {wordFor(lang, k)}</span>)}</div>
);

/**
 * Me, the first box in the middle. From Home it is the person: their name, kept on this phone (signing in, family
 * and backup come later). Inside Gyan it is their own learning: the stage they are at on the path of twelve, and,
 * once they read (stage 3), the words that go well, the ones to practise, and the ones still to come. It shows
 * only the learner's own road; nobody else is on this page.
 */
export default function Self() {
  const { ready, lang, stats, back, where, me, change } = useLearner();
  if (!ready) return <main className="screen" />;
  const title = nameOf(centreById("self"), lang);
  if (where === "top") {
    return (
      <main className="screen">
        <Bar onBack={back} title={title} />
        <div className="who">
          <span className="avatar"><Icon d={P.person} size={52} /></span>
          <input aria-label={t(lang, "name")} placeholder={t(lang, "name")} lang={lang} dir="auto" value={me.name} onChange={(e) => change((m) => { m.name = e.target.value.slice(0, 40); })} />
          <span className="user" lang={lang}>{langById(lang).name}</span>
        </div>
      </main>
    );
  }
  const at = loadStage();
  const r = report(stats, WORD_KEYS);
  const left = WORD_KEYS.filter((k) => !r.learned.includes(k));
  return (
    <main className="screen">
      <Bar onBack={back} title={title} />
      <section className="panel">
        <p className="big"><b>{at}</b> / {STAGES}</p>
        <div className="dots" aria-hidden="true">{Array.from({ length: STAGES }, (_, i) => <i key={i} className={i + 1 < at ? "on" : i + 1 === at ? "now" : ""} />)}</div>
      </section>
      {at >= READS_FROM && (
        <>
          <section className="panel">
            <p className="big"><b>{r.learned.length}</b> / {WORD_KEYS.length}</p>
            <p className="sub">{say("words", lang)}</p>
          </section>
          <section className="panel"><h2>💪 {say("strong", lang)}</h2>{r.strong.length ? <Chips keys={r.strong} lang={lang} /> : <p className="sub">{say("empty", lang)}</p>}</section>
          <section className="panel"><h2>🔁 {say("weak", lang)}</h2>{r.weak.length ? <Chips keys={r.weak} lang={lang} /> : <p className="sub">{say("empty", lang)}</p>}</section>
          {left.length > 0 && <section className="panel"><h2>🔭 {say("next", lang)}</h2><Chips keys={left} lang={lang} /></section>}
        </>
      )}
    </main>
  );
}
