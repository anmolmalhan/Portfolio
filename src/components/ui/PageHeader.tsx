import type { CSSProperties } from "react";
import { Separator } from "./separator";

type PageHeaderProps = {
  /** Mono kicker above the title. Rendered as `// {eyebrow}`. */
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * The masthead for every non-home route.
 *
 * The home page speaks in giant uppercase display type ("SELECTED PROJECTS",
 * "THE STACK") while the inner pages used a 36px sentence-case heading next to
 * a colored Lucide icon — so navigating from / to /projects felt like landing
 * on a different, plainer website. This gives the inner pages the same voice:
 * mono kicker, display-scale uppercase title, one measured line of support
 * copy, then a rule.
 *
 * Entrance is `.rise` (transform only), NOT the opacity-based `Reveal` or the
 * clipping `SplitReveal`. This block is always above the fold, and LCP does not
 * count an element as painted while it is transparent or clipped to zero
 * height — routing it through those took LCP on /projects from ~100ms to
 * ~1200ms, with a paragraph of plain text as the offending element.
 */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-14 md:mb-20">
      <p className="rise font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-4">
        {`// ${eyebrow}`}
      </p>

      <h1
        className="rise text-display font-bold tracking-tighter"
        style={{ "--rise-delay": "60ms" } as CSSProperties}
      >
        {title}
      </h1>

      {description ? (
        <p
          className="rise mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          style={{ "--rise-delay": "120ms" } as CSSProperties}
        >
          {description}
        </p>
      ) : null}

      <Separator className="mt-10" />
    </header>
  );
}
