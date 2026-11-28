"use client";

import { useEffect, useState } from "react";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { PICTURE, WORD_KEYS, round, wordFor, lettersFor } from "@/lib/book";
import { say } from "@/lib/speak";
import { t } from "@/lib/strings";
import { tap } from "@/lib/track";

const KEY = "bodhilabs.book.v1"; // which round the person has reached

/**
 * Book: learn to read a word by seeing its picture and hearing it.
 * The picture is on top. The gold button says the word. Three written words are below: pick the one that matches.
 * A wrong word shakes and says itself, so it is learned too. The right word turns green and the next picture comes.
 */
function Words({ lang }) {
  const [n, setN] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [right, setRight] = useState(false);
  useEffect(() => { let at = 0; try { at = Number(localStorage.getItem(KEY)) || 0; } catch {} setN(at); }, []);
  if (n === null) return null;

  const r = round(n);
  const hear = () => { if (!right) say(wordFor(lang, r.answer), lang); }; // not while the right word is being said
  const pick = (key) => {
    if (right) return;
    tap("answer");
    if (key !== r.answer) { say(wordFor(lang, key), lang); return setWrong((w) => [...w, key]); }
    tap("right");
    setRight(true);
    // The next picture comes only when both voices have said the word, and never sooner than a second.
    // If the sound never ends (a stalled network), it comes after ten seconds anyway.
    let went = false, spoken = false, waited = false;
    const next = () => {
      if (went) return;
      went = true;
      try { localStorage.setItem(KEY, String(n + 1)); } catch {}
      setN(n + 1);
      setWrong([]);
      setRight(false);
    };
    setTimeout(() => { waited = true; if (spoken) next(); }, 1100);
    setTimeout(next, 10000);
    say(wordFor(lang, key), lang, () => { spoken = true; if (waited) next(); });
  };
  const lap = n % WORD_KEYS.length;
  return (
    <>
      <div className="dots" aria-hidden="true">{WORD_KEYS.map((k, i) => <i key={k} className={i < lap ? "on" : i === lap ? "now" : ""} />)}</div>
      <div className={`picture${right ? " right" : ""}`} key={n} role="img" aria-label={wordFor(lang, r.answer)}>{PICTURE[r.answer]}</div>
      <div className="foot"><button type="button" className="round gold big" aria-label="Hear the word" onClick={hear}><Icon d={P.speak} size={34} /></button></div>
      <div className="choices">
        {r.choices.map((key) => (
          <button key={`${n}-${key}`} type="button" lang={lang} className={`choice${right && key === r.answer ? " right" : ""}${wrong.includes(key) ? " wrong" : ""}`} onClick={() => pick(key)}>
            {wordFor(lang, key)}
          </button>
        ))}
      </div>
    </>
  );
}

/** The second page of Book: the letters. A tap shows the letter large, and the phone says it. */
function Letters({ lang }) {
  const [at, setAt] = useState(null);
  const pick = (l) => { setAt(l); say(l, lang); };
  return (
    <>
      <button type="button" className="letter" aria-live="polite" onClick={() => at && say(at, lang)}>{at ?? lettersFor(lang)[0]}</button>
      <div className="letters">
        {lettersFor(lang).map((l) => <button key={l} type="button" aria-pressed={at === l} onClick={() => pick(l)}>{l}</button>)}
      </div>
    </>
  );
}

export default function Book() {
  const { me } = useMe();
  const [page, setPage] = useState("words");
  if (!me) return <main className="screen" />;
  const lang = me.lang || "en";
  const other = page === "words" ? "letters" : "words";
  return (
    <main className="screen">
      <Bar back="/home" title={t(lang, "book")} right={
        <button type="button" className="round white" aria-label={other} onClick={() => setPage(other)}>
          {page === "words" ? <b className="abc" lang={lang}>{lettersFor(lang)[0]}</b> : <Icon d={P.picture} size={24} />}
        </button>
      } />
      {page === "words" ? <Words lang={lang} /> : <Letters lang={lang} />}
    </main>
  );
}
