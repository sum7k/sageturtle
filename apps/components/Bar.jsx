"use client";

import Link from "next/link";
import Icon, { P } from "./Icon";

/** The top of an inner screen: a way back on the left, the screen's name in the middle. */
export default function Bar({ back, onBack, title, right }) {
  return (
    <header className="bar">
      {back ? <Link href={back} className="round white" aria-label="Back"><Icon d={P.back} sw={2.5} /></Link>
        : onBack ? <button type="button" className="round white" aria-label="Back" onClick={onBack}><Icon d={P.back} sw={2.5} /></button>
        : <span className="gap" />}
      {title && <h1 className="title">{title}</h1>}
      {right ?? <span className="gap" />}
    </header>
  );
}
