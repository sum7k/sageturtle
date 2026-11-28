"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { installedHere, mustInstall } from "@/lib/browser";

/**
 * Runs on every page. It turns on the service worker (public/sw.js), which lets the phone install the app and open it
 * without network. And it sends an app page that was opened in a browser tab to the install page.
 */
export default function Offline() {
  const path = usePathname();
  useEffect(() => {
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => {
    if (mustInstall({ path, standalone: installedHere(), host: location.hostname })) location.replace("/");
  }, [path]);
  return null;
}
