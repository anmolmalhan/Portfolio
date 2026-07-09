import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Give each project's OG card its own alt text instead of a shared generic one.
export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  return [
    {
      id: "og",
      alt: project
        ? `${project.title} — case study by Anmol Malhan`
        : "Project case study",
      size,
      contentType,
    },
  ];
}

export default async function ProjectOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? "Project";
  const desc = project?.shortDescription ?? "";
  const tech = project?.techStack ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at 90% 10%, rgba(96,165,250,0.2), transparent 60%), #09090b",
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
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#71717a",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#60a5fa" }} />
          Case Study · Anmol Malhan
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -5,
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#a1a1aa",
              maxWidth: 1000,
              lineHeight: 1.3,
            }}
          >
            {desc}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            fontSize: 22,
            color: "#4ade80",
            fontFamily: "monospace",
          }}
        >
          {tech.map((t) => (
            <div
              key={t}
              style={{
                padding: "8px 18px",
                border: "1px solid #27272a",
                borderRadius: 999,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
