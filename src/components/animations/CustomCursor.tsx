"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP to enforce strict centering independent of other transforms
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const onPointerMove = (e: PointerEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });

      // Hit-test on every move instead of subscribing to per-element
      // pointerenter/leave. handles dynamically inserted/removed targets
      // without re-binding listeners and avoids the thrash from bubbling
      // mouseover firing on every nested child transition.
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], .cursor-pointer');
      const wantsLarge = !!interactive;
      const currentScale = Number(cursor.dataset.scale ?? "1");
      const nextScale = wantsLarge ? 3 : 1;
      if (currentScale !== nextScale) {
        cursor.dataset.scale = String(nextScale);
        gsap.to(cursor, { scale: nextScale, opacity: wantsLarge ? 0.3 : 1, duration: 0.3 });
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] hidden md:block md:motion-reduce:hidden mix-blend-difference"
      style={{ backgroundColor: "white" }}
    />
  );
}
