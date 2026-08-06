import type { NextConfig } from "next";
import createMDX from "@next/mdx";

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
  // static.cloudflareinsights.com: the site is proxied through Cloudflare,
  // which auto-injects its Web Analytics beacon script.
  // 'wasm-unsafe-eval': the tech-stack physics section runs Rapier, which is
  // compiled WebAssembly. This permits ONLY WebAssembly.instantiate — JS
  // eval()/Function() remain blocked.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com https://static.cloudflareinsights.com",
  "connect-src 'self' https://github-contributions-api.jogruber.de https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cloudflareinsights.com",
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
  // NOTE: `pageExtensions` is deliberately NOT extended with md/mdx. Posts in
  // content/blog are *imported* by the [slug] route, not routed to directly,
  // so registering the extensions would only make Next scan for MDX pages that
  // do not exist.
  images: {
    // Next negotiates WebP by default; adding AVIF ahead of it means modern
    // browsers get the smaller encode. The /about portrait is the LCP element
    // there and was shipping 107kB of WebP.
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves qualities listed here. 68 is for the /about
    // portrait, which is the LCP element on that route and renders grayscale
    // at rest, so it tolerates more compression than the default 75.
    qualities: [68, 75],
  },
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
      // The notes section was removed. Both /notes and every article URL were
      // in the sitemap and are indexed, so send them somewhere useful instead
      // of letting bookmarks and search results dead-end on a 404.
      // The article rule is listed first: Next matches in order, and a bare
      // "/notes" source would not catch the nested paths on its own.
      {
        source: "/notes/:slug*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/notes",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

/**
 * Plugins are named as STRINGS, not imported functions. Turbopack runs the MDX
 * pipeline in Rust and cannot receive JS function references across that
 * boundary; passing `[remarkGfm]` here builds under webpack and then fails
 * under `next dev`. Every option below has to stay JSON-serialisable for the
 * same reason.
 *
 * - remark-frontmatter: parses the YAML block so it is not rendered as body
 *   text. The values are read separately by src/lib/posts.ts via gray-matter.
 * - rehype-slug: gives headings ids, which the in-post contents list links to.
 * - rehype-pretty-code: build-time Shiki highlighting. Emits both themes as
 *   CSS variables (--shiki-light / --shiki-dark) so a theme switch needs no
 *   re-highlight and ships no client JS. `keepBackground: false` hands the
 *   surface colour back to our own design tokens.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
