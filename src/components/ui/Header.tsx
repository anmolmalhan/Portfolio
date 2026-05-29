"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeXml, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Work", href: "/projects" },
  { label: "Notes", href: "/notes" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 pointer-events-none ${
        scrolled || menuOpen
          ? "bg-background/75 backdrop-blur-md text-foreground border-b border-foreground/10"
          : "mix-blend-difference text-white"
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 py-4 md:py-6 flex items-center justify-between pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Home"
        >
          <CodeXml className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:scale-95 duration-500 ease-out" />
          <span className="font-sans font-bold text-lg md:text-xl tracking-tighter uppercase leading-none mt-1 hidden sm:block">
            <span className="opacity-50">Anmol</span> Malhan
          </span>
        </Link>
        <nav className="flex gap-4 md:gap-8 items-center" aria-label="Primary">
          <div className="hidden md:flex gap-8 items-center">
            {NAV.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`font-sans font-medium text-sm tracking-wide uppercase transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background inline-flex items-center ${
                    active ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className={active ? "border-b border-current pb-0.5" : ""}>{label}</span>
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
          <button
            className="md:hidden p-2 -mr-2 rounded-md hover:bg-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-foreground/10 py-4 px-4 shadow-lg pointer-events-auto text-foreground flex flex-col gap-4">
          {NAV.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={`font-sans font-medium text-lg tracking-wide uppercase py-2 transition-opacity ${
                  active ? "opacity-100 font-bold" : "opacity-70"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
