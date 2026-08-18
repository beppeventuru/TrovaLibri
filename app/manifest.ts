import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: "TrovaLibri — Inventario Vinted",
    short_name: "TrovaLibri",
    description: "Trova subito dove hai riposto ogni libro.",
    start_url: `${basePath}/`,
    id: `${basePath}/`,
    display: "standalone",
    scope: `${basePath}/`,
    background_color: "#f5f0e8",
    theme_color: "#173f35",
    lang: "it",
    orientation: "portrait-primary",
    icons: [
      { src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: `${basePath}/icon-maskable.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [{ name: "Cerca un libro", short_name: "Cerca", description: "Apri TrovaLibri e cerca un titolo", url: `${basePath}/#top`, icons: [{ src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }] }],
  };
}
