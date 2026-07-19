import { useSyncExternalStore } from "react";

/** True when the user has asked the OS to minimize non-essential motion.
 *  Safe to call during SSR (returns false when there is no window). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Reactive media query for client components: false during SSR, live-updates
 *  on change. Backed by useSyncExternalStore so it never sets state in an
 *  effect (React Compiler lint-clean). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Reactive variant of prefersReducedMotion for render-time branching. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
