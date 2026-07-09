"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card edges. */
  max?: number;
  style?: CSSProperties;
};

/**
 * Tilts its children in 3D toward the cursor (perspective rotateX/rotateY),
 * easing back to flat on leave. Imperative + rAF-free since pointermove is
 * already throttled by the browser; skipped under reduced-motion.
 */
export function Tilt({ children, className = "", max = 6, style }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(
      px * max
    ).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
