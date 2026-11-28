/** @type {import('next').NextConfig} */
const nextConfig = {
  // The app is plain pages that keep their state on the phone, so it is exported as static files.
  // Cloudflare serves the files; the Worker in worker/ answers only /api and /admin.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
};
export default nextConfig;
