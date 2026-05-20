import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center page-reveal">
      <p className="font-mono text-sm text-[var(--syntax-comment)] mb-4">{"// 404"}</p>
      <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-6">
        Project not found
      </h1>
      <p className="text-lg text-[var(--syntax-comment)] max-w-md mb-10">
        The case study you tried to open doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-mono text-sm uppercase hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>
    </div>
  );
}
