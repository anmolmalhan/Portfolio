import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full">
        <div className="rounded-xl border border-surface bg-background overflow-hidden shadow-2xl">
          <div className="bg-surface px-4 py-3 flex items-center gap-2 border-b border-surface">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-mono text-[var(--syntax-comment)] mx-auto">
              error.log
            </div>
          </div>
          <div className="p-8 font-mono text-sm space-y-3">
            <div className="text-[var(--syntax-comment)]">
              {"[router] navigating..."}
            </div>
            <div className="text-[var(--syntax-magenta)]">
              {"[error] 404: route not found"}
            </div>
            <div className="text-[var(--syntax-comment)]">
              {"[hint] check the URL or try one of the known routes:"}
            </div>
            <div className="pl-4 pt-2 flex flex-col gap-2">
              <Link
                href="/"
                className="text-[var(--syntax-blue)] hover:underline focus-visible:outline-none focus-visible:underline"
              >
                → /
              </Link>
              <Link
                href="/projects"
                className="text-[var(--syntax-blue)] hover:underline focus-visible:outline-none focus-visible:underline"
              >
                → /projects
              </Link>
              <Link
                href="/about"
                className="text-[var(--syntax-blue)] hover:underline focus-visible:outline-none focus-visible:underline"
              >
                → /about
              </Link>
              <Link
                href="/contact"
                className="text-[var(--syntax-blue)] hover:underline focus-visible:outline-none focus-visible:underline"
              >
                → /contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Terminal className="w-6 h-6 text-accent" /> 404
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-xs uppercase hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
