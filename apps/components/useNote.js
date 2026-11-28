"use client";

import { useCallback, useRef, useState } from "react";

/** A short line that shows at the foot of the screen for a moment, such as "Coming soon". */
export function useNote() {
  const [text, setText] = useState("");
  const timer = useRef(null);
  const show = useCallback((s) => {
    setText(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setText(""), 1800);
  }, []);
  const note = <p className={`note${text ? " on" : ""}`} role="status">{text}</p>;
  return { note, show };
}
