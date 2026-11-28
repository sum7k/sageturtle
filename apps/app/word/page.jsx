"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Bar from "@/components/Bar";
import Grid from "@/components/Grid";
import { useMe } from "@/components/useMe";
import { nextStep } from "@/lib/store";
import { subjectById, nameOf } from "@/lib/subjects";
import { WORD_HOUSES } from "@/lib/word";

/** Inside Word: the same grid, with Word's own twelve houses in order. Only Letters (the word game) is open yet. */
export default function Word() {
  const router = useRouter();
  const { me } = useMe();
  useEffect(() => { if (me && nextStep(me)) router.replace("/start"); }, [me, router]);
  if (!me || nextStep(me)) return <main className="screen" />;
  return (
    <main className="screen">
      <Bar back="/home" title={nameOf(subjectById("word"), me.lang)} />
      <Grid level="word" houses={WORD_HOUSES} lang={me.lang} />
    </main>
  );
}
