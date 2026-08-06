import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Container } from "@/components/ui/Container";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

  const featureImageAspect =
    project.detailImageAspect === "video" ? "aspect-video" : "aspect-[21/9] lg:aspect-[2.5/1]";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: `${siteUrl}/projects/${project.slug}`,
    author: { "@type": "Person", name: "Anmol Malhan", url: siteUrl },
    keywords: project.techStack.join(", "),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };

  return (
    <div className="w-full relative bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--syntax-blue)] rounded-full blur-[80px] md:blur-[200px] opacity-[0.03] pointer-events-none" />

      {/* Navigation Header */}
      <Container size="content" className="pt-28 pb-8">
        <Link href="/projects" className="inline-flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors cursor-pointer group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span>cd ..</span>
        </Link>
      </Container>

      {/* Hero Section */}
      <Container size="content" className="mt-12 mb-20" style={{ viewTransitionName: `project-${project.slug}` } as React.CSSProperties}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-border pb-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-xs font-mono px-4 py-1.5 rounded-full bg-foreground text-background">
                {project.role}
              </span>
              {project.techStack.map(tech => (
                <span key={tech} className="text-xs font-mono px-4 py-1.5 rounded-full border border-border text-muted-foreground bg-muted/40 md:backdrop-blur-md">
                  {tech}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter uppercase leading-none" style={{ viewTransitionName: `title-${project.slug}` } as React.CSSProperties}>
              {project.title}
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl leading-snug font-light">
              {project.shortDescription}
            </p>
          </div>

          {/* Quick Launch + Source. render only when the URLs exist.
              Private prototypes can omit both and the page stays clean. */}
          <div className="shrink-0 pb-2">
            {project.liveUrl ? (
              <Magnetic strength={0.3}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-[var(--syntax-blue)] text-background overflow-hidden rounded-full font-mono font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Quick Launch
                </a>
              </Magnetic>
            ) : (
              <div className="flex items-center justify-center gap-3 px-8 py-5 border border-border text-muted-foreground rounded-full font-mono text-sm uppercase tracking-wider">
                Prototype · not yet public
              </div>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 py-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code className="w-4 h-4" /> View Source Code
              </a>
            )}
          </div>
        </div>
      </Container>

      {/* Main Feature Image */}
      <Container size="content" className="mb-32">
        <div className={`w-full ${featureImageAspect} bg-muted overflow-hidden relative`}
             style={{ viewTransitionName: `image-${project.slug}` } as React.CSSProperties}>
          {/* No empty-state branch: `image` is a required string on Project, so
              the fallback that used to sit here was unreachable. If the field
              ever becomes optional, the placeholder needs to come back with it. */}
          <Image
            src={project.image}
            alt={`${project.title} Interface`}
            fill
            sizes="(max-width: 1024px) 100vw, 1280px"
            priority
            className="object-cover opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out"
          />
        </div>
      </Container>

      {/* Case Study Content */}
      <Container size="content" className="pb-32"><div className="max-w-4xl">
        <Reveal
          as="p"
          className="text-2xl md:text-3xl text-foreground/90 leading-snug font-light mb-12 md:mb-16"
        >
          {project.summary}
        </Reveal>

        {project.metrics && project.metrics.length > 0 && (
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 md:mb-20 border-y border-border py-8">
            {project.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 90}>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {m.label}
                </dt>
                <dd className="text-xl md:text-2xl font-semibold text-foreground">
                  {m.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        )}

        <div className="space-y-16 md:space-y-20">
          {project.sections.map((section, i) => (
            <Reveal as="section" key={section.heading}>
              <div className="flex items-baseline gap-4 mb-6 md:mb-8">
                <span className="font-mono text-sm text-[var(--syntax-blue)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <SplitReveal
                  as="h2"
                  text={section.heading}
                  className="text-3xl md:text-4xl font-bold uppercase tracking-tight"
                />
              </div>
              <div className="space-y-5 text-lg md:text-xl text-muted-foreground leading-relaxed border-l-2 border-border pl-6 md:pl-8">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 p-8 border border-[var(--syntax-blue)]/20 bg-[var(--syntax-blue)]/5 rounded-xl">
          <h3 className="text-xl font-mono text-[var(--syntax-blue)] mb-3">Stack</h3>
          <p className="text-lg text-foreground/80">
            Built with {project.techStack.join(", ")}. Role: {project.role}.
          </p>
        </Reveal>
      </div>
    </Container>
    </div>
  );
}
