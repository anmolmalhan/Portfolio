"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Hero Text Reveal
      const lines = gsap.utils.toArray(".hero-line span");
      gsap.set(lines, { yPercent: 120 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
      });

      // 2. Horizontal Scroll Section
      // Disabled GSAP pin to allow natural vertical scrolling. Horizontal scrolling is now manually handled via button clicks.

      // 3. Code Philosophy Block Stagger
      gsap.from(".code-line", {
        scrollTrigger: {
          trigger: ".code-section",
          start: "top 75%",
        },
        opacity: 0,
        x: -50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });

      // 4. Giant Footer Parallax
      gsap.from(".footer-giant-text", {
        scrollTrigger: {
          trigger: "footer",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        y: -100,
        opacity: 0.5,
      });

      // Recalculate robustly after DOM and external resources settle
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      
      {/* --- CONTENT CURTAIN --- */}
      <main className="relative z-10 w-full bg-background flex flex-col rounded-b-[2rem] md:rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden text-foreground">
        
        {/* --- HERO SECTION --- */}
        <section className="h-screen w-full flex flex-col justify-end pb-12 px-6 md:px-12 relative overflow-hidden">
          {/* Abstract code/terminal background glow */}
          <div className="absolute top-1/4 right-[10%] w-[40vw] h-[40vw] bg-[var(--syntax-blue)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
          <div className="absolute bottom-0 left-[10%] w-[30vw] h-[30vw] bg-[var(--syntax-magenta)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
          
          <div className="z-10 w-full pt-32">
            <div className="flex justify-between items-end mb-8 md:mb-16 border-b border-foreground/20 pb-6 w-full">
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

        {/* --- PHILOSOPHY / CODE SECTION --- */}
        <section className="min-h-screen w-full flex flex-col md:flex-row items-center border-t border-foreground/10 code-section">
          <div className="w-full md:w-1/2 p-12 md:p-24 bg-surface h-full flex flex-col justify-center">
            <ArrowDownRight className="w-16 h-16 mb-12 text-foreground" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-tighter leading-none">
              It's never<br />just a<br />website.
            </h2>
            <p className="text-xl md:text-2xl text-[var(--syntax-comment)] max-w-md !leading-snug">
              Every detail matters. We craft digital experiences. Your design. Our obsession. Your brand. Our playground.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-12 md:p-24 bg-background h-full flex flex-col justify-center text-xl md:text-2xl font-mono leading-relaxed">
            <div className="code-line text-[var(--syntax-comment)] mb-4">{"// Our Approach"}</div>
            <div className="code-line flex"><span className="text-[var(--syntax-magenta)] mr-4">const</span> studio <span className="text-[var(--syntax-magenta)] mx-4">=</span> {"{"}</div>
            <div className="code-line pl-8 text-[var(--syntax-blue)]">obsession: <span className="text-[var(--syntax-green)]">"Performance"</span>,</div>
            <div className="code-line pl-8 text-[var(--syntax-blue)]">focus: <span className="text-[var(--syntax-green)]">"Interaction Design"</span>,</div>
            <div className="code-line pl-8 text-[var(--syntax-blue)]">typesafe: <span className="text-[var(--syntax-amber)]">true</span></div>
            <div className="code-line">{"};"}</div>
          </div>
        </section>

        {/* --- SELECTED WORKS (HORIZONTAL CAROUSEL) --- */}
        <section className="h-screen w-full bg-foreground text-background flex items-center relative">
          <style dangerouslySetInnerHTML={{__html: `\n.pin-wrap::-webkit-scrollbar { display: none; }\n`}} />
          <div className="pin-wrap flex h-[80vh] items-center px-12 gap-16 md:gap-32 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            <div className="w-[85vw] md:w-[60vw] shrink-0 snap-center">
              <div className="text-huge font-bold leading-none uppercase text-background">
                Selected<br/>Projects
              </div>
              <div className="h-px w-full bg-background/20 mt-12 mb-8" />
              <button 
                onClick={() => {
                  const wrap = document.querySelector('.pin-wrap');
                  if (wrap) wrap.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
                }}
                className="font-mono text-sm uppercase opacity-50 hover:opacity-100 flex items-center gap-4 text-background transition-opacity cursor-pointer group"
              >
                Scroll to explore <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            {projects.filter(p => p.featured).map((project, i) => (
              <div key={project.id} className="w-[85vw] md:w-[60vw] shrink-0 h-full flex flex-col justify-center group relative text-background snap-center">
                 <div className="flex font-mono text-sm opacity-50 mb-6 gap-6">
                   <span>{String(i + 1).padStart(2, '0')}</span>
                   <span>[ {project.techStack.slice(0,2).join(" / ")} ]</span>
                 </div>
                 
                 <Link href={`/projects/${project.slug}`} className="w-full aspect-video bg-background/5 relative overflow-hidden rounded-none flex items-center justify-center">
                   {/* Decorative image border effect */}
                   <div className="absolute inset-0 border border-background/20 group-hover:border-[var(--syntax-blue)] transition-colors duration-700 z-10 pointer-events-none" />
                   
                   {/* Real image load */}
                   {project.image && project.image !== "" ? (
                     <img 
                       src={project.image} 
                       alt={project.title} 
                       className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out" 
                     />
                   ) : (
                     <div className="font-mono opacity-20 text-xl group-hover:scale-110 transition-transform duration-1000 ease-out">{project.image || "No Image"}</div>
                   )}
                 </Link>
                 
                 <div className="flex items-center justify-between mt-8">
                   <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter group-hover:text-[var(--syntax-blue)] transition-colors duration-500">
                     {project.title}
                   </h3>
                   <a 
                     href={project.liveUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-background/30 hover:border-[var(--syntax-blue)] text-sm font-mono uppercase tracking-wider text-background hover:text-[var(--syntax-blue)] transition-all z-20 group-hover:bg-[var(--syntax-blue)]/10"
                   >
                     Launch App <ArrowRight className="w-4 h-4" />
                   </a>
                 </div>
              </div>
            ))}

            {/* Spacer block at the end */}
            <div className="w-[20vw] shrink-0" />
          </div>
        </section>
      </main>

      {/* --- SPACER TO PUSH FOOTER REVEAL --- */}
      <div className="h-screen w-full pointer-events-none trigger-footer bg-transparent" />

      {/* --- MASSIVE FOOTER REVEAL --- */}
      <footer className="fixed bottom-0 left-0 h-screen w-full flex flex-col justify-end bg-black text-white -z-10 pb-12 px-6 md:px-12 pointer-events-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--syntax-blue)]/5 to-transparent pointer-events-none" />
        
        <div className="w-full relative z-10 footer-inner-parallax">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h2 className="text-huge font-bold leading-none tracking-tighter footer-giant-text">
              LET'S WORK<br />TOGETHER
            </h2>
            <Link href="/contact" className="px-8 py-4 bg-white text-black font-mono text-sm uppercase rounded-full hover:scale-105 hover:bg-[var(--syntax-blue)] hover:text-white transition-all duration-300">
              [ Execute Contact ]
            </Link>
          </div>
          
          <div className="w-full h-px bg-white/20 mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-mono text-xs text-white/60 uppercase gap-4">
            <div>© {new Date().getFullYear()} Studio Dev Motion. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="https://github.com" target="_blank" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="https://linkedin.com" target="_blank" className="hover:text-white transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
