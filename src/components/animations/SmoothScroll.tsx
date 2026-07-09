"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

// Side-effect only: Lenis attaches to the document scroll globally, so this
// renders nothing and lives as a sibling rather than wrapping the tree.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // Touch: hand back to native iOS/Android momentum (smoother than syncTouch
      // on real devices). ScrollTrigger animations stay smooth because we use
      // numeric `scrub` values (which add their own interpolation buffer) and
      // because Lenis still updates ScrollTrigger from GSAP's RAF ticker.
      syncTouch: false,
    });

    // Drive Lenis from GSAP's ticker so ScrollTrigger and Lenis share one
    // requestAnimationFrame loop and can't drift.
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger reading positions from Lenis's smoothed scroll.
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  return null;
}
