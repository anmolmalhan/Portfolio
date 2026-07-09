/** True when the user has asked the OS to minimize non-essential motion.
 *  Safe to call during SSR (returns false when there is no window). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
