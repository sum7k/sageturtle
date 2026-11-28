"use client";

import { markSeen } from "@/lib/stages";
import { useEffect, useRef, useState } from "react";
import Icon, { P } from "./Icon";
import LessonArt from "./LessonArt";
import Practice from "./Practice";
import { inVoiceOf } from "@/lib/narrators";
import { lessonLang, lineId } from "@/lib/lessons";
import { sayLine, hush } from "@/lib/speak";
import { tap } from "@/lib/track";

const REST = 700; // a breath between two scenes, in milliseconds
const LEAST = 3500; // a scene stays at least this long, so the drawing is seen even when the line is short

/**
 * One lesson, played: a drawing that moves and a line spoken over it, scene after scene. Nothing is written.
 * The next scene comes when the line has been said. A press on the drawing holds it and a second press goes on;
 * the arrows go one scene back or forward; at the end the gold button plays it again. The dots show where we are.
 * The whole lesson is heard in one voice: its teller's (lesson.who), a man's or a woman's.
 *
 * A lesson of a chapter (stage 4 on, lib/lessons.js CHAPTERS) is for a learner who reads: the line is also written
 * under the drawing, the screen says whose voice the chapter is told in, and after the last scene come a few sums to try (components/Practice.jsx).
 */
export default function Lesson({ lesson, lang, onClose }) {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [ended, setEnded] = useState(false);
  const who = useRef(lesson.who ?? (Math.random() < 0.5 ? "man" : "woman"));
  const heardIn = lessonLang(lesson, lang);
  const last = lesson.scenes.length - 1;
  const line = lesson.scenes[at].say[heardIn];
  // With no voice at all a written line still needs time to be read.
  const least = lesson.chapter ? 2500 + line.length * 55 : LEAST;

  useEffect(() => {
    if (held || ended) return;
    let alive = true, timer;
    const began = Date.now();
    const go = () => {
      if (!alive) return;
      timer = setTimeout(() => {
        if (!alive) return;
        if (at < last) setAt(at + 1);
        else { tap(`watched:${lesson.id}`); markSeen(lesson.id); setEnded(true); }
      }, Math.max(REST, least - (Date.now() - began)));
    };
    sayLine(lineId(lesson, at), line, heardIn, who.current, go);
    return () => { alive = false; clearTimeout(timer); hush(); };
  }, [at, held, ended, lesson, heardIn, last, line, least]);

  const to = (n) => { setEnded(false); setHeld(false); setAt(Math.max(0, Math.min(last, n))); };
  return (
    <section className="lesson">
      {lesson.chapter && <p className="by">{inVoiceOf(lesson.by, lang)}</p>}
      {ended && lesson.ask ? <Practice asks={lesson.ask} /> : (<>
      <button type="button" className="stage" aria-label={held ? "Go on" : "Hold"} onClick={() => !ended && setHeld(!held)}>
        <LessonArt key={at} art={lesson.scenes[at].art} prop={lesson.scenes[at].prop} still={held} />
        {held && <span className="round white big held"><Icon d={P.play} size={40} /></span>}
      </button>
      {lesson.chapter && <p className="line" lang={heardIn}>{line}</p>}
      </>)}
      <div className="dots" aria-hidden="true">{lesson.scenes.map((_, i) => <i key={i} className={i === at ? "on" : i < at ? "seen" : ""} />)}</div>
      <div className="foot">
        <button type="button" className="round white" aria-label="Back one" disabled={at === 0} onClick={() => to(at - 1)}><Icon d={P.left} sw={2.5} /></button>
        {ended
          ? <button type="button" className="round gold big" aria-label="Again" onClick={() => to(0)}><Icon d={P.again} size={40} sw={2.5} /></button>
          : <button type="button" className="round gold big" aria-label="Close" onClick={onClose}><Icon d={P.grid} size={36} /></button>}
        <button type="button" className="round white" aria-label="Forward one" disabled={at === last} onClick={() => to(at + 1)}><Icon d={P.next} sw={2.5} /></button>
      </div>
    </section>
  );
}
