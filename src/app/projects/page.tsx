import type { Metadata } from "next";
import { projects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Anmol Malhan. Interfaces and applications focused on performance, interaction design, and clean architecture.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <Container className="py-28 md:py-32 flex-1">
      <PageHeader
        eyebrow="selected work"
        title="Projects"
        description="A collection of interfaces and applications I've built, focused on performance, interaction design, and clean code architecture."
      />

      <div className="grid grid-cols-1 gap-12">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 80}>
          <Tilt
            className="group flex flex-col md:flex-row gap-8 items-center bg-card border border-border/60 hover:border-border p-6 rounded-2xl [transition:box-shadow_300ms_ease-out,border-color_300ms_ease-out,background-color_300ms_ease-out,transform_300ms_ease-out] hover:shadow-xl hover:shadow-black/5"
            style={{ viewTransitionName: `project-${project.slug}` } as React.CSSProperties}
          >
            <Link href={`/projects/${project.slug}`} className="w-full md:w-1/2 aspect-video bg-muted overflow-hidden rounded-xl relative border border-border group-hover:border-accent/40 transition-colors block"
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
                   <div className="w-full h-full flex items-center justify-center font-mono text-muted-foreground bg-muted">
                     No Image
                   </div>
                 )}
            </Link>
            <div className="w-full md:w-1/2 py-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                {project.techStack.map(tech => (
                  <Badge key={tech} variant="secondary" className="font-mono font-normal text-muted-foreground">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className="block">
                <h2 className="text-3xl font-bold mb-4 group-hover:text-[var(--syntax-blue)] transition-colors inline-block" 
                    style={{ viewTransitionName: `title-${project.slug}` } as React.CSSProperties}>
                  {project.title}
                </h2>
              </Link>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{project.shortDescription}</p>
              <div className="flex items-center gap-6 mt-6">
                <Link href={`/projects/${project.slug}`} className="font-mono text-sm text-[var(--syntax-blue)] flex items-center gap-2 group/link cursor-pointer">
                  <span>View Case Study</span>
                  <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                </Link>
                {project.liveUrl && (
                  <>
                    <div className="h-4 w-px bg-border" />
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 group/external transition-colors"
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
          </Tilt>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
