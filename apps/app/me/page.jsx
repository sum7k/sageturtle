"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Icon, { P } from "@/components/Icon";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { langById } from "@/lib/langs";
import { listsFor } from "@/lib/variants";
import { useNote } from "@/components/useNote";
import { t } from "@/lib/strings";

const REACH_NAME = { whatsapp: "WhatsApp", telegram: "Telegram", sms: "SMS" };

/** Everything about the person in one place: their people on top, their settings below. Each tile shows its present value. */
export default function Me() {
  const router = useRouter();
  const { me, change } = useMe();
  const { note, show } = useNote();
  useEffect(() => { if (me && nextStep(me)) router.replace("/start"); }, [me, router]);
  if (!me || nextStep(me)) return <main className="screen" />;

  const lang = me.lang;
  const count = (l) => (me.people[l] ?? []).length;
  const settings = [
    { href: "/start?step=language", label: t(lang, "language"), icon: P.talk, value: langById(lang).name },
    { href: "/start?step=variant", label: t(lang, "work"), icon: P.grid, value: t(lang, `v_${me.variant}`) + (me.variants.length > 1 ? ` +${me.variants.length - 1}` : "") },
    { href: "/start?step=place", label: t(lang, "place"), icon: P.pin, value: me.pin },
    { href: "/start?step=alerts", label: t(lang, "alerts"), icon: P.bell, value: <Icon d={me.alerts === "yes" ? P.tick : P.cross} size={18} sw={3} /> },
    { href: "/start?step=lock", label: t(lang, "lock"), icon: P.finger, value: <Icon d={me.lock && me.lock !== "none" ? P.tick : P.cross} size={18} sw={3} /> },
  ];
  return (
    <main className="screen">
      <Bar back="/home" />
      <div className="who">
        <span className="avatar"><Icon d={P.person} size={52} /></span>
        <input aria-label={t(lang, "name")} placeholder={t(lang, "name")} value={me.name} onChange={(e) => change((m) => { m.name = e.target.value.slice(0, 40); })} />
        <span className="user">@{me.username}</span>
      </div>
      <div className="band">
        {listsFor(me.variants).map((l, i) => (
          <Link key={l.id} href={`/me/list?l=${l.id}`} className={`block t${i % 4}`}>
            <Icon d={l.icon} size={28} sw={1.8} /><small>{t(lang, `l_${l.id}`)}</small>{count(l.id)}
          </Link>
        ))}
      </div>
      <div className="blocks">
        {settings.map((s) => (
          <Link key={s.label} href={s.href} className="block"><Icon d={s.icon} size={28} sw={1.8} /><small>{s.label}</small>{s.value}</Link>
        ))}
        <Link href="/me/reach" className="block"><Icon d={P.phone} size={28} sw={1.8} /><small>{t(lang, "reach")}</small>{me.reach.phone ? REACH_NAME[me.reach.app] : <Icon d={P.cross} size={18} sw={3} />}</Link>
        <button type="button" className="block" onClick={() => show(t(lang, "soon"))}><Icon d={P.noads} size={28} sw={1.8} /><small>{t(lang, "noads")}</small>₹1,200</button>
      </div>
      {note}
    </main>
  );
}
