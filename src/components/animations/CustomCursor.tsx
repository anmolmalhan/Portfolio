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

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // quickTo reuses ONE tween per axis instead of allocating a new gsap.to on
    // every pointermove — far less per-move overhead (the old approach was a
    // jitter source when moving fast).
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    let latestTarget: EventTarget | null = null;
    let hitTestQueued = false;
    let currentScale = 1;

    // The expensive part — walking the DOM with closest() — runs at most once
    // per animation frame, not once per pointer event.
    const runHitTest = () => {
      hitTestQueued = false;
      const el = latestTarget as HTMLElement | null;
      const interactive = !!el?.closest?.('a, button, [role="button"], .cursor-pointer');
      const next = interactive ? 3 : 1;
      if (next !== currentScale) {
        currentScale = next;
        gsap.to(cursor, { scale: next, opacity: interactive ? 0.3 : 1, duration: 0.3 });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      latestTarget = e.target;
      if (!hitTestQueued) {
        hitTestQueued = true;
        requestAnimationFrame(runHitTest);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
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
