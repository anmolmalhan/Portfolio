import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Field notes from building interfaces. Bug post-mortems, pattern essays, and engineering trade-offs from real projects.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <div className="max-w-3xl w-full mx-auto px-6 py-20 flex-1 page-reveal">
      <div className="mb-12 border-b border-surface pb-6">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <FileText className="text-accent w-8 h-8" />
          Notes
        </h1>
        <p className="text-[var(--syntax-comment)] max-w-2xl text-lg">
          Field notes from building interfaces. Bug post-mortems, pattern essays,
          and engineering trade-offs from real projects.
        </p>
      </div>

      {notes.length === 0 ? (
        <p className="font-mono text-sm text-[var(--syntax-comment)]">
          {"// no notes yet — first post landing soon"}
        </p>
      ) : (
        <ul className="space-y-10">
          {notes.map((note) => (
            <li key={note.slug} className="group">
              <Link
                href={`/notes/${note.slug}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-2 -m-2"
              >
                <div className="flex items-center gap-3 font-mono text-xs text-[var(--syntax-comment)] uppercase tracking-widest mb-3">
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
                <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight group-hover:text-[var(--syntax-blue)] transition-colors">
                  {note.title}
                </h2>
                <p className="text-[var(--syntax-comment)] text-lg mb-3 leading-relaxed">
                  {note.excerpt}
                </p>
                <span className="font-mono text-sm text-[var(--syntax-blue)] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read note <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
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
