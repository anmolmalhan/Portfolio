import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import "highlight.js/styles/github-dark.css";

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

  return (
    <article className="max-w-3xl w-full mx-auto px-6 py-20 flex-1 page-reveal">
      <Link
        href="/notes"
        className="inline-flex items-center gap-2 text-[var(--syntax-comment)] hover:text-foreground font-mono text-sm transition-colors group mb-12"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>cd ../notes</span>
      </Link>

      <header className="mb-10 border-b border-surface pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--syntax-comment)] uppercase tracking-widest mb-5">
          <time dateTime={note.date}>{formatDate(note.date)}</time>
          <span aria-hidden>·</span>
          <span>{note.readingTime}</span>
          {note.tags && note.tags.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="text-[var(--syntax-green)]">
                {note.tags.join(" / ")}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
          {note.title}
        </h1>
        {note.excerpt && (
          <p className="mt-5 text-xl text-[var(--syntax-comment)] leading-snug">
            {note.excerpt}
          </p>
        )}
      </header>

      <div
        className="prose-note"
        dangerouslySetInnerHTML={{ __html: note.html }}
      />
    </article>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
