"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion, useMediaQuery } from "@/lib/motion";
import { projects } from "@/data/projects";

gsap.registerPlugin(SplitText);

const RobotHero = dynamic(() => import("./RobotHero"), { ssr: false });

const ROLES = ["Frontend Developer", "Interaction Designer", "Product Builder"];
const NOW_BUILDING = projects.filter((p) => p.featured).slice(0, 3);

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  // The robot is a desktop-only luxury: don't spend a single mobile byte on it.
  const showRobot = useMediaQuery("(min-width: 768px)");

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Entrance: the top/middle text blocks fade up in a stagger under the
      // headline's char reveal.
      gsap.from(".hero-fade", {
        y: 22,
        opacity: 0,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.1,
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
      className="min-h-[85dvh] md:h-[100dvh] w-full flex flex-col justify-between pt-24 md:pt-28 pb-14 md:pb-10 px-6 md:px-12 relative overflow-hidden hero-section"
    >
      {/* Atmosphere: soft accent vignette + two drifting colour glows. */}
      <div className="absolute inset-0 hero-vignette pointer-events-none" />
      <div className="absolute top-[18%] right-[8%] w-[38vw] h-[38vw] bg-[var(--syntax-blue)] rounded-full blur-[55px] md:blur-[64px] opacity-[0.14] pointer-events-none hero-glow" />
      <div className="absolute -bottom-[6%] left-[4%] w-[30vw] h-[30vw] bg-[var(--syntax-magenta)] rounded-full blur-[55px] md:blur-[64px] opacity-[0.13] pointer-events-none hero-glow" />

      {/* Desktop companion: waves on load, tracks the cursor, emotes on click.
          Enlarged and vertically anchored so it co-stars with the type. */}
      {showRobot && (
        <div className="absolute right-0 lg:right-[3vw] bottom-0 w-[50vw] max-w-[680px] h-[82vh] z-[5] robot-wrap">
          <RobotHero />
        </div>
      )}

      {/* Top intro band */}
      <div className="z-10 w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-12 items-start">
        <div className="max-w-2xl">
          <div className="hero-fade font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest mb-3">
            {"// portfolio.v4 · 2026"}
          </div>
          <h1 className="hero-fade text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
            I build product UIs that feel fast and look intentional.
          </h1>
          <p className="hero-fade mt-3 md:mt-4 font-mono text-xs md:text-sm uppercase tracking-widest text-[var(--syntax-comment)]">
            <span className="sr-only">{ROLES.join(" · ")}</span>
            <span aria-hidden className="flex items-center gap-2">
              <span className="text-[var(--accent)]">{">"}</span>
              <span className="role-slot relative inline-block overflow-hidden h-[1.3em] align-bottom">
                {ROLES.map((role) => (
                  <span
                    key={role}
                    className="role-line absolute inset-0 whitespace-nowrap leading-[1.3em] text-foreground"
                  >
                    {role}
                  </span>
                ))}
                <span className="invisible whitespace-nowrap block h-0 leading-none" aria-hidden>
                  {ROLES.reduce((a, b) => (a.length >= b.length ? a : b))}
                </span>
              </span>
            </span>
          </p>
        </div>
        <div className="hero-fade hidden md:block font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest text-right space-y-1 pt-1">
          <div>Anmol Malhan</div>
          <div className="text-foreground/60">Rohtak, IN · UTC+5:30</div>
          <div className="text-foreground/60">Available for new work</div>
        </div>
      </div>

      {/* Middle band — fills what used to be dead space with real substance:
          a positioning line + the projects currently in flight. */}
      <div className="hero-fade z-10 max-w-md">
        <p className="text-sm text-foreground/55 leading-relaxed">
          Freelance & full-time. I ship marketplaces, dashboards, and tools that
          load fast on real devices and feel considered end to end.
        </p>
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--syntax-comment)] mr-1">
            Now building
          </span>
          {NOW_BUILDING.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-foreground/15 text-foreground/70 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              {p.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom statement band */}
      <div className="z-10 w-full">
        <div className="hero-fade flex justify-between items-end mb-5 md:mb-8 border-b border-foreground/20 pb-5 w-full">
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--syntax-green)] rounded-full animate-pulse" />
            Execution Layer
          </div>
          <div className="font-mono text-xs md:text-sm text-[var(--syntax-comment)] hidden sm:block">
            [ Next.js / React / TypeScript ]
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col text-giant font-bold tracking-tighter">
            <div className="reveal-wrapper hero-line"><span className="block">THINK.</span></div>
            <div className="reveal-wrapper hero-line"><span className="block">CODE.</span></div>
            <div className="reveal-wrapper hero-line"><span className="block text-[var(--syntax-blue)]">SHIP.</span></div>
          </div>
          {/* Scroll cue */}
          <div className="hero-fade hidden md:flex flex-col items-center gap-2 pb-3 text-[var(--syntax-comment)]">
            <span className="font-mono text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
              Scroll
            </span>
            <span className="scroll-cue block w-px h-10 bg-gradient-to-b from-[var(--accent)] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
