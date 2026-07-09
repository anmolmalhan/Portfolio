import { Terminal, Clock, MapPin, Briefcase, Mail } from "lucide-react";
import { StatusBanner } from "./StatusBanner";
import { ContactForm } from "./ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandMarks";

const CONTACT_EMAIL = "contact@anmolmalhan.com";

// Server Component: reads searchParams on the server so the status banner
// renders in the initial HTML. That means visitors without JS see the
// success/error feedback from the Server Action redirect immediately , 
// real progressive enhancement, not a client-only patch.
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; mode?: string; msg?: string }>;
}) {
  const sp = await searchParams;

  const meta = [
    {
      icon: Clock,
      label: "Response time",
      value: "1 to 2 business days",
    },
    {
      icon: MapPin,
      label: "Based in",
      value: "Rohtak, IST (UTC+5:30)",
    },
    {
      icon: Briefcase,
      label: "Open to",
      value: "Freelance · Full-time",
    },
  ];

  const goodFit = [
    "Frontend builds where motion and interaction matter: landing pages, marketing sites, product surfaces.",
    "Next.js + TypeScript applications that need a careful hand on performance and accessibility.",
    "Design-engineering collaborations. Taking a Figma file and turning it into something that feels alive.",
  ];

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-20 flex-1 page-reveal">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-[var(--syntax-comment)] mb-6">
          <span className="w-2 h-2 bg-[var(--syntax-green)] rounded-full animate-pulse" />
          Available for new work · May 2026
        </div>
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Terminal className="text-accent w-8 h-8" />
          <SplitReveal text="Contact Request" />
        </h1>
        <p className="text-[var(--syntax-comment)] text-lg">
          Tell me what you&apos;re building, the rough shape of the timeline, and how
          I can help. The more concrete, the faster I can reply with something useful.
        </p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {meta.map(({ icon: Icon, label, value }, i) => (
          <Reveal key={label} delay={i * 80}>
            <div className="h-full border border-surface bg-surface/20 rounded-lg p-4">
              <Icon className="w-4 h-4 text-[var(--syntax-blue)] mb-3" />
              <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--syntax-comment)] mb-1">
                {label}
              </dt>
              <dd className="text-sm font-medium text-foreground/90">{value}</dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <StatusBanner status={sp.status} mode={sp.mode} msg={sp.msg} />

      <Reveal>
        <ContactForm />
      </Reveal>

      <section className="mt-16" aria-labelledby="good-fit-heading">
        <h2
          id="good-fit-heading"
          className="font-mono text-sm uppercase tracking-widest text-[var(--syntax-comment)] mb-6"
        >
          {"// Good fit if you're after"}
        </h2>
        <ul className="space-y-4">
          {goodFit.map((item, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 80}
              className="flex gap-4 text-foreground/85 leading-relaxed"
            >
              <span
                className="font-mono text-sm text-[var(--syntax-blue)] shrink-0 pt-1"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mt-16 pt-10 border-t border-surface" aria-labelledby="elsewhere-heading">
        <h2
          id="elsewhere-heading"
          className="font-mono text-sm uppercase tracking-widest text-[var(--syntax-comment)] mb-6"
        >
          {"// Or reach me elsewhere"}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Reveal delay={0}>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface hover:border-foreground/40 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Mail className="w-4 h-4 text-[var(--syntax-blue)]" />
              {CONTACT_EMAIL}
            </a>
          </Reveal>
          <Reveal delay={70}>
            <a
              href="https://github.com/anmolmalhan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface hover:border-foreground/40 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <GithubMark className="w-4 h-4" />
              GitHub
            </a>
          </Reveal>
          <Reveal delay={140}>
            <a
              href="https://www.linkedin.com/in/anmolmalhan/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface hover:border-foreground/40 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <LinkedinMark className="w-4 h-4 text-[var(--syntax-blue)]" />
              LinkedIn
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
