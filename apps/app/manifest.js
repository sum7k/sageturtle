/** Installed from the landing page. The only thing the website asks for is Install. */
export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "CubeGullak",
    short_name: "CubeGullak",
    id: "/",
    start_url: "/app?source=pwa",
    scope: "/",
    display: "standalone",
    // Lets the landing page ask the phone whether the app is already installed.
    related_applications: [{ platform: "webapp", url: "https://cubegullak.com/manifest.webmanifest" }],
    orientation: "portrait",
    background_color: "#eaf4ff",
    theme_color: "#eaf4ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
