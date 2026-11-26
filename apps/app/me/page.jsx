"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { langById } from "@/lib/langs";
import { listsFor, variantById } from "@/lib/variants";
import { sayLine } from "@/lib/speak";

/** Everything about the person in one place: their people on top, their settings below. Each tile shows its present value. */
export default function Me() {
  const router = useRouter();
  const { me, change } = useMe();
  useEffect(() => { if (me && nextStep(me)) router.replace("/start"); }, [me, router]);
  if (!me || nextStep(me)) return <main className="screen" />;

  const lang = me.lang;
  const count = (l) => (me.people[l] ?? []).length;
  const settings = [
    { href: "/start?step=language", label: "Language", icon: P.talk, value: langById(lang).name },
    { href: "/start?step=variant", label: "What I do", icon: P.grid, value: variantById(me.variant)?.label + (me.variants.length > 1 ? ` +${me.variants.length - 1}` : "") },
    { href: "/start?step=place", label: "My place", icon: P.pin, value: me.pin },
    { href: "/start?step=alerts", label: "Khabar alerts", icon: P.bell, value: <Icon d={me.alerts === "yes" ? P.tick : P.cross} size={18} sw={3} /> },
    { href: "/start?step=lock", label: "My lock", icon: P.finger, value: <Icon d={me.lock && me.lock !== "none" ? P.tick : P.cross} size={18} sw={3} /> },
  ];
  return (
    <main className="screen">
      <Bar back="/home" speakKey="me" lang={lang} />
      <div className="who">
        <span className="avatar"><Icon d={P.person} size={52} /></span>
        <input aria-label="My name" value={me.name} onChange={(e) => change((m) => { m.name = e.target.value.slice(0, 40); })} />
        <span className="user">@{me.username}</span>
      </div>
      <div className="band">
        {listsFor(me.variants).map((l, i) => (
          <Link key={l.id} href={`/me/list?l=${l.id}`} className={`block t${i % 4}`} aria-label={l.name}>
            <Icon d={l.icon} size={28} sw={1.8} />{count(l.id)}
          </Link>
        ))}
      </div>
      <div className="blocks">
        {settings.map((s) => (
          <Link key={s.label} href={s.href} className="block" aria-label={s.label}><Icon d={s.icon} size={28} sw={1.8} />{s.value}</Link>
        ))}
        <button type="button" className="block" aria-label="Remove ads" onClick={() => sayLine("soon", lang)}><Icon d={P.noads} size={28} sw={1.8} />₹1,200</button>
      </div>
    </main>
  );
}
