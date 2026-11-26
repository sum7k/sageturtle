/** Installed from the landing page. The only thing the website asks for is Install. */
export default function manifest() {
  return {
    name: "SageTurtle",
    short_name: "SageTurtle",
    start_url: "/",
    display: "standalone",
    background_color: "#eaf4ff",
    theme_color: "#eaf4ff",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
