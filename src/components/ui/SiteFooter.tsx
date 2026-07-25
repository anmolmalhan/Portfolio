"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandMarks";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

const NAV = siteConfig.nav;

/**
 * Compact site-wide footer for the inner pages. The home route is excluded —
 * it has its own full-screen animated FooterReveal.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-border mt-auto pointer-events-auto">
      <Container className="py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-xs text-muted-foreground uppercase tracking-widest">
        <div>© {new Date().getFullYear()} {siteConfig.name}</div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
          {NAV.map(({ label, href, soon }) =>
            soon ? (
              <span
                key={href}
                className="py-2 inline-flex items-center gap-1.5 text-muted-foreground/60 cursor-default select-none"
              >
                {label}
                <span className="text-[9px] tracking-widest rounded-full border border-current px-1.5 py-0.5 leading-none">
                  Soon
                </span>
              </span>
            ) : (
              <Link
                key={href}
                href={href}
                className="py-2 hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        {/* Padding, not a scaled-up overlay: a hit area that doesn't
            participate in layout can cover a neighbouring link. */}
        <div className="flex items-center gap-2 -ml-3">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-3 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
          >
            <GithubMark className="w-4 h-4" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-3 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
          >
            <LinkedinMark className="w-4 h-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
