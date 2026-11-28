"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { freshAnswer } from "@/lib/ask";
import { tapName } from "@/lib/buttons";
import { AROUND, CENTRE, whereOf } from "@/lib/grid";
import { nameOf } from "@/lib/subjects";
import { tap } from "@/lib/track";

/**
 * The 4 by 4 grid that every level shows. `houses` are the twelve of this level, house 1 first; they fill the outer
 * boxes in the order of AROUND (lib/grid.js): the twelfth is bottom right, and house 1 is just left of it. A house with `open` is entered; any other only shakes and
 * is counted. `first` is the house to ring in gold (on Home, the one of the rising sign). The four boxes in the
 * middle are the same on every level; they open their page for this level (Home, or inside Gyan).
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
        <button key={box.id} type="button" lang={lang} style={place(AROUND[i])} aria-label={nameOf(box, lang) || `${i + 1}`}
          className={`cell${box.open ? "" : " locked"}${i === first ? " first" : ""}${shake === box.id ? " shake" : ""}`}
          onClick={() => press(box)} onAnimationEnd={() => setShake(null)}>
          {box.picture && <span className="emoji" aria-hidden="true">{box.picture}</span>}
          {nameOf(box, lang) && <span className="name">{nameOf(box, lang)}</span>}
        </button>
      ))}
      {CENTRE.map((c) => (
        <button key={c.id} type="button" lang={lang} style={place(c.at)} aria-label={nameOf(c, lang) || c.id}
          className={`cell mid${c.empty ? " locked" : ""}${shake === c.id ? " shake" : ""}`} onAnimationEnd={() => setShake(null)}
          onClick={() => { tap(`centre:${c.id}`); c.empty ? setShake(c.id) : router.push(`/${c.id}?in=${whereOf(level)}`); }}>
          <span className="emoji" aria-hidden="true">{c.picture}</span>
          {nameOf(c, lang) && <span className="name">{nameOf(c, lang)}</span>}
          {c.id === "ask" && answer && <i className="dot" aria-label="New answer" />}
        </button>
      ))}
    </div>
  );
}
