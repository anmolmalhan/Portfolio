"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeXml, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Work", href: "/projects" },
  { label: "Notes", href: "/notes" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs for the sliding indicator + magnetic links.
  const navListRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  const activeIndex = NAV.findIndex(
    ({ href }) => pathname === href || (href !== "/" && pathname?.startsWith(href)),
  );

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

  // Glide the indicator to a given link (or hide it when index < 0). The
  // indicator is purely decorative, so position it with direct style writes
  // (like the magnetic transform below) instead of routing through state.
  const moveIndicator = useCallback((index: number) => {
    const indicator = indicatorRef.current;
    const list = navListRef.current;
    const link = index >= 0 ? linkRefs.current[index] : null;
    if (!indicator) return;
    if (!list || !link) {
      indicator.style.opacity = "0";
      return;
    }
    const lr = list.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    indicator.style.left = `${r.left - lr.left}px`;
    indicator.style.width = `${r.width}px`;
    indicator.style.opacity = "1";
  }, []);

  // Rest the indicator on the active link; keep it aligned on resize.
  useEffect(() => {
    moveIndicator(activeIndex);
    const onResize = () => moveIndicator(activeIndex);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, moveIndicator]);

  // Magnetic pull: nudge a link's contents toward the cursor.
  const handleMove = (i: number) => (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    const link = linkRefs.current[i];
    const inner = innerRefs.current[i];
    if (!link || !inner) return;
    const r = link.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.35;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
    inner.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleEnter = (i: number) => () => moveIndicator(i);

  const handleLeave = (i: number) => () => {
    const inner = innerRefs.current[i];
    if (inner) inner.style.transform = "";
    moveIndicator(activeIndex);
  };

  return (
    <header
      className={`header-reveal fixed top-0 left-0 z-50 w-full transition-colors duration-300 pointer-events-none ${
        scrolled || menuOpen
          ? "bg-background/75 backdrop-blur-md text-foreground border-b border-foreground/10"
          : "mix-blend-difference text-white"
      }`}
    >
      <div
        className={`container mx-auto px-4 md:px-12 flex items-center justify-between pointer-events-auto transition-[padding] duration-300 ease-out ${
          scrolled ? "py-2 md:py-3" : "py-4 md:py-6"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Home"
        >
          <CodeXml
            className={`w-6 h-6 md:w-8 md:h-8 transition-transform duration-500 ease-out group-hover:scale-95 motion-safe:group-hover:-rotate-12 ${
              scrolled ? "md:scale-90" : ""
            }`}
          />
          <span className="font-sans font-bold text-lg md:text-xl tracking-tighter uppercase leading-none mt-1 hidden sm:block">
            <span className="opacity-50">Anmol</span> Malhan
          </span>
        </Link>
        <nav className="flex gap-4 md:gap-8 items-center" aria-label="Primary">
          <div
            ref={navListRef}
            className="relative hidden md:flex gap-8 items-center"
            onMouseLeave={() => moveIndicator(activeIndex)}
          >
            {NAV.map(({ label, href }, i) => {
              const active = i === activeIndex;
              return (
                <Link
                  key={label}
                  href={href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={handleEnter(i)}
                  onMouseMove={handleMove(i)}
                  onMouseLeave={handleLeave(i)}
                  style={{ animationDelay: `${150 + i * 70}ms` }}
                  className={`nav-item-reveal group relative font-sans font-medium text-sm tracking-wide uppercase transition-opacity duration-300 ease-out rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background inline-flex items-center ${
                    active ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* Magnetic wrapper — springs back toward center on leave. */}
                  <span
                    ref={(el) => {
                      innerRefs.current[i] = el;
                    }}
                    className="block transition-transform duration-300 ease-out will-change-transform"
                  >
                    {/* Text-roll: label rolls up, a duplicate rolls in from below. */}
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-full">
                        {label}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 block translate-y-full transition-transform duration-300 ease-out motion-safe:group-hover:translate-y-0"
                      >
                        {label}
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
            {/* Shared sliding indicator that glides between links. */}
            <span
              ref={indicatorRef}
              aria-hidden
              className="nav-indicator pointer-events-none absolute -bottom-1 h-0.5 rounded-full opacity-0 transition-[left,width,opacity] duration-300 ease-out"
            />
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
        <div className="menu-panel-reveal md:hidden absolute top-full left-0 w-full bg-background border-b border-foreground/10 py-4 px-4 shadow-lg pointer-events-auto text-foreground flex flex-col gap-4">
          {NAV.map(({ label, href }, i) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                style={{ animationDelay: `${60 + i * 50}ms` }}
                className={`nav-item-reveal font-sans font-medium text-lg tracking-wide uppercase py-2 transition-opacity ${
                  active ? "opacity-100 font-bold" : "opacity-70 hover:opacity-100"
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
