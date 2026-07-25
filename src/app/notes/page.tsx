import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllNotes } from "@/lib/notes";
import { formatDate } from "@/lib/date";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Field notes from building interfaces. Bug post-mortems, pattern essays, and engineering trade-offs from real projects.",
  alternates: {
    canonical: "/notes",
    types: { "application/rss+xml": "/notes/rss.xml" },
  },
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <Container size="content" className="py-28 md:py-32 flex-1">
      <PageHeader
        eyebrow="writing"
        title="Notes"
        description="Field notes from building interfaces. Bug post-mortems, pattern essays, and engineering trade-offs from real projects."
      />

      {notes.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          {"// no notes yet. first post landing soon"}
        </p>
      ) : (
        /* An index, not a stack of cards. Each note is a full-width row on a
           hairline rule with its ordinal in the margin, so the page scans like
           a table of contents and the row itself is the hit target. */
        /* No border-t here: PageHeader already ends on a rule, and the two
           landed close enough together to read as a double line. */
        <ul >
          {notes.map((note, i) => (
            <Reveal as="li" key={note.slug} delay={i * 60}>
              <Link
                href={`/notes/${note.slug}`}
                /* Content-sized tracks: a 3/12 meta rail is far wider than the
                   short date/reading-time strings it holds, which left a gap
                   before every title. */
                className="group grid grid-cols-1 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_2rem] gap-x-10 gap-y-3 border-b border-border py-8 md:py-10 transition-colors hover:bg-foreground/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:px-4 md:-mx-4 rounded-sm"
              >
                {/* Ordinal + date rail */}
                <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-2">
                  <span
                    aria-hidden
                    className="font-mono text-xs text-muted-foreground tabular-nums"
                  >
                    {String(notes.length - i).padStart(2, "0")}
                  </span>
                  <time
                    dateTime={note.date}
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {formatDate(note.date)}
                  </time>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {note.readingTime}
                  </span>
                </div>

                {/* Title + excerpt */}
                <div>
                  <h2 className="text-2xl md:text-[1.75rem] font-bold tracking-tight leading-snug transition-colors group-hover:text-accent">
                    {note.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-[68ch]">
                    {note.excerpt}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {note.tags.map((tag, t) => (
                        <span key={tag} className="flex items-center gap-2">
                          {tag}
                          {t < note.tags!.length - 1 && (
                            <span aria-hidden className="text-border">·</span>
                          )}
                        </span>
                      ))}
                    </p>
                  )}
                </div>

                {/* Affordance — the row is the link, this just signals it. */}
                <div className="hidden md:flex justify-end items-start pt-1">
                  <ArrowUpRight
                    aria-hidden
                    className="h-5 w-5 text-muted-foreground transition-[transform,color] duration-300 ease-out group-hover:text-accent motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </Container>
  );
}
