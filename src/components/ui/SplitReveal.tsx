"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type SplitRevealProps = {
  /** The text to split into individually-revealing words. */
  text: string;
  as?: ElementType;
  className?: string;
  /** Per-word stagger in ms. */
  stagger?: number;
};

/**
 * Reveals a heading word-by-word: each word slides up out of a clipped line
 * the first time the heading scrolls into view. States live in CSS
 * (`.word-reveal` / `.is-visible`) so the <noscript> + reduced-motion overrides
 * apply. Classes are toggled imperatively to avoid setState-in-effect.
 */
export function SplitReveal({ text, as: Tag = "span", className = "", stagger = 60 }: SplitRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");

    if (prefersReducedMotion()) {
      words.forEach((w) => w.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            words.forEach((w) => w.classList.add("is-visible"));
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-[0.1em] align-bottom">
          <span
            data-word
            className="word-reveal inline-block"
            style={{ ["--reveal-delay"]: `${i * stagger}ms` } as CSSProperties}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
