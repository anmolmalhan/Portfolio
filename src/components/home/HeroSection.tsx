"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      className="min-h-[75dvh] md:h-[100dvh] w-full flex flex-col justify-end pb-14 md:pb-12 px-6 md:px-12 relative overflow-hidden hero-section"
    >
      <div className="absolute top-1/4 right-[10%] w-[40vw] h-[40vw] bg-[var(--syntax-blue)] rounded-full blur-[40px] md:blur-[80px] opacity-10 pointer-events-none hero-glow" />
      <div className="absolute bottom-0 left-[10%] w-[30vw] h-[30vw] bg-[var(--syntax-magenta)] rounded-full blur-[40px] md:blur-[80px] opacity-10 pointer-events-none hero-glow" />

      <div className="z-10 w-full pt-20 md:pt-32">
        <div className="flex justify-between items-end mb-6 md:mb-16 border-b border-foreground/20 pb-6 w-full">
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--syntax-green)] rounded-full animate-pulse" />
            Execution Layer
          </div>
          <div className="font-mono text-xs md:text-sm text-[var(--syntax-comment)] hidden sm:block">
            [ Next.js / React / TypeScript ]
          </div>
        </div>

        <div className="flex flex-col text-giant font-bold tracking-tighter">
          <div className="reveal-wrapper hero-line"><span className="block">THINK</span></div>
          <div className="flex items-center gap-8 md:gap-16">
            <div className="reveal-wrapper hero-line"><span className="block italic font-serif opacity-80">&</span></div>
            <div className="reveal-wrapper hero-line"><span className="block ml-[5vw]">CODE</span></div>
          </div>
          <div className="reveal-wrapper hero-line"><span className="block text-[var(--syntax-blue)]">SCALE</span></div>
        </div>
      </div>
    </section>
  );
}
