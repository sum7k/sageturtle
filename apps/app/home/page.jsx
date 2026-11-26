"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon, { P } from "@/components/Icon";
import Art from "@/components/Art";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { homeTiles, togglePin, toggleHide, move } from "@/lib/home";
import { micSpan } from "@/lib/browser";
import { langById } from "@/lib/langs";
import { say, sayLine } from "@/lib/speak";
import { KHABARS } from "@/lib/khabars";
import { load as loadTaste, pick } from "@/lib/taste";

const HOLD = 500; // how long a press must last to arrange a tile
const HIDDEN = "hidden"; // the tile at the end that holds what the person has hidden

export default function Home() {
  const router = useRouter();
  const { me, change } = useMe();
  const [sel, setSel] = useState(null);   // the tile that was tapped once and spoke its name
  const [open, setOpen] = useState(null); // the tile that is opened into its versions
  const [edit, setEdit] = useState(null); // the tile being arranged
  const [top, setTop] = useState(null);
  const hold = useRef(null);
  const held = useRef(false);

  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    if (me) setTop((t) => t ?? pick(KHABARS, loadTaste()));
  }, [me, router]);
  if (!me || nextStep(me)) return <main className="screen" />;

  const lang = me.lang;
  const { tiles, hidden } = homeTiles(me.variants, me.tiles);
  const cells = [...tiles, ...(hidden.length ? [{ app: HIDDEN }] : [])];
  const today = new Intl.DateTimeFormat(langById(lang).speech, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const arrange = (fn) => change((m) => { m.tiles = fn(m.tiles); });

  // A tap speaks the tile's name and selects it. A second tap opens it:
  // into its versions when the person's variants name it differently, straight into the app otherwise.
  const tap = (t) => {
    if (held.current) { held.current = false; return; }
    if (edit) return setEdit(t.app);
    if (sel !== t.app) { setSel(t.app); setOpen(null); return say(t.name, lang); }
    if (t.versions.length > 1) return setOpen(open === t.app ? null : t.app);
    sayLine("soon", lang);
  };
  // A long press arranges the tile: keep it on top, move it, or hide it.
  const press = (t) => {
    clearTimeout(hold.current);
    hold.current = setTimeout(() => { held.current = true; setOpen(null); setSel(t.app); setEdit(t.app); sayLine("manage", lang); }, HOLD);
  };
  const release = () => clearTimeout(hold.current);

  const panel = (app) => {
    if (edit === app) {
      const t = tiles.find((x) => x.app === app);
      return (
        <div className="fan" role="group" aria-label={`Arrange ${t.name}`}>
          <button type="button" className={`round ${t.pinned ? "gold" : ""}`} aria-label="Keep on top" aria-pressed={t.pinned} onClick={() => arrange((p) => togglePin(p, app))}><Icon d={P.star} /></button>
          <button type="button" className="round" aria-label="Move earlier" onClick={() => arrange((p) => move(me.variants, p, app, -1))}><Icon d={P.left} sw={2.5} /></button>
          <button type="button" className="round" aria-label="Move later" onClick={() => arrange((p) => move(me.variants, p, app, 1))}><Icon d={P.next} sw={2.5} /></button>
          <button type="button" className="round" aria-label="Hide" onClick={() => { arrange((p) => toggleHide(p, app)); setEdit(null); }}><Icon d={P.hide} /></button>
          <button type="button" className="round gold" aria-label="Done" onClick={() => setEdit(null)}><Icon d={P.tick} sw={3} /></button>
        </div>
      );
    }
    if (open === HIDDEN && app === HIDDEN) {
      return (
        <div className="fan" role="group" aria-label="Hidden">
          {hidden.map((t) => (
            <button key={t.app} type="button" className="block" aria-label={`Bring back ${t.name}`} onClick={() => { say(t.name, lang); arrange((p) => toggleHide(p, t.app)); }}>
              <Icon d={t.icon} size={26} sw={1.8} />{t.name}
            </button>
          ))}
        </div>
      );
    }
    if (open === app) {
      const t = tiles.find((x) => x.app === app);
      return (
        <div className="fan" role="group" aria-label={t.name}>
          {t.versions.map((v) => (
            <button key={v.name} type="button" className="block" onClick={() => { say(v.name, lang); sayLine("soon", lang); }}>
              <Icon d={v.icon} size={26} sw={1.8} />{v.name}
            </button>
          ))}
        </div>
      );
    }
    return null;
  };
  // An opened tile shows its panel right under its own row of three.
  const shown = edit ?? open;
  const at = cells.findIndex((c) => c.app === shown);
  const rowEnd = at === -1 ? -1 : Math.min(cells.length - 1, Math.floor(at / 3) * 3 + 2);

  return (
    <main className="screen">
      <div className="head">
        <div className="when"><b>{today}</b><span>{me.pin}</span></div>
        <Link href="/me" className="round white" aria-label="Me"><Icon d={P.person} size={26} /></Link>
      </div>
      {top && (
        <section className="kcard">
          <div className="art"><Art art={top.art} /></div>
          <div className="in">
            <span className="tag">Khabri</span>
            <h2>{top.title}</h2>
            <div className="row">
              <button type="button" className="round" aria-label="Listen" onClick={() => say(`${top.title}. ${top.dek}`, "en")}><Icon d={P.speak} size={22} /></button>
              <Link href="/khabri" className="round navy" aria-label="Open Khabri"><Icon d={P.next} sw={2.5} /></Link>
            </div>
          </div>
        </section>
      )}
      <div className="blocks">
        {cells.map((t, i) => (
          <Fragment key={t.app}>
            {t.app === HIDDEN ? (
              <button type="button" className="block dim" aria-label="Hidden" aria-expanded={open === HIDDEN} onClick={() => { setEdit(null); setOpen(open === HIDDEN ? null : HIDDEN); }}>
                <Icon d={P.hide} size={30} sw={1.8} />{hidden.length}
              </button>
            ) : (
              <button type="button" className={`block t${i % 4}`} aria-pressed={sel === t.app} aria-expanded={t.versions.length > 1 ? open === t.app : undefined}
                onClick={() => tap(t)} onPointerDown={() => press(t)} onPointerUp={release} onPointerLeave={release} onPointerCancel={release} onContextMenu={(e) => e.preventDefault()}>
                {t.pinned && <span className="pin"><Icon d={P.star} size={14} sw={2.5} label="Kept on top" /></span>}
                <Icon d={t.icon} size={30} sw={1.8} />{t.name}
                {t.versions.length > 1 && <span className="more" aria-hidden="true">{t.versions.map((v) => <i key={v.name} />)}</span>}
              </button>
            )}
            {i === rowEnd && panel(shown)}
          </Fragment>
        ))}
        <button type="button" className="wide" style={{ gridColumn: `span ${micSpan(cells.length)}` }} aria-label="Press and speak" onClick={() => sayLine("soon", lang)}>
          <Icon d={P.mic} size={32} />
        </button>
      </div>
    </main>
  );
}
