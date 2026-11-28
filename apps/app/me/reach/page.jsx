"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { REACH_APPS, cleanNumber, blankReach } from "@/lib/reach";
import { t } from "@/lib/strings";

const NAME = { whatsapp: "WhatsApp", telegram: "Telegram", sms: "SMS" };

/**
 * Reach me: one mobile number and one app for messages. Others' rows for this person then open the dialer or that app.
 * The number is not the account and is never checked. The cross clears it, so nobody is handed off to this person.
 */
export default function ReachMe() {
  const router = useRouter();
  const { me, change } = useMe();
  const [phone, setPhone] = useState("");
  const [app, setApp] = useState("");
  useEffect(() => { if (me) { setPhone(me.reach.phone); setApp(me.reach.app); } }, [me]);
  if (!me) return <main className="screen" />;

  const add = (d) => setPhone((p) => (p.length < 10 ? p + d : p));
  const ok = cleanNumber(phone) && app;
  const done = (reach) => { change((m) => { m.reach = reach; }); router.replace("/me"); };
  return (
    <main className="screen">
      <Bar back="/me" title={t(me.lang, "reach_t")} />
      <div className="number" aria-label={t(me.lang, "reach_t")} role="group"><Icon d={P.phone} size={26} />{phone.replace(/(\d{5})(\d+)/, "$1 $2")}</div>
      <div className="blocks">
        {REACH_APPS.map((a) => (
          <button key={a} type="button" className="block" aria-pressed={app === a} aria-label={NAME[a]} onClick={() => setApp(a)}>
            <span className={`round ${a}`}><Icon d={P[a]} size={26} /></span>{NAME[a]}
          </button>
        ))}
      </div>
      <div className="grow" />
      <div className="keys">
        {"123456789".split("").map((d) => <button key={d} type="button" onClick={() => add(d)}>{d}</button>)}
        <span />
        <button type="button" onClick={() => add("0")}>0</button>
        <button type="button" aria-label="Erase" onClick={() => setPhone((p) => p.slice(0, -1))}><Icon d={P.erase} size={28} /></button>
      </div>
      <div className="foot">
        <button type="button" className="round white big" aria-label="Nobody can reach me from here" onClick={() => done(blankReach())}><Icon d={P.cross} size={30} sw={2.5} /></button>
        <button type="button" className="round gold big" aria-label="Done" disabled={!ok} onClick={() => done({ phone: cleanNumber(phone), app })}><Icon d={P.tick} size={36} sw={3} /></button>
      </div>
    </main>
  );
}
