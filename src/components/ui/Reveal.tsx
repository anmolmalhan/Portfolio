"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a div; use "li" inside lists. */
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms before the reveal transition starts. */
  delay?: number;
  /** IntersectionObserver visibility threshold. */
  threshold?: number;
  style?: CSSProperties;
};

/**
 * Reveals its children with a fade + slide-up the first time they scroll into
 * view. The hidden/visible states live in CSS (`.reveal` / `.is-visible`) so a
 * <noscript> fallback and `prefers-reduced-motion` can override them. We toggle
 * the class imperatively to avoid setState-in-effect.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  threshold = 0.12,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`reveal ${className}`}
      style={{ ["--reveal-delay"]: `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
