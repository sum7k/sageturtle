"use client";

import { useState } from "react";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { t } from "@/lib/strings";
import { sendWish } from "@/lib/track";

const MAX = 500;

/** The form behind the ad on Home: one question, one box, one button. */
export default function Wish() {
  const { me } = useMe();
  const [text, setText] = useState("");
  const [state, setState] = useState("write"); // write, sending, sent, failed
  if (!me) return <main className="screen" />;
  const lang = me.lang || "en";

  const send = async () => {
    setState("sending");
    setState((await sendWish(text.trim())) ? "sent" : "failed");
  };

  return (
    <main className="screen">
      <Bar back="/home" />
      {state === "sent" ? (
        <div className="grow center">
          <span className="round gold huge"><Icon d={P.tick} size={72} sw={2.5} /></span>
          <h1 className="title">{t(lang, "thanks")}</h1>
        </div>
      ) : (
        <>
          <h1 className="title start">{t(lang, "ad_q")}</h1>
          <textarea className="box" rows={6} maxLength={MAX} placeholder={t(lang, "wish_ph")} aria-label={t(lang, "ad_q")} value={text} onChange={(e) => setText(e.target.value)} />
          {state === "failed" && <p className="sub" role="alert">{t(lang, "retry")}</p>}
          <button type="button" className="wide" disabled={!text.trim() || state === "sending"} onClick={send}>{t(lang, "send")}</button>
        </>
      )}
    </main>
  );
}
