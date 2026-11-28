"use client";

import { useEffect, useState } from "react";
import Bar from "@/components/Bar";
import { useLearner } from "@/components/useLearner";
import { MAX_QUESTION, myQuestions, sendQuestion } from "@/lib/ask";
import { centreById, say } from "@/lib/grid";
import { nameOf } from "@/lib/subjects";

/**
 * Ask: the learner writes a question and sends it. It is read in the admin panel, and the answer written there
 * shows here, under the question.
 */
export default function Ask() {
  const { ready, lang, back } = useLearner();
  const [text, setText] = useState("");
  const [state, setState] = useState(""); // "", "sending", "sent", "failed"
  const [list, setList] = useState([]);
  const read = () => myQuestions(true).then((q) => q && setList(q));
  useEffect(() => { if (ready) read(); }, [ready]);
  if (!ready) return <main className="screen" />;
  const send = async () => {
    const mine = text.trim();
    if (!mine || state === "sending") return;
    setState("sending");
    const ok = await sendQuestion(mine);
    setState(ok ? "sent" : "failed");
    if (ok) { setText(""); read(); }
  };
  return (
    <main className="screen">
      <Bar onBack={back} title={nameOf(centreById("ask"), lang)} />
      <section className="panel ask">
        <textarea lang={lang} dir="auto" rows={4} maxLength={MAX_QUESTION} placeholder={say("write", lang)} value={text} onChange={(e) => { setText(e.target.value); setState(""); }} />
        <button type="button" className="send" disabled={!text.trim() || state === "sending"} onClick={send}>{say("send", lang)}</button>
        {state === "sent" && <p className="sub">{say("sent", lang)}</p>}
        {state === "failed" && <p className="sub">{say("failed", lang)}</p>}
      </section>
      {list.map((q) => (
        <section key={q.id} className="panel talk">
          <p className="mine" dir="auto">{q.text}</p>
          {q.reply ? <p className="theirs" dir="auto">{q.reply}</p> : <p className="sub">…</p>}
        </section>
      ))}
    </main>
  );
}
