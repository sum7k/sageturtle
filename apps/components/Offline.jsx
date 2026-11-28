"use client";

import { useEffect } from "react";

/** Turns on the service worker (public/sw.js), which lets the phone install the app and open it without network. */
export default function Offline() {
  useEffect(() => {
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
