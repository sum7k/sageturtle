// After `next build`: put the plain files that public/lab.html needs next to it. The lab page is not part of the
// app; it reads the same search and model code as the app (lib/), untouched, so what is tried there is what runs.
import { cpSync, mkdirSync } from "node:fs";
// All of lib/ goes, because the lessons are spread over files that read one another.
mkdirSync("out/labjs", { recursive: true });
cpSync("lib", "out/labjs", { recursive: true });
