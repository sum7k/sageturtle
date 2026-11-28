"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "./useMe";
import { nextStep } from "@/lib/store";
import { loadLearn } from "@/lib/learn";

/** For the pages in the middle of the grid: the person, their language, and what the phone remembers of their learning. */
export function useLearner() {
  const router = useRouter();
  const { me, change } = useMe();
  const [stats, setStats] = useState(null);
  const [where, setWhere] = useState("gyan"); // "top" when opened from Home (?in=top), else inside Gyan
  useEffect(() => {
    if (me && nextStep(me)) router.replace("/start");
    else if (me) { setStats(loadLearn()); setWhere(new URLSearchParams(location.search).get("in") === "top" ? "top" : "gyan"); }
  }, [me, router]);
  const back = () => (history.length > 1 ? router.back() : router.push("/home"));
  return { ready: !!me && !nextStep(me) && !!stats, lang: me?.lang || "en", stats, back, where, me, change };
}
