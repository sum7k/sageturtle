"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { nextLife, lifeLang } from "@/lib/lives";
import { sayLife, hush } from "@/lib/speak";
import { READS_FROM, stageHere } from "@/lib/stages";
import { subjectById, nameOf } from "@/lib/subjects";
import { tap } from "@/lib/track";

const LAST = "bodhilabs.life.v1"; // the life shown last time, so the next one is another

/**
 * Lives (जीवनी): the life of one great person, a different one each time it is opened. It can be read, and the gold
 * button reads it aloud. In stages 1 and 2, where nothing is read yet, only the picture and the button show. The round arrow brings another life.
 */
export default function Life() {
  const router = useRouter();
  const { me } = useMe();
  const [life, setLife] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [stage, setStage] = useState(1);
  const ready = me && !nextStep(me);

  const another = () => {
    hush();
    setPlaying(false);
    let last = null;
    try { last = localStorage.getItem(LAST); } catch {}
    const next = nextLife(last);
    try { localStorage.setItem(LAST, next.id); } catch {}
    tap(`life:${next.id}`);
    setLife(next);
  };
  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (ready) setStage(stageHere(location.search));
    if (ready && !life) another();
    return hush;
  }, [me, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ready || !life) return <main className="screen" />;

  const lang = lifeLang(life, me.lang);
  const reads = stage >= READS_FROM; // in stages 1 and 2 nothing is read: the life is only heard
  const play = () => {
    if (playing) { hush(); return setPlaying(false); }
    tap("heard");
    setPlaying(sayLife(life, lang, () => setPlaying(false)));
  };
  return (
    <main className="screen">
      <Bar back={`/stage?n=${stage}`} title={nameOf(subjectById("lives"), me.lang)} right={
        <button type="button" className="round white" aria-label="Another life" onClick={another}><Icon d={P.next} sw={2.5} /></button>} />
      <article className="life" lang={lang} key={life.id}>
        <div className="face" aria-hidden="true">{life.picture}</div>
        {reads && <h2>{life.name[lang] ?? life.name.en}</h2>}
        {reads && <p className="years">{life.years}</p>}
        <div className="foot">
          <button type="button" className={`round gold big${playing ? " pulse" : ""}`} aria-label={playing ? "Stop" : "Listen"} onClick={play}>
            <Icon d={playing ? P.cross : P.speak} size={34} />
          </button>
        </div>
        {reads && <p className="story">{life.text[lang]}</p>}
      </article>
    </main>
  );
}
