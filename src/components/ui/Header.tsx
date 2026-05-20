"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeXml } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Work", href: "/projects" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full py-4 md:py-6 pointer-events-none transition-colors duration-300 ${
        scrolled
          ? "bg-background/75 backdrop-blur-md text-foreground border-b border-foreground/10"
          : "mix-blend-difference text-white"
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 flex items-center justify-between pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Home"
        >
          <CodeXml className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:scale-95 duration-500 ease-out" />
          <span className="font-sans font-bold text-lg md:text-xl tracking-tighter uppercase leading-none mt-1 hidden sm:block">
            <span className="opacity-50">Dev/</span>Motion
          </span>
        </Link>
        <nav className="flex gap-4 md:gap-8 items-center" aria-label="Primary">
          {NAV.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`font-sans font-medium text-xs md:text-sm tracking-wide uppercase transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <span className={active ? "border-b border-current pb-0.5" : ""}>{label}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
