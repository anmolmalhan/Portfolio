import { ImageResponse } from "next/og";

export const alt = "Anmol Malhan · Frontend Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.25), transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(232,121,249,0.18), transparent 55%), #09090b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#71717a",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#4ade80",
            }}
          />
          Frontend Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 156,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -6,
              textTransform: "uppercase",
            }}
          >
            Anmol Malhan
          </div>
          <div
            style={{
              fontSize: 40,
              color: "#a1a1aa",
              maxWidth: 900,
              lineHeight: 1.2,
            }}
          >
            Frontend developer crafting fast, animated web experiences with Next.js, React, and GSAP.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#71717a",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span style={{ color: "#60a5fa" }}>Next.js</span>
            <span>/</span>
            <span style={{ color: "#fbbf24" }}>TypeScript</span>
            <span>/</span>
            <span style={{ color: "#e879f9" }}>GSAP</span>
          </div>
          <div style={{ color: "#f4f4f5" }}>anmolmalhan.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
