"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { installedHere, markInstalled } from "@/lib/browser";
import { load, nextStep } from "@/lib/store";

/** Where the installed app starts (the manifest's start_url). It goes straight to the language screen or to Home. */
export default function App() {
  const router = useRouter();
  useEffect(() => {
    // The app was started from its icon (the manifest adds "?source=pwa"): this window is the app, whatever the browser says.
    if (new URLSearchParams(location.search).get("source") === "pwa") markInstalled();
    installedHere();
    router.replace(nextStep(load()) ? "/start" : "/home");
  }, [router]);
  return <main className="screen" />;
}
