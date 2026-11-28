// `npm run dev`: the app with live reload, at http://localhost:3000.
// Two things run side by side and both watch the files, so a saved file or a `git pull` shows at once:
//   - Next's dev server (port 3000) for the pages;
//   - the Worker (wrangler dev, port 8787) for /api and /admin, with the local database.
// Stop both with Ctrl+C. `npm run preview` is still there to try the real built app.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
mkdirSync("out", { recursive: true }); // the Worker wants its files folder to exist, even when empty
spawnSync(npx, ["wrangler", "d1", "migrations", "apply", "DB", "--local"], { stdio: "inherit" });

const run = (args) => spawn(npx, args, { stdio: "inherit" });
const both = [run(["wrangler", "dev", "--host", "localhost", "--port", "8787"]), run(["next", "dev", "--port", "3000"])];
const stop = () => { for (const p of both) p.kill("SIGINT"); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const p of both) p.on("exit", (code) => { stop(); process.exitCode ||= code ?? 0; });
