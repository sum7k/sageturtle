import "./globals.css";
import Offline from "@/components/Offline";

export const metadata = {
  title: "BodhiLabs",
  description: "BodhiLabs",
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "BodhiLabs", statusBarStyle: "default" },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#eaf4ff" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Anek+Latin:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}<Offline /></body>
    </html>
  );
}
