import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/badge";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on frontend engineering, developer tooling, and the small details that make interfaces feel fast.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container size="content" className="py-28 md:py-32 flex-1">
      <PageHeader
        eyebrow="writing"
        title="Blog"
        description="Notes on frontend engineering, developer tooling, and the small details that make interfaces feel fast."
      />

      {posts.length === 0 ? (
        <p className="text-lg text-muted-foreground">First post is on its way.</p>
      ) : (
        <div className="flex flex-col">
          {posts.map((post, i) => {
            const card = (
              <Link
                href={`/blog/${post.slug}`}
                className="group block border-t border-border py-8 md:py-10 transition-colors hover:border-[var(--syntax-blue)]/40"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors group-hover:text-[var(--syntax-blue)]">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                      {post.summary}
                    </p>

                    {post.tags.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-mono font-normal text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground md:text-right">
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    <span className="mt-1 block text-muted-foreground/70">
                      {post.readingTime} min read
                    </span>
                  </div>
                </div>
              </Link>
            );

            // Same LCP rule as the projects list: the first entry is above the
            // fold, so it gets the transform-only entrance rather than a fade.
            return i === 0 ? (
              <div key={post.slug} className="rise">
                {card}
              </div>
            ) : (
              <Reveal key={post.slug} delay={i * 80}>
                {card}
              </Reveal>
            );
          })}
        </div>
      )}
    </Container>
  );
}
