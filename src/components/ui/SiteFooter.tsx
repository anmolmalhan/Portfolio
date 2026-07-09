"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandMarks";

const NAV = [
  { label: "Work", href: "/projects" },
  { label: "Notes", href: "/notes" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Compact site-wide footer for the inner pages. The home route is excluded —
 * it has its own full-screen animated FooterReveal.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-surface mt-auto pointer-events-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-xs text-[var(--syntax-comment)] uppercase tracking-widest">
        <div>© {new Date().getFullYear()} Anmol Malhan</div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {NAV.map(({ label, href }) => (
            <Link key={href} href={href} className="hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anmolmalhan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            <GithubMark className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/anmolmalhan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            <LinkedinMark className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
