"use client";

import Bar from "@/components/Bar";
import { useMe } from "@/components/useMe";
import { SIGNS, lineFor } from "@/lib/horoscope";
import { langById } from "@/lib/langs";
import { t } from "@/lib/strings";

/** Horoscope: pick your sign once, then read one line for today. Tapping the sign lets you pick again. */
export default function Horoscope() {
  const { me, change } = useMe();
  if (!me) return <main className="screen" />;
  const lang = me.lang || "en";
  const sign = SIGNS.find((s) => s.id === me.sign);
  const today = new Intl.DateTimeFormat(langById(lang).locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  if (!sign) {
    return (
      <main className="screen">
        <Bar back="/home" title={t(lang, "sign_t")} />
        <div className="blocks">
          {SIGNS.map((s, i) => (
            <button key={s.id} type="button" className={`block t${i % 4}`} onClick={() => change((m) => { m.sign = s.id; })}>
              <span className="glyph" aria-hidden="true">{s.glyph}</span>{t(lang, s.key)}
            </button>
          ))}
        </div>
      </main>
    );
  }
  return (
    <main className="screen">
      <Bar back="/home" title={t(lang, "horoscope")} />
      <button type="button" className="block t2 sign" aria-label={t(lang, "sign_t")} onClick={() => change((m) => { m.sign = ""; })}>
        <span className="glyph big" aria-hidden="true">{sign.glyph}</span>{t(lang, sign.key)}
      </button>
      <section className="ad plain">
        <span className="sub">{t(lang, "today")} · {today}</span>
        <h2 lang={lang === "hi" ? "hi" : "en"}>{lineFor(sign.id, lang)}</h2>
      </section>
    </main>
  );
}
