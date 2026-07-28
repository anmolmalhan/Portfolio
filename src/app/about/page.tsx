import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GitHubActivity from "@/components/about/GitHubActivity";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Anmol Malhan, frontend developer in Rohtak, Haryana. Building polished, performance-driven web experiences with React, Next.js, and TypeScript.",
  alternates: { canonical: "/about" },
};

const MINDSET = [
  {
    title: "What I build",
    desc: "Performance-driven frontend apps, interactive dashboards, and landing pages. I enjoy the space where design meets logic — code that balances readability, performance, and design precision.",
  },
  {
    title: "Currently learning",
    desc: "Advanced Next.js patterns, backend integration, and system design.",
  },
  {
    title: "Beyond code",
    desc: "Maintaining discipline, consistency, problem-solving, and staying fit.",
  },
];

export default function AboutPage() {
  return (
    <Container size="content" className="py-28 md:py-32 flex-1">
      <PageHeader
        eyebrow="studio"
        title="About"
        description="I design clean interfaces and build them with production-ready code."
      />

      {/* Bio + portrait.
          Sized by CONTENT, not by fractions of the full container. A 7/12
          column is ~870px here, but the prose is capped at a readable ~62ch
          (~620px) and the portrait was pushed to the far edge with ml-auto —
          so both columns carried slack and the two pockets compounded into a
          ~490px hole down the middle. The text column is now just wide enough
          for its measure and the portrait track is a fixed 420px. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-10 lg:gap-16 items-start">
        <div className="rise order-last lg:order-first">
          <div className="space-y-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            <p>
              I&rsquo;m Anmol, a front-end developer passionate about building visually
              polished web experiences. I work mainly with React, Next.js, and
              Tailwind CSS to create clean interfaces that are maintainable for
              developers and fast for users.
            </p>
            <p>
              I enjoy turning ideas into structured, reusable UI systems. My goal is
              to build digital products that feel smooth, intentional, and ready for
              real-world use.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 ease-out motion-safe:hover:scale-[1.03]"
              >
                View projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground/40 hover:bg-foreground/5"
              >
                Let&apos;s work together
              </Link>
            </Magnetic>
          </div>

          {/* Spec rail sits under the copy rather than under the portrait: it
              gives the text column the height to stand level with the image
              instead of leaving a void beneath the buttons. */}
          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-y border-border">
            <div className="py-4 sm:pr-6">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Based
              </dt>
              <dd className="mt-1.5 font-mono text-xs uppercase tracking-wide">
                {siteConfig.location.city}, {siteConfig.location.region}
              </dd>
            </div>
            <div className="py-4 sm:px-6">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1.5 font-mono text-xs uppercase tracking-wide">
                {siteConfig.role}
              </dd>
            </div>
            <div className="py-4 sm:pl-6 col-span-2 sm:col-span-1">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Stack
              </dt>
              <dd className="mt-1.5 font-mono text-xs uppercase tracking-wide">
                {siteConfig.stack.join(" · ")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rise w-full" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
          <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src="/profile.jpg"
              alt="Anmol Malhan, Frontend Developer"
              fill
              className="object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 motion-safe:group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 420px"
              quality={68}
              priority
            />
          </div>
        </div>
      </div>

      {/* Mindset — numbered index rows, same pattern as the notes list. */}
      <section className="mt-24 md:mt-32" aria-labelledby="mindset-heading">
        <h2
          id="mindset-heading"
          className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-8"
        >
          {"// the builder's mindset"}
        </h2>
        <ul className="border-t border-border">
          {MINDSET.map((block, i) => (
            <Reveal as="li" key={block.title} delay={i * 80}>
              {/* Content-sized tracks, not 12ths: a 4/12 title track is ~500px
                  wide while "What I build" is ~110px, which reopened the same
                  gap the bio had. */}
              <div className="grid grid-cols-1 md:grid-cols-[2.5rem_minmax(0,15rem)_minmax(0,1fr)] gap-x-8 gap-y-2 border-b border-border py-8">
                <span
                  aria-hidden
                  className="font-mono text-xs text-muted-foreground tabular-nums pt-1.5"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-bold tracking-tight">{block.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {block.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <Reveal>
        <GitHubActivity username={siteConfig.githubUsername} />
      </Reveal>
    </Container>
  );
}
