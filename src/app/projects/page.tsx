import type { Metadata } from "next";
import { projects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Anmol Malhan. Interfaces and applications focused on performance, interaction design, and clean architecture.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-20 flex-1 page-reveal">
      <div className="mb-12 border-b border-surface pb-6">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <FolderGit2 className="text-accent w-8 h-8" />
          Projects
        </h1>
        <p className="text-[var(--syntax-comment)] max-w-2xl text-lg">
          A collection of interfaces and applications I&apos;ve built. Focusing on performance,
          interaction design, and clean code architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="group flex flex-col md:flex-row gap-8 items-center bg-surface/20 border border-transparent hover:border-surface p-6 rounded-2xl transition-colors"
            style={{ viewTransitionName: `project-${project.slug}` } as React.CSSProperties}
          >
            <Link href={`/projects/${project.slug}`} className="w-full md:w-1/2 aspect-video bg-surface overflow-hidden rounded-xl relative border border-surface group-hover:border-accent/40 transition-colors block"
                 style={{ viewTransitionName: `image-${project.slug}` } as React.CSSProperties}>
                 {project.image ? (
                   <Image
                     src={project.image}
                     alt={project.title}
                     fill
                     sizes="(max-width: 768px) 100vw, 50vw"
                     className="object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center font-mono text-[var(--syntax-comment)] bg-surface-hover/50">
                     No Image
                   </div>
                 )}
            </Link>
            <div className="w-full md:w-1/2 py-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                {project.techStack.map(tech => (
                  <span key={tech} className="text-xs font-mono px-2 py-1 rounded bg-background border border-surface text-[var(--syntax-green)]">
                    {tech}
                  </span>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className="block">
                <h2 className="text-3xl font-bold mb-4 group-hover:text-[var(--syntax-blue)] transition-colors inline-block" 
                    style={{ viewTransitionName: `title-${project.slug}` } as React.CSSProperties}>
                  {project.title}
                </h2>
              </Link>
              <p className="text-[var(--syntax-comment)] mb-6 text-lg">{project.shortDescription}</p>
              <div className="flex items-center gap-6 mt-6">
                <Link href={`/projects/${project.slug}`} className="font-mono text-sm text-[var(--syntax-blue)] flex items-center gap-2 group/link cursor-pointer">
                  <span>View Case Study</span>
                  <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                </Link>
                {project.liveUrl && (
                  <>
                    <div className="h-4 w-px bg-surface-hover" />
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-[var(--syntax-comment)] hover:text-foreground flex items-center gap-2 group/external transition-colors"
                    >
                      Launch App
                      <svg className="w-3 h-3 group-hover/external:-translate-y-0.5 group-hover/external:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
