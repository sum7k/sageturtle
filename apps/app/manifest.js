/** Installed from the landing page. The only thing the website asks for is Install. */
export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "BodhiLabs",
    short_name: "BodhiLabs",
    start_url: "/",
    display: "standalone",
    background_color: "#eaf4ff",
    theme_color: "#eaf4ff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
