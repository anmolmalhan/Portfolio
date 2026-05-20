"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CodeSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".code-line", {
        scrollTrigger: { trigger: ".code-section", start: "top 75%" },
        opacity: 0,
        x: -50,
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
      className="min-h-[100dvh] w-full flex flex-col md:flex-row items-center border-t border-foreground/10 code-section"
    >
      <div className="w-full md:w-1/2 p-12 md:p-24 bg-surface h-full flex flex-col justify-center">
        <ArrowDownRight className="w-16 h-16 mb-12 text-foreground" />
        <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-tighter leading-none">
          It&apos;s never<br />just a<br />website.
        </h2>
        <p className="text-xl md:text-2xl text-[var(--syntax-comment)] max-w-md !leading-snug">
          Every detail matters. I craft digital experiences where design meets logic — built to feel fast, intentional, and ready for production.
        </p>
      </div>
      <div className="w-full md:w-1/2 p-12 md:p-24 bg-background h-full flex flex-col justify-center text-xl md:text-2xl font-mono leading-relaxed">
        <div className="code-line text-[var(--syntax-comment)] mb-4">{"// My Approach"}</div>
        <div className="code-line flex"><span className="text-[var(--syntax-magenta)] mr-4">const</span> craft <span className="text-[var(--syntax-magenta)] mx-4">=</span> {"{"}</div>
        <div className="code-line pl-8 text-[var(--syntax-blue)]">obsession: <span className="text-[var(--syntax-green)]">&quot;Performance&quot;</span>,</div>
        <div className="code-line pl-8 text-[var(--syntax-blue)]">focus: <span className="text-[var(--syntax-green)]">&quot;Interaction Design&quot;</span>,</div>
        <div className="code-line pl-8 text-[var(--syntax-blue)]">typesafe: <span className="text-[var(--syntax-amber)]">true</span></div>
        <div className="code-line">{"};"}</div>
      </div>
    </section>
  );
}
