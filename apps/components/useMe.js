"use client";

import { useCallback, useEffect, useState } from "react";
import { load, update } from "@/lib/store";
import { langById } from "@/lib/langs";

/** The person on this phone. `me` is null until the phone's store has been read. The page follows their language. */
export function useMe() {
  const [me, setMe] = useState(null);
  useEffect(() => { setMe(load()); }, []);
  useEffect(() => {
    if (!me?.lang) return;
    document.documentElement.lang = me.lang;
    document.documentElement.dir = langById(me.lang).rtl ? "rtl" : "ltr";
  }, [me?.lang]);
  const change = useCallback((fn) => setMe(update(fn)), []);
  return { me, change };
}
