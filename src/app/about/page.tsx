import type { Metadata } from "next";
import { User, MonitorPlay, BookOpen, Coffee, ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Anmol Malhan, frontend developer in Rohtak, Haryana. Building polished, performance-driven web experiences with React, Next.js, and TypeScript.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const blocks = [
    { 
      icon: MonitorPlay, 
      title: "What I build & focus on", 
      desc: "Performance-driven frontend apps, interactive dashboards, and sleek landing pages. I enjoy the space where design meets logic, writing code that balances readability, performance, and design precision.", 
      color: "text-[var(--syntax-amber)]",
      className: "md:col-span-2"
    },
    { 
      icon: BookOpen, 
      title: "Currently learning", 
      desc: "Advanced Next.js patterns, backend integration, and system design.", 
      color: "text-[var(--syntax-green)]",
      className: "md:col-span-1"
    },
    { 
      icon: Coffee, 
      title: "Beyond code", 
      desc: "Maintaining discipline, consistency, problem-solving, and staying fit.", 
      color: "text-[var(--syntax-blue)]",
      className: "md:col-span-1"
    }
  ];

  return (
    <div className="max-w-5xl w-full mx-auto px-6 py-20 flex-1 page-reveal">
      <div className="mb-20 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
        
        {/* Left Column: Text & Meta */}
        <div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <User className="text-foreground w-8 h-8" />
            About Me
          </h1>
          <p className="text-xl font-medium text-foreground mb-6">
            I design clean interfaces and build them with production-ready code.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-sm font-mono text-[var(--syntax-comment)]">
            <span className="flex items-center gap-1 text-foreground/80">
              <MapPin className="w-4 h-4"/> Rohtak, Haryana
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Frontend Developer</span>
            <span className="hidden sm:inline">•</span>
            <span>React / Next.js / TypeScript</span>
          </div>

          <div className="space-y-6 text-lg text-foreground/80 leading-relaxed mb-10 border-l-2 border-surface pl-6">
            <p>
              I’m Anmol, a front-end developer passionate about building visually polished web experiences. I work mainly with React, Next.js, and Tailwind CSS to create clean interfaces that are maintainable for developers and fast for users.
            </p>
            <p>
              I enjoy turning ideas into structured, reusable UI systems. My goal is to build digital products that feel smooth, intentional, and ready for real-world use.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/projects" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform">
              View Projects <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-surface px-6 py-3 rounded-full text-sm font-bold hover:bg-surface/50 transition-colors">
              Let&apos;s Work Together
            </Link>
          </div>
        </div>

        {/* Right Column: Photo */}
        <div className="order-first lg:order-last w-full max-w-sm mx-auto lg:mx-0">
          <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full border border-surface/50 rounded-2xl overflow-hidden shadow-2xl bg-surface/20 group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
            <Image
              src="/profile.jpg"
              alt="Anmol Malhan, Frontend Developer"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-surface/30">
        <div className="font-mono text-sm text-[var(--syntax-comment)] mb-8">
          {"/* The Builder's Mindset */"}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {blocks.map((block, i) => {
            const Icon = block.icon;
            return (
              <div key={i} className={`bg-surface/30 border border-surface p-6 rounded-xl hover:bg-surface/50 transition-colors group ${block.className}`}>
                <Icon className={`w-8 h-8 mb-4 ${block.color} group-hover:-translate-y-1 transition-transform`} />
                <h3 className="text-xl font-bold mb-2 text-foreground/90">{block.title}</h3>
                <p className="text-[var(--syntax-comment)] text-sm leading-relaxed">{block.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
