import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anmol Malhan — Dev/Motion Portfolio",
    short_name: "Dev/Motion",
    description:
      "Frontend developer building fast, animated web experiences with Next.js, React, TypeScript, and GSAP.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
