"use client";

import { useState } from "react";

/**
 * A few sums to try at the end of a lesson: the sum and three answers to choose from. A wrong answer only fades,
 * and the learner chooses again; the right one turns green and the next sum comes. Nothing is counted, marked or
 * kept (CLAUDE.md: no marks, no pressure). `asks` is a list of [sum, choices, which one is right].
 */
export default function Practice({ asks }) {
  const [n, setN] = useState(0);
  const [off, setOff] = useState([]);
  const [right, setRight] = useState(false);
  if (n >= asks.length) return <div className="practice"><p className="sum done" aria-label="Done">✓</p></div>;
  const [sum, choices, good] = asks[n];
  const pick = (i) => {
    if (right) return;
    if (i !== good) return setOff([...off, i]);
    setRight(true);
    setTimeout(() => { setRight(false); setOff([]); setN(n + 1); }, 900);
  };
  return (
    <div className="practice">
      <p className="sum">{sum.includes("◻") ? sum : `${sum} = ?`}</p>
      <div className="picks">
        {choices.map((c, i) => (
          <button key={`${n}.${i}`} type="button" className={`pick${right && i === good ? " right" : ""}`} disabled={off.includes(i)} onClick={() => pick(i)}>{c}</button>
        ))}
      </div>
      <div className="dots" aria-hidden="true">{asks.map((_, i) => <i key={i} className={i === n ? "on" : i < n ? "seen" : ""} />)}</div>
    </div>
  );
}
