// After `next build`: put the plain files that public/lab.html needs next to it. The lab page is not part of the
// app; it reads the same search and model code as the app (lib/), untouched, so what is tried there is what runs.
import { cpSync, mkdirSync } from "node:fs";
mkdirSync("out/labjs", { recursive: true });
for (const f of ["find.js", "lessons.js", "mind.js"]) cpSync(`lib/${f}`, `out/labjs/${f}`);
