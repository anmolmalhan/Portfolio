"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterReveal() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Observe both the sentinel (catches early reveal on tall viewports) and
    // the footer itself (catches the case where the footer is visually visible
    // before the sentinel intersects).
    const sentinel = sentinelRef.current;
    const footer = footerRef.current;
    const targets = [sentinel, footer].filter(Boolean) as Element[];
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Visible if any observed target is intersecting.
        const anyVisible = entries.some((e) => e.isIntersecting) ||
          targets.some((t) => {
            const r = (t as HTMLElement).getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          });
        setVisible(anyVisible);
      },
      { threshold: 0.1, rootMargin: "-10% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const footer = footerRef.current;
    if (!footer) return;
    const ctx = gsap.context(() => {
      gsap.from(".footer-giant-text", {
        scrollTrigger: {
          // Pass the element directly. selector lookups inside gsap.context
          // are scoped to the footer itself, which can't match its own tag.
          trigger: footer,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
        y: -100,
        opacity: 0.5,
        force3D: true,
      });
    }, footerRef);

    // Refresh after the layout settles: fonts loaded + window load complete.
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    if ("fonts" in document) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-[100dvh] w-full pointer-events-none" aria-hidden />

      <footer
        ref={footerRef}
        inert={!visible}
        aria-hidden={!visible}
        className="fixed bottom-0 left-0 h-[100dvh] w-full flex flex-col justify-between bg-black text-white -z-10 pt-24 md:pt-32 pb-12 px-6 md:px-12 pointer-events-auto overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--syntax-blue)]/5 to-transparent pointer-events-none" />

        {/* Top zone. fills what used to be empty black */}
        <div className="w-full relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-start">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--syntax-green)] rounded-full animate-pulse" />
              Now accepting freelance and full-time roles
            </div>
            <p className="text-2xl md:text-4xl font-semibold leading-tight tracking-tight max-w-2xl">
              I&apos;m building digital products that respect both<br className="hidden md:block" />
              <span className="text-[var(--syntax-blue)]">pixels</span> and <span className="text-[var(--syntax-blue)]">production</span>.
            </p>
          </div>
          <a
            href="mailto:malhananmol1@gmail.com"
            className="font-mono text-xs md:text-sm text-white/70 hover:text-white transition-colors break-all md:text-right block focus-visible:outline-none focus-visible:underline"
          >
            malhananmol1<span className="opacity-50">@gmail.com</span>
          </a>
        </div>

        {/* Mid zone. three stats */}
        <div className="hidden md:grid grid-cols-3 gap-12 relative z-10 max-w-3xl">
          {[
            { k: "Stack", v: "React · Next.js · TS · GSAP" },
            { k: "Based", v: "Rohtak, IN · UTC+5:30" },
            { k: "Reply", v: "Within 1 to 2 days" },
          ].map((s) => (
            <div key={s.k}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                {s.k}
              </div>
              <div className="font-mono text-sm text-white/85">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Bottom zone. existing CTA */}
        <div className="w-full relative z-10 footer-inner-parallax">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-8">
            <h2 className="text-huge font-bold leading-none tracking-tighter footer-giant-text">
              LET&apos;S WORK<br />TOGETHER
            </h2>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-black font-mono text-sm uppercase rounded-full hover:scale-105 hover:bg-[var(--syntax-blue)] hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              [ Execute Contact ]
            </Link>
          </div>

          <div className="w-full h-px bg-white/20 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-mono text-xs text-white/60 uppercase gap-4">
            <div>© {new Date().getFullYear()} Anmol Malhan. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="https://github.com/anmolmalhan" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="https://www.linkedin.com/in/anmolmalhan/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
