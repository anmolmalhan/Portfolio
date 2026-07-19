"use client";

import { useEffect, useRef, useState, Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import type { TechBall } from "./TechPhysics";

const TechPhysics = dynamic(() => import("./TechPhysics"), { ssr: false });

const BALLS: TechBall[] = [
  { label: "React", accent: true },
  { label: "Next.js", accent: true },
  { label: "TypeScript" },
  { label: "GSAP" },
  { label: "Tailwind CSS" },
  { label: "Node.js" },
  { label: "JavaScript" },
  { label: "Vercel" },
  { label: "Hono" },
  { label: "Drizzle" },
  { label: "Bun" },
  { label: "Git" },
];

/** If WebGL blows up for any reason, quietly fall back to the static grid. */
class CanvasBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function FallbackGrid() {
  return (
    <ul className="flex flex-wrap gap-3 md:gap-4 max-w-3xl" aria-label="Technologies">
      {BALLS.map((ball, i) => (
        <Reveal
          as="li"
          key={ball.label}
          delay={i * 40}
          className={`font-mono text-sm md:text-base px-5 py-2.5 rounded-full border ${
            ball.accent
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-foreground/20 text-foreground/80"
          }`}
        >
          {ball.label}
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * The tech stack as a toy: zero-gravity spheres you shove around with the
 * cursor. Desktop-with-mouse only — mobile, reduced-motion, and any WebGL
 * failure all get a clean chip grid instead. The canvas mounts only once the
 * section approaches the viewport so the physics engine stays out of the
 * critical path.
 */
export default function TechPlayground() {
  const ref = useRef<HTMLElement>(null);
  const capable = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const [near, setNear] = useState(false);
  // SSR + incapable devices render the chip grid; capable desktops swap to
  // the canvas once the section approaches the viewport.
  const mode = !capable || reduced ? "fallback" : near ? "canvas" : "pending";

  useEffect(() => {
    const el = ref.current;
    if (!el || !capable || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [capable, reduced]);

  return (
    <section
      ref={ref}
      id="stack"
      aria-label="Tech stack"
      className="w-full bg-background border-t border-foreground/10 relative overflow-hidden"
    >
      <div className="px-6 md:px-12 pt-16 md:pt-24 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest mb-3">
            {"// dependencies I actually deploy"}
          </div>
          <h2 className="text-huge font-bold tracking-tighter uppercase leading-none">
            The Stack
          </h2>
        </div>
        {mode === "canvas" && (
          <div className="font-mono text-xs md:text-sm text-[var(--syntax-comment)] uppercase tracking-widest">
            [ drag your cursor through it ]
          </div>
        )}
      </div>

      {mode === "canvas" ? (
        <div className="h-[65dvh] min-h-[420px] w-full">
          <CanvasBoundary fallback={<div className="px-6 md:px-12 py-16"><FallbackGrid /></div>}>
            <TechPhysics />
          </CanvasBoundary>
        </div>
      ) : (
        <div className="px-6 md:px-12 py-16">
          <FallbackGrid />
        </div>
      )}
    </section>
  );
}
