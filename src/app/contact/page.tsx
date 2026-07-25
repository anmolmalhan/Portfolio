import { Mail } from "lucide-react";
import { StatusBanner } from "./StatusBanner";
import { ContactForm } from "./ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandMarks";
import { siteConfig } from "@/config/site";

const CONTACT_EMAIL = siteConfig.email;

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
    { label: "Response time", value: "1 to 2 business days" },
    {
      label: "Based in",
      value: `${siteConfig.location.city}, IST (${siteConfig.location.timezone})`,
    },
    { label: "Open to", value: "Freelance · Full-time" },
  ];

  const goodFit = [
    "Frontend builds where motion and interaction matter: landing pages, marketing sites, product surfaces.",
    "Next.js + TypeScript applications that need a careful hand on performance and accessibility.",
    "Design-engineering collaborations. Taking a Figma file and turning it into something that feels alive.",
  ];

  return (
    /* Full-width container so the left edge still lines up with the header
       logo. The body is a two-column grid rather than one narrow measure:
       constraining the whole page to max-w-2xl left the entire right half of
       a wide monitor empty. */
    <Container size="content" className="py-28 md:py-32 flex-1">
      <PageHeader
        eyebrow="get in touch"
        title="Contact"
        description="Tell me what you're building, the rough shape of the timeline, and how I can help. The more concrete, the faster I can reply with something useful."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Form column */}
        <div className="lg:col-span-7">
          <StatusBanner status={sp.status} mode={sp.mode} msg={sp.msg} />
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>

        {/* Supporting column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          {/* Spec rail — same hairline-divided language as the hero. */}
          <dl className="grid grid-cols-1 divide-y divide-border border-y border-border">
            {meta.map(({ label, value }, i) => (
              <Reveal key={label} delay={i * 80}>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-right">{value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <section className="mt-12" aria-labelledby="good-fit-heading">
            <h2
              id="good-fit-heading"
              className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-6"
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

          <section className="mt-12 pt-10 border-t border-border" aria-labelledby="elsewhere-heading">
            <h2
              id="elsewhere-heading"
              className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-6"
            >
              {"// Or reach me elsewhere"}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Reveal delay={0}>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:border-foreground/40 hover:bg-foreground/5 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Mail className="w-4 h-4 text-[var(--syntax-blue)]" />
                  {CONTACT_EMAIL}
                </a>
              </Reveal>
              <Reveal delay={70}>
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:border-foreground/40 hover:bg-foreground/5 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <GithubMark className="w-4 h-4" />
                  GitHub
                </a>
              </Reveal>
              <Reveal delay={140}>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:border-foreground/40 hover:bg-foreground/5 transition-colors font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <LinkedinMark className="w-4 h-4 text-[var(--syntax-blue)]" />
                  LinkedIn
                </a>
              </Reveal>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
