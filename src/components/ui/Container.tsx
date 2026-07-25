import { cn } from "@/lib/utils";

/**
 * The layout spine.
 *
 * Every page used to pick its own max-width (`max-w-5xl` on About, `max-w-6xl`
 * on Projects, `max-w-3xl` on Notes) while the header ran full-bleed, so
 * content started at a different x-offset on every route and nothing lined up
 * with the logo above it. All routes now share one padding scale, defined once
 * as `--page-gutter`, and one of two widths:
 *
 *   default — the header and the home hero. Spans `--page-max` (1680px) so the
 *             hero's artwork has room to fill a wide monitor.
 *   content — text-led inner pages. Without the hero's artwork, 1680px left
 *             body copy ending hundreds of pixels short of the section rules
 *             above it and the page reading off-centre; 1152px keeps the
 *             margins even.
 *
 * `.page-container` supplies `margin-inline: auto`, so `content` centres
 * itself. It deliberately does NOT set max-width — see the note in globals.css.
 */
const widths = {
  default: "max-w-[var(--page-max)]",
  content: "max-w-6xl",
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
