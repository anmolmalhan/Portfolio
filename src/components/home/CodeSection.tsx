"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import { Container } from "@/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

/**
 * Statement + code panel.
 *
 * This was previously two full-height halves with different backgrounds meeting
 * at a hard vertical seam down the middle of the viewport — the left half bled
 * to the window edge, ignoring the page's container, and the right half was
 * mostly empty space. It's now a single section on the shared spine: the
 * statement occupies five columns, the code sits in a proper panel across the
 * remaining seven.
 */
export default function CodeSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = ref.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(".code-line", {
        // Pass the element directly. selector lookups inside gsap.context
        // are scoped to the section itself, which can't match its own class.
        scrollTrigger: { trigger: section, start: "top 75%" },
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full border-t border-border py-24 md:py-36 code-section"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Statement */}
          <div className="md:col-span-5">
            <ArrowDownRight className="mb-8 h-10 w-10 text-muted-foreground" aria-hidden />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[0.95]">
              It&apos;s never
              <br />
              just a
              <br />
              website.
            </h2>
            <p className="mt-6 max-w-md text-lg md:text-xl leading-snug text-muted-foreground">
              Every detail matters. I build digital experiences where design meets
              logic. Fast, intentional, ready for production.
            </p>
          </div>

          {/* Code panel */}
          <div className="md:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-10 font-mono text-base md:text-xl leading-relaxed">
              <div className="code-line text-muted-foreground mb-4">{"// My Approach"}</div>
              <div className="code-line flex flex-wrap">
                <span className="text-[var(--syntax-magenta)] mr-3">const</span> craft
                <span className="text-[var(--syntax-magenta)] mx-3">=</span> {"{"}
              </div>
              <div className="code-line pl-6 text-[var(--syntax-blue)]">
                obsession: <span className="text-[var(--syntax-green)]">&quot;Performance&quot;</span>,
              </div>
              <div className="code-line pl-6 text-[var(--syntax-blue)]">
                focus: <span className="text-[var(--syntax-green)]">&quot;Interaction Design&quot;</span>,
              </div>
              <div className="code-line pl-6 text-[var(--syntax-blue)]">
                typesafe: <span className="text-[var(--syntax-amber)]">true</span>
              </div>
              <div className="code-line">{"};"}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
