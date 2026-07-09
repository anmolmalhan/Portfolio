"use client";

import dynamic from "next/dynamic";

// Defer the animation runtime (Lenis + GSAP for smooth scroll, the GSAP custom
// cursor, and the scroll-progress bar) out of the initial bundle. None of it is
// needed for first paint, so it loads after hydration and keeps GSAP/Lenis off
// the critical path on every route.
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const ScrollProgress = dynamic(() => import("./ScrollProgress"), { ssr: false });

export default function ClientRuntime() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
    </>
  );
}
