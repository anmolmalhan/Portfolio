import { cn } from "@/lib/utils";

/**
 * The layout spine.
 *
 * Every page previously picked its own max-width (`max-w-5xl` on About,
 * `max-w-6xl` on Projects, `max-w-3xl` on Notes) while the header ran
 * full-bleed at `px-12`. The result was that content started at a different
 * x-offset on every route and nothing lined up with the logo above it.
 *
 * All of them now share one padding scale and one of three widths, so the left
 * edge of a heading is the left edge of the logo on every route.
 *
 *   default — standard pages and the header (matches the old max-w-6xl)
 *   prose   — long-form reading measure for notes
 *   narrow  — focused single-column forms
 *   wide    — full-bleed sections that only want the padding, not a max-width
 */
/**
 * `default` is deliberately generous (1680px) and the padding steps up with
 * the viewport. A 1152px cap looked reasonable on a laptop but stranded the
 * whole site in a narrow ribbon down the middle of a wide monitor, with a
 * third of the screen empty on either side. Reading measure is constrained
 * per-block (`max-w-2xl` on body copy) rather than by squeezing the shell.
 */
/** `default` inherits --page-max from .page-container; the rest override it. */
const widths = {
  default: "",
  prose: "max-w-3xl",
  narrow: "max-w-2xl",
  wide: "max-w-none",
} as const;

export function Container({
  size = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { size?: keyof typeof widths }) {
  return (
    <div className={cn("page-container", widths[size], className)} {...props}>
      {children}
    </div>
  );
}
