import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrovaLibri — Inventario Vinted",
    short_name: "TrovaLibri",
    description: "Trova subito dove hai riposto ogni libro.",
    start_url: "/",
    id: "/",
    display: "standalone",
    scope: "/",
    background_color: "#f5f0e8",
    theme_color: "#173f35",
    lang: "it",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [{ name: "Cerca un libro", short_name: "Cerca", description: "Apri TrovaLibri e cerca un titolo", url: "/#top", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] }],
  };
}
