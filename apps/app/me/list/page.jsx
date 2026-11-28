"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { LISTS } from "@/lib/variants";
import { useNote } from "@/components/useNote";
import { t } from "@/lib/strings";
import { reachLinks } from "@/lib/reach";

/** One list of people. People join only by scanning each other's code, so strangers cannot find anyone. */
const APP_NAME = { whatsapp: "WhatsApp", telegram: "Telegram", sms: "SMS" };

/** The two ways out of BodhiLabs for one person: the dialer, and their chat in the app they chose. */
function Reach({ person }) {
  const links = reachLinks(person);
  if (!links) return null;
  return (
    <>
      <a className="round" href={links.call} aria-label={`Call ${person.name} on the phone`}><Icon d={P.phone} size={22} /></a>
      <a className={`round ${links.app}`} href={links.message} target="_blank" rel="noopener noreferrer" aria-label={`Message ${person.name} in ${APP_NAME[links.app]}`}><Icon d={P[links.app]} size={22} /></a>
    </>
  );
}

function List() {
  const id = useSearchParams().get("l");
  const { me } = useMe();
  const { note, show } = useNote();
  const list = LISTS[id];
  if (!me || !list) return <main className="screen"><Bar back="/me" /></main>;
  const people = me.people[id] ?? [];
  return (
    <main className="screen">
      <Bar back="/me" title={t(me.lang, `l_${id}`)} />
      <div className="code">
        <span className="round huge"><Icon d={list.icon} size={72} sw={1.4} /></span>
        <span>@{me.username}</span>
        <span className="sub">{t(me.lang, "list_t")}</span>
      </div>
      <button type="button" className="wide" style={{ minHeight: 64, gap: 10 }} aria-label="Scan someone's code" onClick={() => show(t(me.lang, "soon"))}>
        <Icon d={P.camera} size={28} /><Icon d={P.plus} size={22} sw={2.5} />
      </button>
      {people.map((p) => (
        <div key={p.username} className="row" style={{ background: "#fff", borderRadius: 24, padding: "10px 14px" }}>
          <span className="round"><Icon d={P.person} size={26} /></span><b className="grow">{p.name}</b><Reach person={p} />
        </div>
      ))}
      {note}
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<main className="screen" />}><List /></Suspense>;
}
