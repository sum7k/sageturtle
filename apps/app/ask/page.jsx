"use client";

import { useEffect, useRef, useState } from "react";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import LessonArt from "@/components/LessonArt";
import { useLearner } from "@/components/useLearner";
import { MAX_QUESTION, myQuestions, sendQuestion } from "@/lib/ask";
import { centreById, say } from "@/lib/grid";
import { nameOf } from "@/lib/subjects";
import { answer } from "@/lib/find";
import { langById } from "@/lib/langs";
import { askCloud, compose, mindReady, warm } from "@/lib/mind";
import { allOpen, loadStage } from "@/lib/stages";
import { load } from "@/lib/store";
import { hush, sayLine, sayOwn } from "@/lib/speak";
import { tap } from "@/lib/track";

/**
 * Ask: the learner says or writes a question. The phone first looks for the answer in our own lessons (lib/find.js):
 * the line that fits is shown with its drawing and said aloud, so a learner who cannot read yet is answered too.
 * When the lessons do not hold a sure answer, the question goes to a person: it is read in the admin panel, and
 * the answer written there shows here, under the question. The talk button sends it to a person in any case.
 * Opened from Home (?in=top) it is the help of the app itself: nothing is looked up, the question goes to a person.
 * A sentence written from the found lines, by a model on Cloudflare or by the phone's own (lib/mind.js), is shown above them.
 */
export default function Ask() {
  const { ready, lang, back, where } = useLearner();
  const top = where === "top"; // from Home: a question about the app itself, which goes straight to a person
  const [text, setText] = useState("");
  const [state, setState] = useState(""); // "", "sending", "sent", "failed"
  const [list, setList] = useState([]);
  const [found, setFound] = useState(null); // { asked, lines, at }: what the lessons say, and which line is shown
  const [hearing, setHearing] = useState(false);
  const who = useRef(Math.random() < 0.5 ? "man" : "woman");
  const ear = useRef(null);
  const latest = useRef(0); // counts the questions, so a late answer to an old one is dropped
  const read = () => myQuestions(true).then((q) => q && setList(q));
  useEffect(() => { if (ready) { read(); if (!top) warm(); } }, [ready, top]);
  useEffect(() => () => { hush(); ear.current?.abort(); }, []);
  if (!ready) return <main className="screen" />;

  const toPerson = async (mine) => {
    if (!mine || state === "sending") return;
    setState("sending");
    const ok = await sendQuestion(mine);
    setState(ok ? "sent" : "failed");
    if (ok) read();
  };
  const show = (lines, at) => {
    const line = lines[at].passage;
    sayLine(line.id, line.text, line.lang, line.who ?? who.current); // the lesson's own teller
  };
  const ask = (asked = text) => {
    const mine = asked.trim();
    if (!mine) return;
    if (top) { setText(""); setFound(null); return toPerson(mine); }
    const upTo = allOpen() ? Infinity : loadStage(); // never a line from a stage ahead of the learner
    const lines = answer(mine, lang, 3, { upTo });
    const sure = !!lines[0]?.sure;
    tap(sure ? "ask:found" : lines.length ? "ask:near" : "ask:none");
    setText("");
    setState("");
    setFound(lines.length ? { asked: mine, lines, at: 0, own: lines.length ? "…" : "" } : null);
    if (lines.length) {
      // The found lines are put into a sentence that answers the question as it was asked: by the phone's own model
      // when it is there (lib/mind.js), else by one on Cloudflare. When neither has an answer, the line itself is said.
      const stamp = ++latest.current;
      const heardIn = lines[0].passage.lang;
      const wide = answer(mine, lang, 5, { upTo }); // a few more lines for the model to choose from
      const write = mindReady() ? compose(mine, wide.map((l) => l.passage.text), heardIn) : askCloud(load().uid, mine, wide.map((l) => l.passage.id), heardIn);
      write.then((own) => {
        if (latest.current !== stamp) return; // a newer question has been asked meanwhile
        setFound((f) => (f ? { ...f, own } : f));
        if (own) sayOwn(own, heardIn, lines[0].passage.who);
        else show(lines, 0);
      });
    }
    if (!sure) toPerson(mine);
  };
  const turn = (at) => { latest.current++; setFound({ ...found, at, own: found.own === "…" ? "" : found.own }); show(found.lines, at); };
  // The phone writes down what is said (the browser's own speech recognition, where it has one).
  const Hear = typeof window !== "undefined" ? window.SpeechRecognition ?? window.webkitSpeechRecognition : null;
  const listen = () => {
    if (hearing) return ear.current?.stop();
    hush();
    const r = new Hear();
    r.lang = langById(lang).locale;
    r.onresult = (e) => ask(e.results[0][0].transcript);
    r.onend = r.onerror = () => setHearing(false);
    ear.current = r;
    setHearing(true);
    try { r.start(); } catch { setHearing(false); }
  };
  const line = found?.lines[found.at];
  return (
    <main className="screen">
      <Bar onBack={back} title={nameOf(centreById("ask"), lang)} />
      <section className="panel ask">
        {Hear && <button type="button" className={`round gold big mic${hearing ? " on" : ""}`} aria-label="Speak" onClick={listen}><Icon d={P.mic} size={40} sw={2.5} /></button>}
        <textarea lang={lang} dir="auto" rows={Hear ? 2 : 4} maxLength={MAX_QUESTION} placeholder={say("write", lang)} value={text} onChange={(e) => { setText(e.target.value); setState(""); }} />
        <button type="button" className="send" disabled={!text.trim() || state === "sending"} onClick={() => ask()}>{say("send", lang)}</button>
      </section>
      {found && (
        <section className="panel talk found">
          <p className="mine" dir="auto">{found.asked}</p>
          <button type="button" className="stage" aria-label="Hear again" onClick={() => show(found.lines, found.at)}>
            <LessonArt key={line.passage.id} art={line.passage.art} prop={line.passage.prop} />
          </button>
          {found.own && <p className="theirs own" dir="auto" lang={line.passage.lang}>{found.own}</p>}
          <p className="theirs" dir="auto" lang={line.passage.lang}>{line.passage.text}</p>
          <div className="foot">
            <button type="button" className="round white" aria-label="Back one" disabled={found.at === 0} onClick={() => turn(found.at - 1)}><Icon d={P.left} sw={2.5} /></button>
            <button type="button" className="round white" aria-label="Ask a person" disabled={state === "sending" || state === "sent"} onClick={() => toPerson(found.asked)}><Icon d={P.talk} sw={2.5} /></button>
            <button type="button" className="round white" aria-label="Forward one" disabled={found.at === found.lines.length - 1} onClick={() => turn(found.at + 1)}><Icon d={P.next} sw={2.5} /></button>
          </div>
        </section>
      )}
      {state === "sent" && <p className="sub">{say("sent", lang)}</p>}
      {state === "failed" && <p className="sub">{say("failed", lang)}</p>}
      {list.map((q) => (
        <section key={q.id} className="panel talk">
          <p className="mine" dir="auto">{q.text}</p>
          {q.reply ? <p className="theirs" dir="auto">{q.reply}</p> : <p className="sub">…</p>}
        </section>
      ))}
    </main>
  );
}
