// `npm run dev` (scripts/dev.mjs) runs Next's own dev server, which recompiles a page the moment a file changes.
import { readFileSync } from "node:fs";

const dev = process.env.NODE_ENV === "development";
// Voices on localhost: with an ElevenLabs key in .dev.vars the Worker here makes them; without one, they are
// played from bodhilabs.org, where they are already made and kept. Never the phone's own voice by default.
const localVoice = dev && (() => { try { return /^ELEVENLABS_API_KEY=\S/m.test(readFileSync(".dev.vars", "utf8")); } catch { return false; } })();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The app is plain pages that keep their state on the phone, so it is exported as static files.
  // Cloudflare serves the files; the Worker in worker/ answers only /api and /admin.
  ...(dev ? {} : { output: "export" }),
  reactStrictMode: true,
  poweredByHeader: false,
  // While developing, the pages come from Next and /api and /admin are passed on to the Worker beside it.
  ...(dev ? { rewrites: async () => [
    ...(localVoice ? [] : [{ source: "/api/voice", destination: "https://bodhilabs.org/api/voice" }]),
    ...["/api/:path*", "/admin", "/admin/:path*"].map((source) => ({ source, destination: `http://localhost:8787${source}` })),
  ] } : {}),
};
export default nextConfig;
