import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";
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
 */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-14 md:mb-20">
      <Reveal>
        <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-4">
          {`// ${eyebrow}`}
        </p>
      </Reveal>

      <SplitReveal
        as="h1"
        text={title}
        className="text-display font-bold tracking-tighter block"
      />

      {description ? (
        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Reveal>
      ) : null}

      <Separator className="mt-10" />
    </header>
  );
}
