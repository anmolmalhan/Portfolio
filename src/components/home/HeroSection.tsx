"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line span");
      // Explicitly zero `y` so the CSS-derived pixel translation doesn't
      // stack with `yPercent`. Without this, GSAP reads the CSS rule
      // `transform: translateY(120%)` as a 124px pixel offset, then `yPercent: 120`
      // adds another 120% on top, leaving the spans permanently off-screen.
      gsap.set(lines, { yPercent: 120, y: 0 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-[75dvh] md:h-[100dvh] w-full flex flex-col justify-between pt-24 md:pt-32 pb-14 md:pb-12 px-6 md:px-12 relative overflow-hidden hero-section"
    >
      <div className="absolute top-1/4 right-[10%] w-[40vw] h-[40vw] bg-[var(--syntax-blue)] rounded-full blur-[40px] md:blur-[80px] opacity-10 pointer-events-none hero-glow" />
      <div className="absolute bottom-0 left-[10%] w-[30vw] h-[30vw] bg-[var(--syntax-magenta)] rounded-full blur-[40px] md:blur-[80px] opacity-10 pointer-events-none hero-glow" />

      {/* Top intro band. fills what used to be empty space above the hero text */}
      <div className="z-10 w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-12 items-start">
        <div className="max-w-2xl">
          <div className="font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest mb-3">
            {"// portfolio.v3 · 2026"}
          </div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
            I build product UIs that feel fast and look intentional.
          </h1>
          <p className="mt-3 md:mt-4 font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest">
            React · Next.js · TypeScript · GSAP
          </p>
        </div>
        <div className="hidden md:block font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest text-right space-y-1 pt-1">
          <div>Anmol Malhan</div>
          <div className="text-foreground/60">Rohtak, IN · UTC+5:30</div>
          <div className="text-foreground/60">Available for new work</div>
        </div>
      </div>

      {/* Bottom statement band */}
      <div className="z-10 w-full">
        <div className="flex justify-between items-end mb-6 md:mb-10 border-b border-foreground/20 pb-6 w-full">
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--syntax-green)] rounded-full animate-pulse" />
            Execution Layer
          </div>
          <div className="font-mono text-xs md:text-sm text-[var(--syntax-comment)] hidden sm:block">
            [ Next.js / React / TypeScript ]
          </div>
        </div>

        <div className="flex flex-col text-giant font-bold tracking-tighter">
          <div className="reveal-wrapper hero-line"><span className="block">THINK.</span></div>
          <div className="reveal-wrapper hero-line"><span className="block">CODE.</span></div>
          <div className="reveal-wrapper hero-line"><span className="block text-[var(--syntax-blue)]">SHIP.</span></div>
        </div>
      </div>
    </section>
  );
}
