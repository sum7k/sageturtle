"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import Region from "@/components/Region";
import { LANGS, langById, firstGuess } from "@/lib/langs";
import { askPlace, placeLang } from "@/lib/place";
import { say } from "@/lib/speak";
import { ADULT_VARIANTS, MAX_VARIANTS, togglePick } from "@/lib/variants";
import { STEPS, nextStep, nextRegistrationStep } from "@/lib/store";
import { t } from "@/lib/strings";
import { sync } from "@/lib/track";
import { canLock, makeLock, askLock } from "@/lib/lock";

const Tick = ({ onClick, disabled }) => (
  <button type="button" className="round gold big" aria-label="Go on" disabled={disabled} onClick={onClick}><Icon d={P.tick} size={36} sw={3} /></button>
);

/**
 * The first screen. Nobody is asked to read: each language is a picture, and a tap makes the tile say hello in that
 * language. A second tap on the same tile, or the gold tick, chooses it. One tile is picked in advance from the
 * phone's language and the state the person is in. The phone is also asked where it is: a yes makes the guess
 * better and is kept for the lagna; a no changes nothing.
 */
function Language({ me, done }) {
  const [pick, setPick] = useState(me.lang);
  const [order, setOrder] = useState(LANGS);
  useEffect(() => {
    if (me.lang) return;
    let live = true;
    let state = "", here = "";
    const guess = () => {
      const id = firstGuess([...(navigator.languages ?? [navigator.language])], state, here);
      if (!live || !id || heard.current) return; // once the person has tapped a tile, nothing moves
      setPick(id);
      setOrder([langById(id), ...LANGS.filter((l) => l.id !== id)]); // the guess comes first
    };
    guess();
    fetch("/api/where").then((r) => r.json()).then((w) => { state = w.state; guess(); }).catch(() => {});
    askPlace().then((place) => { here = placeLang(place); guess(); });
    return () => { live = false; };
  }, [me.lang]);
  const choose = (id) => done((m) => { m.lang = id; });
  const tap = (l) => {
    if (pick === l.id && heard.current === l.id) return choose(l.id);
    heard.current = l.id;
    setPick(l.id);
    say(l.hello, l.id);
  };
  const heard = useRef("");
  return (
    <>
      <div className="blocks">
        {order.map((l, i) => (
          <button key={l.id} type="button" lang={l.id} className={`block lang t${i % 4}`} aria-pressed={pick === l.id} onClick={() => tap(l)}>
            <Region lang={l.id} />{l.name}
          </button>
        ))}
      </div>
      <div className="grow" />
      <div className="foot"><Tick disabled={!pick} onClick={() => choose(pick)} /></div>
    </>
  );
}

function Lock({ done, lang }) {
  const [busy, setBusy] = useState(false);
  const set = async () => {
    if (busy) return;
    // A phone with no lock at all cannot hold a passkey. The person goes on, and is asked again when one exists.
    if (!canLock()) return done((m) => { m.lock = "none"; });
    setBusy(true);
    try {
      const id = await makeLock();
      done((m) => { m.lock = id; });
    } catch {
      setBusy(false);
    }
  };
  return (
    <div className="grow center">
      <p className="sub">{t(lang, "lock_d")}</p>
      <button type="button" className="round gold huge" aria-label="Set fingerprint or face" onClick={set}><Icon d={P.finger} size={80} sw={1.4} /></button>
      <button type="button" className="round white big" aria-label="Use my phone's PIN" onClick={set}><Icon d={P.keypad} size={36} sw={3.5} /></button>
    </div>
  );
}

function Place({ me, done }) {
  const [pin, setPin] = useState(me.pin);
  const add = (d) => setPin((p) => (p.length < 6 ? p + d : p));
  return (
    <>
      <div className="digits" aria-label="Your place" role="group">
        {[0, 1, 2, 3, 4, 5].map((i) => <span key={i}>{pin[i] ?? ""}</span>)}
      </div>
      <div className="grow" />
      <div className="keys">
        {"123456789".split("").map((d) => <button key={d} type="button" onClick={() => add(d)}>{d}</button>)}
        <span />
        <button type="button" onClick={() => add("0")}>0</button>
        <button type="button" aria-label="Erase" onClick={() => setPin((p) => p.slice(0, -1))}><Icon d={P.erase} size={28} /></button>
      </div>
      <div className="foot"><Tick disabled={pin.length !== 6} onClick={() => done((m) => { m.pin = pin; })} /></div>
    </>
  );
}

function Variant({ me, done, lang }) {
  // A person can do more than one thing: a farmer who runs a shop, a teacher who is retired. Tap to add, tap again to remove.
  const [picks, setPicks] = useState(me.variants);
  const toggle = (v) => {
    setPicks((p) => togglePick(p, v.id)); // adding one drops what clashes with it; a fourth is refused
  };
  const go = async () => {
    // Changing what you do asks for the lock again. The first choice does not.
    const changed = me.variants.length && (picks.length !== me.variants.length || picks.some((x) => !me.variants.includes(x)));
    if (changed && me.lock && me.lock !== "none") {
      try { await askLock(me.lock); } catch { return; }
    }
    done((m) => { m.variants = picks; if (!picks.includes(m.variant)) m.variant = picks[0]; });
  };
  return (
    <>
      <div className="blocks">
        {ADULT_VARIANTS.map((v, i) => (
          <button key={v.id} type="button" className={`block t${i % 4}${picks.length >= MAX_VARIANTS && !picks.includes(v.id) ? " dim" : ""}`} aria-pressed={picks.includes(v.id)} onClick={() => toggle(v)}>
            <Icon d={v.icon} size={32} sw={1.8} />{t(lang, `v_${v.id}`)}
          </button>
        ))}
      </div>
      <div className="grow" />
      <div className="foot"><Tick disabled={!picks.length} onClick={go} /></div>
    </>
  );
}

function Alerts({ done }) {
  const yes = async () => {
    let ok = "no";
    try { if ("Notification" in globalThis && (await Notification.requestPermission()) === "granted") ok = "yes"; } catch {}
    done((m) => { m.alerts = ok; });
  };
  return (
    <>
      <div className="grow center"><span className="round white huge"><Icon d={P.bell} size={80} sw={1.4} /></span></div>
      <div className="foot">
        <button type="button" className="round white big" aria-label="Not now" onClick={() => done((m) => { m.alerts = "no"; })}><Icon d={P.cross} size={32} sw={2.5} /></button>
        <Tick onClick={yes} />
      </div>
    </>
  );
}

// The words on top of each step. The language step has none: every language shows its own name.
const TITLE = { lock: "lock_t", place: "place_t", variant: "variant_t", alerts: "alerts_t" };
const SCREENS = { language: Language, lock: Lock, place: Place, variant: Variant, alerts: Alerts };

function Start() {
  const router = useRouter();
  const edit = useSearchParams().get("step"); // Me opens one step again with ?step=
  const { me, change } = useMe();
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (!me || step) return;
    // ?step=register walks through registration; ?step=<name> opens one step again; with neither, only the language is asked.
    const s = edit === "register" ? nextRegistrationStep(me) : STEPS.includes(edit) ? edit : nextStep(me);
    if (!s) return router.replace("/home");
    setStep(s);
  }, [me, edit, step, router]);

  if (!me || !step) return <main className="screen" />;
  const lang = me.lang || "en";
  const Screen = SCREENS[step];
  const done = (fn) => {
    change((m) => {
      fn(m);
      if (!m.username) m.username = "bodhi" + String(Math.floor(Math.random() * 90000) + 10000);
    });
    // The server learns the language at once, and the place and work when the person registers.
    sync({ profile: true });
    if (!edit || step === "language") return router.replace("/home");
    const i = STEPS.indexOf(step);
    if (edit !== "register" || i === STEPS.length - 1) return router.replace("/me");
    setStep(STEPS[i + 1]);
  };
  return (
    <main className="screen">
      <Bar back={edit ? (step === "language" ? "/home" : "/me") : undefined} title={TITLE[step] && t(lang, TITLE[step])} />
      {step === "variant" && <p className="sub">{t(lang, "variant_d")}</p>}
      <Screen key={step} me={me} done={done} lang={lang} />
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<main className="screen" />}><Start /></Suspense>;
}
