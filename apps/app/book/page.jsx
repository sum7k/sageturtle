"use client";

import { useState } from "react";
import Bar from "@/components/Bar";
import { useMe } from "@/components/useMe";
import { lettersFor } from "@/lib/book";
import { say } from "@/lib/speak";
import { t } from "@/lib/strings";

/** Book: the letters of the person's language. A tap shows the letter large, and the phone says it. */
export default function Book() {
  const { me } = useMe();
  const [at, setAt] = useState(null);
  if (!me) return <main className="screen" />;
  const lang = me.lang || "en";
  const pick = (l) => { setAt(l); say(l, lang); };
  return (
    <main className="screen">
      <Bar back="/home" title={t(lang, "book")} />
      <button type="button" className="letter" aria-live="polite" onClick={() => at && say(at, lang)}>{at ?? lettersFor(lang)[0]}</button>
      <div className="letters">
        {lettersFor(lang).map((l) => (
          <button key={l} type="button" aria-pressed={at === l} onClick={() => pick(l)}>{l}</button>
        ))}
      </div>
    </main>
  );
}
