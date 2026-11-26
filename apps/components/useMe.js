"use client";

import { useCallback, useEffect, useState } from "react";
import { load, update } from "@/lib/store";

/** The person on this phone. `me` is null until the phone's store has been read. */
export function useMe() {
  const [me, setMe] = useState(null);
  useEffect(() => { setMe(load()); }, []);
  const change = useCallback((fn) => setMe(update(fn)), []);
  return { me, change };
}
