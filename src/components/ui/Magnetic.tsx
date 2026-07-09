"use client";

import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the cursor-to-center distance the element follows. */
  strength?: number;
};

/**
 * Pulls its children toward the cursor while hovered and springs them back on
 * leave. Wrap a button/link with it for a tactile, magnetic CTA. Skipped under
 * reduced-motion.
 */
export function Magnetic({ children, className = "", strength = 0.4 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </span>
  );
}
