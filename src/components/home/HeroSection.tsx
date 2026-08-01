"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowDownRight } from "lucide-react";
import { prefersReducedMotion, useMediaQuery } from "@/lib/motion";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

gsap.registerPlugin(SplitText);

const RobotHero = dynamic(() => import("./RobotHero"), { ssr: false });

const ROLES = siteConfig.roles;
const NOW_BUILDING = projects.filter((p) => p.featured).slice(0, 3);

/**
 * The hero is composed as three bands with nothing floating between them:
 *
 *   1. IDENTITY RAIL — who, what, and availability, in one mono line.
 *   2. STATEMENT     — the giant THINK / CODE / SHIP lockup plus one line of
 *                      positioning copy. This is the only thing competing for
 *                      attention.
 *   3. SPEC GRID     — now-building / stack / based, as hairline-separated
 *                      columns that read like a spec sheet.
 *
 * The previous version stacked six independently-styled blocks down the left
 * edge, each with its own mono label, so nothing was dominant and the eye had
 * no entry point. The robot also sat *behind* the tech-stack line, which made
 * that text unreadable — it now occupies its own column and the type never
 * crosses it.
 */
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  // The robot is a desktop-only luxury: don't spend a single mobile byte on it.
  const showRobot = useMediaQuery("(min-width: 768px)");

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Entrance: supporting blocks rise into place in a stagger.
      // NOTE: transform-only (no opacity fade) so the largest hero text is
      // painted immediately — fading it in from opacity:0 delays Largest
      // Contentful Paint (it counts an invisible element as "not painted").
      gsap.from(".hero-fade", {
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      });

      // Signature reveal: THINK/CODE/SHIP chars rise out of the clipped line
      // while a blur resolves. SplitText (3.13+) handles aria automatically.
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line span");
      gsap.set(lines, { yPercent: 0, y: 0 });
      const split = SplitText.create(lines, { type: "chars" });
      gsap.fromTo(
        split.chars,
        { yPercent: 115, opacity: 0, filter: "blur(6px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.15,
          stagger: 0.03,
          ease: "power4.out",
          delay: 0.35,
        },
      );

      // Hairline rules draw themselves in, left to right.
      gsap.from(".hero-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.inOut",
        delay: 0.5,
      });

      // Rotating role: whole-line slides so word spacing survives. One title
      // visible at a time; screen-reader silent (an sr-only line carries it).
      const roles = gsap.utils.toArray<HTMLElement>(".role-line");
      gsap.set(roles, { yPercent: 120, y: 0 });
      const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
      roles.forEach((el) => {
        tl.to(el, { yPercent: 0, duration: 0.5, ease: "power3.out" }).to(
          el,
          { yPercent: -120, duration: 0.5, ease: "power3.in" },
          "+=1.8",
        );
      });

      // (Intentionally no scroll-parallax here — per-frame scroll effects on
      // blurred/canvas layers were a stutter source. The hero glows stay put;
      // the section scrolls away as one cheap composited layer.)
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[92dvh] md:min-h-[100dvh] w-full flex flex-col overflow-hidden hero-section"
    >
      {/* Atmosphere. A single directional accent wash instead of the previous
          two saturated blobs — at light-mode opacities those read as muddy
          pink/purple smudges over the near-white background. */}
      <div className="absolute inset-0 hero-wash pointer-events-none" />
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      <Container className="relative z-10 flex flex-1 flex-col pt-28 md:pt-32 pb-10">
        {/* ── Band 1 — identity rail ─────────────────────────────────────── */}
        <div className="hero-fade flex items-start justify-between gap-6 font-mono text-xs md:text-[13px] uppercase tracking-widest">
          <p className="flex flex-nowrap items-center gap-x-3 whitespace-nowrap min-w-0">
            <span className="text-foreground">{siteConfig.name}</span>
            <span className="text-border">/</span>
            <span className="sr-only">{ROLES.join(" · ")}</span>
            <span aria-hidden className="role-slot relative inline-block overflow-hidden h-[1.3em] align-bottom text-muted-foreground">
              {ROLES.map((role) => (
                <span
                  key={role}
                  className="role-line absolute inset-0 whitespace-nowrap leading-[1.3em]"
                >
                  {role}
                </span>
              ))}
              <span className="invisible whitespace-nowrap block h-0 leading-none" aria-hidden>
                {ROLES.reduce((a, b) => (a.length >= b.length ? a : b))}
              </span>
            </span>
          </p>

          <p className="hidden sm:flex items-center gap-2 shrink-0 text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--syntax-green)] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--syntax-green)]" />
            </span>
            {siteConfig.availability}
          </p>
        </div>

        <div className="hero-rule mt-5 h-px w-full bg-border" />

        {/* ── Band 2 — the statement ─────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-y-10 items-center py-10 md:py-0">
          <div className="md:col-span-7 lg:col-span-6">
            {/* role="img" + aria-label so the per-character SplitText spans read
                as three words, not a stream of letters — and so the aria-label
                SplitText adds is valid (it's prohibited on a bare span). */}
            {/* A div, not the h1. The lockup is the visual centrepiece but it
                reads as three words with no descriptive content — a poor page
                heading for search results and for anyone navigating by
                headings. The positioning line below carries the h1 instead;
                size does not determine heading level. */}
            <div className="flex flex-col text-giant font-bold tracking-tighter">
              <span className="reveal-wrapper hero-line">
                <span className="block" role="img" aria-label="Think.">THINK.</span>
              </span>
              <span className="reveal-wrapper hero-line">
                <span className="block" role="img" aria-label="Code.">CODE.</span>
              </span>
              <span className="reveal-wrapper hero-line">
                <span className="block text-accent" role="img" aria-label="Ship.">SHIP.</span>
              </span>
            </div>

            <h1 className="hero-fade mt-7 max-w-md text-base md:text-lg leading-relaxed font-normal text-muted-foreground">
              {siteConfig.tagline}{" "}
              <span className="text-foreground">
                Freelance &amp; full-time. Marketplaces, dashboards, and tools that
                load fast on real devices.
              </span>
            </h1>

            <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 ease-out motion-safe:hover:scale-[1.03]"
              >
                View work
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5"
              >
                Start a project
              </Link>
            </div>
          </div>

          {/* The robot gets its own column so no type is ever laid over it.
              The column is ALWAYS rendered and sized, with visibility handled
              in CSS — only the canvas inside is gated on `showRobot`. Gating
              the wrapper itself meant the column popped into the grid when
              useMediaQuery resolved after hydration, resizing the row and
              costing 0.059 CLS. (It never mattered when the robot was
              absolutely positioned and out of flow.) */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6 relative h-[46vh] lg:h-[58vh] robot-wrap">
            {showRobot && <RobotHero />}
          </div>
        </div>

        {/* ── Band 3 — spec grid ─────────────────────────────────────────── */}
        <div className="hero-fade mt-auto">
          <div className="hero-rule h-px w-full bg-border" />
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="py-5 sm:pr-8">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Now building
              </dt>
              <dd className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-2">
                {/* Separator trails its item so a wrap can't strand a leading
                    "·" at the start of the next line. */}
                {NOW_BUILDING.map((p, i) => (
                  <span key={p.id} className="flex items-center gap-2">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="py-2 font-mono text-xs uppercase tracking-wide text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                    >
                      {p.title}
                    </Link>
                    {i < NOW_BUILDING.length - 1 && (
                      <span aria-hidden className="hidden sm:inline text-border">·</span>
                    )}
                  </span>
                ))}
              </dd>
            </div>

            <div className="py-5 sm:px-8">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Stack
              </dt>
              <dd className="mt-2 font-mono text-xs uppercase tracking-wide text-foreground/80">
                {siteConfig.stack.join(" · ")}
              </dd>
            </div>

            <div className="py-5 sm:pl-8">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Based
              </dt>
              <dd className="mt-2 font-mono text-xs uppercase tracking-wide text-foreground/80">
                {siteConfig.location.city}, {siteConfig.location.country} ·{" "}
                {siteConfig.location.timezone}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
