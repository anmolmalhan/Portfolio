import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
import CustomCursor from "@/components/animations/CustomCursor";
import SmoothScroll from "@/components/animations/SmoothScroll";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anmol Malhan",
  jobTitle: "Frontend Developer",
  url: siteUrl,
  image: `${siteUrl}/profile.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Rohtak", addressRegion: "Haryana", addressCountry: "IN" },
  sameAs: [
    "https://github.com/anmolmalhan",
    "https://www.linkedin.com/in/anmolmalhan/",
  ],
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
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main id="main" className="flex-1 flex flex-col w-full relative z-10">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
