import { Terminal, Clock, MapPin, Briefcase, Mail } from "lucide-react";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.19 1.18a11 11 0 0 1 5.8 0c2.22-1.49 3.18-1.18 3.18-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56 4.56-1.53 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
import { StatusBanner } from "./StatusBanner";
import { ContactForm } from "./ContactForm";

const CONTACT_EMAIL = "malhananmol1@gmail.com";

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
          Contact Request
        </h1>
        <p className="text-[var(--syntax-comment)] text-lg">
          Tell me what you&apos;re building, the rough shape of the timeline, and how
          I can help. The more concrete, the faster I can reply with something useful.
        </p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {meta.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="border border-surface bg-surface/20 rounded-lg p-4"
          >
            <Icon className="w-4 h-4 text-[var(--syntax-blue)] mb-3" />
            <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--syntax-comment)] mb-1">
              {label}
            </dt>
            <dd className="text-sm font-medium text-foreground/90">{value}</dd>
          </div>
        ))}
      </dl>

      <StatusBanner status={sp.status} mode={sp.mode} msg={sp.msg} />

      <ContactForm />

      <section className="mt-16" aria-labelledby="good-fit-heading">
        <h2
          id="good-fit-heading"
          className="font-mono text-sm uppercase tracking-widest text-[var(--syntax-comment)] mb-6"
        >
          {"// Good fit if you're after"}
        </h2>
        <ul className="space-y-4">
          {goodFit.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 text-foreground/85 leading-relaxed"
            >
              <span
                className="font-mono text-sm text-[var(--syntax-blue)] shrink-0 pt-1"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
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
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface hover:border-foreground/40 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Mail className="w-4 h-4 text-[var(--syntax-blue)]" />
            {CONTACT_EMAIL}
          </a>
          <a
            href="https://github.com/anmolmalhan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface hover:border-foreground/40 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GithubMark className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anmolmalhan/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface hover:border-foreground/40 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LinkedinMark className="w-4 h-4 text-[var(--syntax-blue)]" />
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
