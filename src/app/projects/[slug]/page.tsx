import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} · Anmol Malhan`,
      description: project.shortDescription,
      // og:image is auto-attached by src/app/projects/[slug]/opengraph-image.tsx
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full relative bg-background text-foreground page-reveal min-h-screen">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--syntax-blue)] rounded-full blur-[80px] md:blur-[200px] opacity-[0.03] pointer-events-none" />

      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <Link href="/projects" className="inline-flex items-center gap-2 text-[var(--syntax-comment)] hover:text-foreground font-mono text-sm transition-colors cursor-pointer group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span>cd ..</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 mb-20" style={{ viewTransitionName: `project-${project.slug}` } as React.CSSProperties}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-foreground/10 pb-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-xs font-mono px-4 py-1.5 rounded-full bg-foreground text-background">
                {project.role}
              </span>
              {project.techStack.map(tech => (
                <span key={tech} className="text-xs font-mono px-4 py-1.5 rounded-full border border-surface text-[var(--syntax-green)] bg-surface/30 md:backdrop-blur-md">
                  {tech}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase leading-none" style={{ viewTransitionName: `title-${project.slug}` } as React.CSSProperties}>
              {project.title}
            </h1>
            <p className="text-2xl md:text-3xl text-[var(--syntax-comment)] max-w-3xl leading-snug font-light">
              {project.shortDescription}
            </p>
          </div>

          {/* Quick Launch + Source — render only when the URLs exist.
              Private prototypes can omit both and the page stays clean. */}
          <div className="shrink-0 pb-2">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-[var(--syntax-blue)] text-white overflow-hidden rounded-full font-mono font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Quick Launch
              </a>
            ) : (
              <div className="flex items-center justify-center gap-3 px-8 py-5 border border-foreground/15 text-[var(--syntax-comment)] rounded-full font-mono text-sm uppercase tracking-wider">
                Prototype — not yet public
              </div>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 font-mono text-sm text-[var(--syntax-comment)] hover:text-foreground transition-colors"
              >
                <Code className="w-4 h-4" /> View Source Code
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Feature Image */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="w-full aspect-[21/9] lg:aspect-[2.5/1] bg-surface overflow-hidden relative"
             style={{ viewTransitionName: `image-${project.slug}` } as React.CSSProperties}>
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} Interface`}
              fill
              sizes="(max-width: 1024px) 100vw, 1280px"
              priority
              className="object-cover opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-[var(--syntax-comment)] bg-surface-hover/50">
               Hero Image Placeholder
            </div>
          )}
        </div>
      </div>

      {/* Case Study Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-32">
        <div className="prose prose-invert prose-xl max-w-none prose-p:text-[var(--syntax-comment)] prose-p:leading-relaxed prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight">
          <h2 className="text-4xl uppercase mb-8 border-b border-foreground/10 pb-4">Architectural Overview</h2>
          <p>{project.content}</p>
          <div className="my-12 p-8 border border-[var(--syntax-blue)]/20 bg-[var(--syntax-blue)]/5 rounded-xl">
            <h3 className="text-2xl font-mono text-[var(--syntax-blue)] mb-4 mt-0">Stack</h3>
            <p className="text-lg m-0">
              Built with {project.techStack.join(", ")}. Role: {project.role}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
