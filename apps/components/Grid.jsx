"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { freshAnswer } from "@/lib/ask";
import { tapName } from "@/lib/buttons";
import { AROUND, CENTRE } from "@/lib/grid";
import { nameOf } from "@/lib/subjects";
import { tap } from "@/lib/track";

/**
 * The 4 by 4 grid that every level shows. `houses` are the twelve of this level, house 1 first; they fill the outer
 * boxes, starting top left and going round with the clock. A house with `open` is entered; any other only shakes and
 * is counted. `first` is the house to ring in gold (on Home, the one of the rising sign). The four boxes in the
 * middle are the same on every level.
 */
export default function Grid({ level, houses, lang, first = -1 }) {
  const router = useRouter();
  const [shake, setShake] = useState(null);
  const [answer, setAnswer] = useState(false);
  useEffect(() => { let on = true; freshAnswer().then((f) => on && setAnswer(f)); return () => { on = false; }; }, []);
  const press = (box) => {
    tap(tapName(level, box));
    if (box.open) return router.push(box.open);
    setShake(box.id);
  };
  const place = ([row, column]) => ({ gridRow: row, gridColumn: column });
  return (
    <div className="grid16">
      {houses.map((box, i) => (
        <button key={box.id} type="button" lang={lang} style={place(AROUND[i])}
          className={`cell${box.open ? "" : " locked"}${i === first ? " first" : ""}${shake === box.id ? " shake" : ""}`}
          onClick={() => press(box)} onAnimationEnd={() => setShake(null)}>
          <span className="emoji" aria-hidden="true">{box.picture}</span>
          <span className="name">{nameOf(box, lang)}</span>
        </button>
      ))}
      {CENTRE.map((c) => (
        <button key={c.id} type="button" lang={lang} style={place(c.at)} className="cell mid"
          onClick={() => { tap(`centre:${c.id}`); router.push(`/${c.id}`); }}>
          <span className="emoji" aria-hidden="true">{c.picture}</span>
          <span className="name">{nameOf(c, lang)}</span>
          {c.id === "ask" && answer && <i className="dot" aria-label="New answer" />}
        </button>
      ))}
    </div>
  );
}
