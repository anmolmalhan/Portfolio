/**
 * Single source of truth for brand, navigation, and contact details.
 *
 * Anything that appears in more than one place — the name in the header and
 * the footer, the email in the contact page and the JSON-LD, the nav in the
 * desktop bar and the mobile sheet — belongs here. Previously these were
 * retyped per file, so the header said "Studio" while the footer said the same
 * link was "About" and the two drifted apart.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Announced but not built yet: rendered as a dimmed, non-navigable label
   *  with a "soon" tag instead of a link, so there's no route to 404 on. */
  soon?: boolean;
};

/** Declared outside the `as const` object so `href` stays `string`. Inside it,
 *  the literal union made ordinary checks like `href !== "/"` a type error. */
const nav: NavItem[] = [
  { label: "Work", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const siteConfig = {
  name: "Anmol Malhan",
  /** Split for the two-tone lockup: the first word renders at half opacity. */
  nameParts: { first: "Anmol", last: "Malhan" },
  role: "Frontend Developer",
  tagline: "I build product UIs that feel fast and look intentional.",
  description:
    "Anmol Malhan, frontend developer building fast, animated web experiences with Next.js, React, TypeScript, and GSAP.",

  location: { city: "Rohtak", region: "Haryana", country: "IN", timezone: "UTC+5:30" },
  availability: "Available for new work",
  email: "contact@anmolmalhan.com",

  /** Roles cycled by the hero's rotating slot. */
  roles: ["Frontend Developer", "Interaction Designer", "Product Builder"],
  /** Headline stack, shown in the hero rule and the contact meta grid. */
  stack: ["Next.js", "React", "TypeScript"],

  nav,

  social: {
    github: "https://github.com/anmolmalhan",
    linkedin: "https://www.linkedin.com/in/anmolmalhan/",
  },
  /** GitHub handle on its own — the contribution calendar takes a username. */
  githubUsername: "anmolmalhan",
} as const;

export type SiteConfig = typeof siteConfig;
