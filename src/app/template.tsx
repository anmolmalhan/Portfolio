// The previous template ran `gsap.from(".page-reveal", { opacity: 0 })` on
// every route change. That briefly hid the page (LCP regression). Routes that
// want a custom enter animation can opt in themselves. the template stays a
// pure pass-through so SSG/RSC content paints immediately.
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
