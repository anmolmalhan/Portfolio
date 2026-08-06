import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** Anything not in generateStaticParams 404s rather than trying to resolve an
 *  import for a file that does not exist. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · ${siteConfig.name}`,
      description: post.summary,
      publishedTime: post.date,
      authors: [siteConfig.name],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  // Imported per request rather than eagerly at module scope: the index route
  // and the sitemap only need frontmatter, and a static import here would pull
  // every compiled post body into the shared chunk.
  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    url: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", name: siteConfig.name, url: siteUrl },
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
  };

  return (
    <article className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* One measure for the whole post.
          `Container size="content"` is 1152px, which is right for the grid-based
          routes but far too wide for body copy. The reading column is therefore
          capped at max-w-3xl AND centred with mx-auto. Both halves matter: an
          earlier version set the width without the centring, which pinned the
          text to the left of the container and left a dead gutter down the
          right. The same wrapper goes on the back link, the rules and the
          footer, so nothing overhangs the text it belongs to. */}
      <Container size="content" className="pt-28 pb-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>cd ..</span>
          </Link>
        </div>
      </Container>

      <Container size="content" className="pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto">
        {/* Above the fold, so `.rise` (transform only). An opacity fade here
            would defer LCP until the animation finished. */}
        <header>
          <div className="rise mb-5 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden className="h-3 w-px bg-border" />
            <span>{post.readingTime} min read</span>
            {post.draft ? (
              <>
                <span aria-hidden className="h-3 w-px bg-border" />
                <span className="text-[var(--syntax-amber)]">draft</span>
              </>
            ) : null}
          </div>

          <h1 className="rise text-display font-bold tracking-tighter" style={{ "--rise-delay": "60ms" } as React.CSSProperties}>
            {post.title}
          </h1>

          <p
            className="rise mt-6 text-xl leading-relaxed text-muted-foreground md:text-2xl"
            style={{ "--rise-delay": "120ms" } as React.CSSProperties}
          >
            {post.summary}
          </p>
        </header>

        <Separator className="mt-10 mb-4" />

        <Content />

        <Separator className="mt-16 mb-10" />

        <footer className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground">
            Written by {siteConfig.name}. Questions or corrections are welcome.
          </p>
          <div className="flex gap-6 font-mono text-sm">
            <Link href="/contact" className="text-[var(--syntax-blue)] hover:underline underline-offset-4">
              Get in touch
            </Link>
            <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
              All posts
            </Link>
          </div>
        </footer>
        </div>
      </Container>
    </article>
  );
}
