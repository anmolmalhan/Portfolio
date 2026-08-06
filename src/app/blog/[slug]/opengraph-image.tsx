import { ImageResponse } from "next/og";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return [
    {
      id: "og",
      alt: post ? `${post.title}, an article by ${siteConfig.name}` : "Blog post",
      size,
      contentType,
    },
  ];
}

/**
 * Card art for shared post links. Mirrors the case-study card so a link to a
 * post and a link to a project look like they came from the same site, but
 * sets the title in sentence case: post titles are sentences, and the
 * uppercase treatment used for project names turns them into shouting.
 */
export default async function BlogOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  const title = post?.title ?? "Blog";
  const summary = post?.summary ?? "";
  const tags = post?.tags ?? [];

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
          {post ? `${formatPostDate(post.date)} · ${post.readingTime} min read` : siteConfig.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: title.length > 42 ? 82 : 104,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 32, color: "#a1a1aa", maxWidth: 980, lineHeight: 1.3 }}>
            {summary}
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
          {tags.map((t) => (
            <div key={t} style={{ padding: "8px 18px", border: "1px solid #27272a", borderRadius: 999 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
