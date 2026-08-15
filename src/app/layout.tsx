import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

/**
 * `display: "optional"` is load-bearing, not a default worth changing casually.
 *
 * next/font already generates a metric-adjusted fallback (Arial with
 * ascent/descent/size-adjust overrides), which matches Geist VERTICALLY. What
 * it cannot match is per-glyph advance width, so under `swap` a paragraph of
 * body copy re-wraps the moment the real font arrives: a five-line paragraph
 * becomes four, and everything below it jumps. That measured 0.106 CLS on the
 * blog post, over Google's 0.1 threshold, while the rest of the site sat at
 * 0.001. Long prose is the one place the fix used elsewhere here (nowrap rails,
 * count-based heights) does not apply, because re-wrapping is the point.
 *
 * `optional` gives the font ~100ms to arrive and otherwise keeps the fallback
 * for that navigation rather than swapping mid-paint, which takes font-driven
 * CLS to zero. The trade: a first-time visitor on a slow connection reads that
 * one page in the fallback. The font is self-hosted, same-origin and preloaded,
 * so it usually wins the race, and it is cached for every later navigation.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anmol Malhan · Frontend Portfolio",
    template: "%s · Anmol Malhan",
  },
  description:
    "Anmol Malhan, frontend developer building fast, animated web experiences with Next.js, React, TypeScript, and GSAP.",
  applicationName: "Anmol Malhan",
  authors: [{ name: "Anmol Malhan" }],
  creator: "Anmol Malhan",
  keywords: [
    "Anmol Malhan",
    "frontend developer",
    "Next.js",
    "React",
    "TypeScript",
    "GSAP",
    "portfolio",
    "interaction design",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "Anmol Malhan · Frontend Portfolio",
    description:
      "Frontend developer building fast, animated web experiences with Next.js, React, and GSAP.",
    siteName: "Anmol Malhan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anmol Malhan · Frontend Portfolio",
    description:
      "Frontend developer building fast, animated web experiences with Next.js, React, and GSAP.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

import { Header } from "@/components/ui/Header";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { getAllPosts } from "@/lib/posts";
import ClientRuntime from "@/components/animations/ClientRuntime";
import { Analytics } from "@vercel/analytics/next";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anmol Malhan",
  jobTitle: "Frontend Developer",
  url: siteUrl,
  image: `${siteUrl}/profile.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.location.city,
    addressRegion: siteConfig.location.region,
    addressCountry: siteConfig.location.country,
  },
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Interaction Design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Set theme before first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        {/* Without JS, IntersectionObserver never runs — keep reveal content visible. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".reveal{opacity:1!important;transform:none!important}.word-reveal{transform:none!important}",
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col selection:bg-foreground selection:text-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-foreground focus:text-background focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Header />
        {/* Renders nothing until opened — a keydown listener and no markup on
            first paint, so it stays clear of the LCP path. */}
        <CommandPalette posts={getAllPosts()} />
        <div className="grain" aria-hidden />
        <main id="main" className="flex-1 flex flex-col w-full relative z-10">{children}</main>
        <SiteFooter />
        <ClientRuntime />
        {/* Only mount Analytics on Vercel. Its beacon script (/_vercel/…) only
            exists on Vercel-hosted deployments; loading it anywhere else (a
            local `next start`, a self-host) 404s and logs a console error that
            dings the Best-Practices score. VERCEL is set on every Vercel build
            and runtime, so production analytics is unaffected. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
