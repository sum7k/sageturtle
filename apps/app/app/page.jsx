"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { load, nextStep } from "@/lib/store";

/** Where the installed app starts (the manifest's start_url). It goes straight to the language screen or to Home. */
export default function App() {
  const router = useRouter();
  useEffect(() => { router.replace(nextStep(load()) ? "/start" : "/home"); }, [router]);
  return <main className="screen" />;
}
