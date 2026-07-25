import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import { formatDate } from "@/lib/date";
import { Container } from "@/components/ui/Container";
import "highlight.js/styles/github-dark.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateStaticParams() {
  return getAllNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) return { title: "Note not found" };
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      title: `${note.title} · Anmol Malhan`,
      description: note.excerpt,
      type: "article",
      publishedTime: note.date,
      tags: note.tags,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.excerpt,
    datePublished: note.date,
    dateModified: note.date,
    author: { "@type": "Person", name: "Anmol Malhan", url: siteUrl },
    ...(note.tags && note.tags.length > 0 ? { keywords: note.tags.join(", ") } : {}),
    url: `${siteUrl}/notes/${note.slug}`,
    mainEntityOfPage: `${siteUrl}/notes/${note.slug}`,
  };

  return (
    <Container className="py-28 md:py-32 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-12 md:mb-16 max-w-4xl">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>cd ../notes</span>
        </Link>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
          {note.title}
        </h1>
        {note.excerpt && (
          <p className="mt-6 text-xl text-muted-foreground leading-snug">
            {note.excerpt}
          </p>
        )}
      </header>

      {/* Meta moves into a rail beside the prose rather than sitting above it,
          so a wide screen carries the article instead of leaving the whole
          right half of the viewport empty. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 border-t border-border pt-12">
        <aside className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start">
          <dl className="space-y-5 font-mono text-xs uppercase tracking-widest">
            <div>
              <dt className="text-muted-foreground">Published</dt>
              <dd className="mt-1">
                <time dateTime={note.date}>{formatDate(note.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reading time</dt>
              <dd className="mt-1">{note.readingTime}</dd>
            </div>
            {note.tags && note.tags.length > 0 && (
              <div>
                <dt className="text-muted-foreground">Topics</dt>
                <dd className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                  {note.tags.map((tag, i) => (
                    <span key={tag} className="flex items-center gap-2">
                      {tag}
                      {i < note.tags!.length - 1 && (
                        <span aria-hidden className="text-border">·</span>
                      )}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        <article className="lg:col-span-9">
          <div
            className="prose-note max-w-[72ch]"
            dangerouslySetInnerHTML={{ __html: note.html }}
          />
        </article>
      </div>
    </Container>
  );
}
