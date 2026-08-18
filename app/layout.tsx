import type { Metadata, Viewport } from "next";

import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "TrovaLibri — Inventario Vinted",
  description: "Trova subito dove hai riposto ogni libro e gestisci le vendite su Vinted.",
  applicationName: "TrovaLibri",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrovaLibri",
  },
  icons: { icon: `${basePath}/icon.svg`, apple: `${basePath}/icon.svg` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#173f35",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
