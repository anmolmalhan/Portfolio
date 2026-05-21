"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const wrap = wrapRef.current;
    if (wrap) wrap.scrollBy({ left: dir * window.innerWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section
      className="h-[100dvh] w-full bg-foreground text-background flex items-center relative"
      aria-label="Selected projects"
    >
      <div
        ref={wrapRef}
        data-lenis-prevent
        className="pin-wrap flex h-[80dvh] items-center px-6 md:px-12 gap-16 md:gap-32 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain pr-[20vw]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        tabIndex={0}
        role="region"
        aria-label="Project carousel. Use arrow keys to navigate."
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          e.currentTarget.scrollBy({ left: dir * window.innerWidth * 0.7, behavior: "smooth" });
        }}
      >
        <div className="w-[85vw] md:w-[60vw] shrink-0 snap-center">
          <div className="text-huge font-bold leading-none uppercase text-background">
            Selected<br />Projects
          </div>
          <div className="h-px w-full bg-background/20 mt-12 mb-8" />
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => scrollBy(-1)}
              className="w-10 h-10 rounded-full border border-background/30 hover:border-background flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => scrollBy(1)}
              className="font-mono text-sm uppercase opacity-70 hover:opacity-100 flex items-center gap-4 text-background transition-opacity cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded-sm"
            >
              Scroll to explore <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {projects.filter((p) => p.featured).map((project, i) => (
          <div
            key={project.id}
            className="w-[85vw] md:w-[60vw] shrink-0 h-full flex flex-col justify-center group relative text-background snap-center"
          >
            <div className="flex font-mono text-sm opacity-50 mb-6 gap-6">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>[ {project.techStack.slice(0, 2).join(" / ")} ]</span>
            </div>

            <Link
              href={`/projects/${project.slug}`}
              className="w-full aspect-video bg-background/5 relative overflow-hidden rounded-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syntax-blue)]"
            >
              <div className="absolute inset-0 border border-background/20 group-hover:border-[var(--syntax-blue)] transition-colors duration-700 z-10 pointer-events-none" />

              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 60vw"
                  className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out"
                />
              ) : (
                <div className="font-mono opacity-20 text-xl group-hover:scale-110 transition-transform duration-1000 ease-out">No Image</div>
              )}
            </Link>

            <div className="flex items-center justify-between mt-8">
              <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter group-hover:text-[var(--syntax-blue)] transition-colors duration-500">
                {project.title}
              </h3>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-background/30 hover:border-[var(--syntax-blue)] text-sm font-mono uppercase tracking-wider text-background hover:text-[var(--syntax-blue)] transition-all z-20 group-hover:bg-[var(--syntax-blue)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syntax-blue)]"
                >
                  Launch App <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <span className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-background/15 text-sm font-mono uppercase tracking-wider text-background/50">
                  Prototype
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
