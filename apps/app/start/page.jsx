"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { LANGS } from "@/lib/langs";
import { ADULT_VARIANTS } from "@/lib/variants";
import { STEPS, nextStep } from "@/lib/store";
import { say, sayLine, line } from "@/lib/speak";
import { canLock, makeLock, askLock } from "@/lib/lock";

const Tick = ({ onClick, disabled }) => (
  <button type="button" className="round gold big" aria-label="Go on" disabled={disabled} onClick={onClick}><Icon d={P.tick} size={36} sw={3} /></button>
);

function Language({ me, done }) {
  const [pick, setPick] = useState(me.lang);
  return (
    <>
      <div className="blocks">
        {LANGS.map((l, i) => (
          <button key={l.id} type="button" lang={l.id} className={`block lang t${i % 4}`} aria-pressed={pick === l.id}
            onClick={() => { setPick(l.id); say(line("language", l.id), l.id); }}>{l.name}</button>
        ))}
      </div>
      <div className="grow" />
      <div className="foot"><Tick disabled={!pick} onClick={() => done((m) => { m.lang = pick; })} /></div>
    </>
  );
}

function Lock({ done }) {
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
      <button type="button" className="round gold huge" aria-label="Set fingerprint or face" onClick={set}><Icon d={P.finger} size={80} sw={1.4} /></button>
      <button type="button" className="round white big" aria-label="Use my phone's PIN" onClick={set}><Icon d={P.keypad} size={36} sw={3.5} /></button>
    </div>
  );
}

function Place({ me, done, lang }) {
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
        <button type="button" aria-label="Find my place" onClick={() => sayLine("soon", lang)}><Icon d={P.pin} size={28} /></button>
        <button type="button" onClick={() => add("0")}>0</button>
        <button type="button" aria-label="Erase" onClick={() => setPin((p) => p.slice(0, -1))}><Icon d={P.erase} size={28} /></button>
      </div>
      <div className="foot"><Tick disabled={pin.length !== 6} onClick={() => done((m) => { m.pin = pin; })} /></div>
    </>
  );
}

function Variant({ me, done, lang }) {
  const [pick, setPick] = useState(me.variant);
  const go = async () => {
    // Changing what you do asks for the lock again. The first choice does not.
    if (me.variant && me.variant !== pick && me.lock && me.lock !== "none") {
      try { await askLock(me.lock); } catch { return; }
    }
    done((m) => { m.variant = pick; });
  };
  return (
    <>
      <div className="blocks">
        {ADULT_VARIANTS.map((v, i) => (
          <button key={v.id} type="button" className={`block t${i % 4}`} aria-pressed={pick === v.id} onClick={() => { setPick(v.id); say(v.label, lang); }}>
            <Icon d={v.icon} size={32} sw={1.8} />{v.label}
          </button>
        ))}
      </div>
      <div className="grow" />
      <div className="foot"><Tick disabled={!pick} onClick={go} /></div>
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
      <div className="grow center"><span className="round white huge"><Icon d={P.bell} size={80} sw={1.4} label="A bell brings a khabar card" /></span></div>
      <div className="foot">
        <button type="button" className="round white big" aria-label="Not now" onClick={() => done((m) => { m.alerts = "no"; })}><Icon d={P.cross} size={32} sw={2.5} /></button>
        <Tick onClick={yes} />
      </div>
    </>
  );
}

const SCREENS = { language: Language, lock: Lock, place: Place, variant: Variant, alerts: Alerts };

function Start() {
  const router = useRouter();
  const edit = useSearchParams().get("step"); // Me opens one step again with ?step=
  const { me, change } = useMe();
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (!me || step) return;
    const s = STEPS.includes(edit) ? edit : nextStep(me);
    if (!s) return router.replace("/home");
    setStep(s);
  }, [me, edit, step, router]);

  if (!me || !step) return <main className="screen" />;
  const lang = me.lang || "en";
  const Screen = SCREENS[step];
  const done = (fn) => {
    change((m) => {
      fn(m);
      if (!m.username) m.username = "turtle" + String(Math.floor(Math.random() * 90000) + 10000);
    });
    if (edit) return router.replace("/me");
    const i = STEPS.indexOf(step);
    if (i === STEPS.length - 1) return router.replace("/home");
    setStep(STEPS[i + 1]);
  };
  const i = STEPS.indexOf(step);
  return (
    <main className="screen">
      <Bar back={edit ? "/me" : undefined} onBack={!edit && i > 0 ? () => setStep(STEPS[i - 1]) : undefined} speakKey={step} lang={lang} />
      <Screen key={step} me={me} done={done} lang={lang} />
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<main className="screen" />}><Start /></Suspense>;
}
