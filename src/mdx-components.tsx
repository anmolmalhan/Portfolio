import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Callout } from "@/components/blog/Callout";
import { ConnectionFlow, SessionOwnership } from "@/components/blog/Diagrams";
import { Figure } from "@/components/blog/Figure";
import { Step, Steps } from "@/components/blog/Steps";
import { Terminal } from "@/components/blog/Terminal";
import {
  TermiusAttachedSketch,
  TermiusHostSketch,
  TermiusKeySketch,
} from "@/components/blog/TermiusSketch";
import { SharingPaneSketch, TailscaleMenuSketch } from "@/components/blog/UiSketch";

/**
 * Global MDX element mapping. Required by @next/mdx under the App Router.
 *
 * Deliberately not @tailwindcss/typography: `prose` ships its own colour and
 * spacing scale, which would put post copy on a different type ramp from the
 * rest of the site and re-introduce the exact inconsistency <Container> exists
 * to prevent. These map straight onto the design tokens instead.
 *
 * Headings render bare so rehype-slug's ids land on the real element and the
 * in-post contents links resolve.
 */
const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-16 mb-5 scroll-mt-28 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-12 mb-4 scroll-mt-28 text-xl md:text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="my-5 text-lg leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const external = typeof href === "string" && /^https?:/.test(href);
    const className =
      "font-medium text-[var(--syntax-blue)] underline decoration-[var(--syntax-blue)]/30 underline-offset-4 transition-colors hover:decoration-[var(--syntax-blue)]";

    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    ) : (
      <Link href={href ?? "#"} className={className} {...props}>
        {children}
      </Link>
    );
  },
  ul: ({ children, ...props }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground marker:text-border" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground marker:font-mono marker:text-muted-foreground/70" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="pl-1.5" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-8 border-l-2 border-[var(--syntax-blue)]/40 pl-6 text-lg italic leading-relaxed text-foreground/80"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-14 border-border" {...props} />,

  // rehype-pretty-code hands back a <pre> already carrying the Shiki spans and
  // a data-language attribute; this only supplies the surface around it.
  pre: ({ children, ...props }) => (
    <pre
      className="mdx-code my-8 overflow-x-auto rounded-xl border border-border bg-card p-4 md:p-5 text-[13px] leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => (
    <code
      className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit"
      {...props}
    >
      {children}
    </code>
  ),

  table: ({ children, ...props }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-border bg-muted/50 px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-border px-4 py-3 align-top text-muted-foreground last:border-0" {...props}>
      {children}
    </td>
  ),

  Callout,
  ConnectionFlow,
  Figure,
  SessionOwnership,
  SharingPaneSketch,
  Step,
  Steps,
  TailscaleMenuSketch,
  Terminal,
  TermiusAttachedSketch,
  TermiusHostSketch,
  TermiusKeySketch,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
