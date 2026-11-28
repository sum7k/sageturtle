// `npm run dev` (scripts/dev.mjs) runs Next's own dev server, which recompiles a page the moment a file changes.
const dev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The app is plain pages that keep their state on the phone, so it is exported as static files.
  // Cloudflare serves the files; the Worker in worker/ answers only /api and /admin.
  ...(dev ? {} : { output: "export" }),
  reactStrictMode: true,
  poweredByHeader: false,
  // While developing, the pages come from Next and /api and /admin are passed on to the Worker beside it.
  ...(dev ? { rewrites: async () => ["/api/:path*", "/admin", "/admin/:path*"].map((source) => ({ source, destination: `http://localhost:8787${source}` })) } : {}),
};
export default nextConfig;
