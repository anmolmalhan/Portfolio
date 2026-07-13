import type { NextConfig } from "next";

// Content-Security-Policy allowlist. 'unsafe-inline' is required for scripts
// (Next.js hydration payloads and the pre-paint inline theme script) and for
// styles (GSAP writes inline styles; Tailwind injects a stylesheet). The only
// cross-origin calls the app makes are the GitHub contributions API (about
// page calendar) and Vercel Analytics, which are allowlisted explicitly.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "connect-src 'self' https://github-contributions-api.jogruber.de https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Playwright hits 127.0.0.1 rather than localhost; whitelist it so the
  // dev-server doesn't spam a cross-origin warning during E2E runs.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // The Client Work OS case study was rebranded to Swift Digital Seva;
      // keep links shared under the old slug working.
      {
        source: "/projects/client-work-os",
        destination: "/projects/swift-digital-seva",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
