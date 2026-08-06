import { Children, isValidElement } from "react";

/**
 * A numbered walkthrough.
 *
 * Borrows the numbering treatment from the project case studies (mono index in
 * the accent, rule down the left) so a tutorial reads as the same publication
 * rather than a bolted-on blog. The counter is derived from child order, not
 * typed per step, because renumbering by hand after inserting a step is exactly
 * the kind of thing that goes stale.
 */
export function Steps({ children }: { children: React.ReactNode }) {
  const steps = Children.toArray(children).filter(isValidElement);

  return (
    <ol className="my-10 list-none space-y-10 p-0">
      {steps.map((step, i) => (
        <li key={i} className="relative pl-12 md:pl-14">
          <span
            aria-hidden
            className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card font-mono text-sm text-[var(--syntax-blue)]"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          {i < steps.length - 1 ? (
            <span aria-hidden className="absolute left-4 top-10 -bottom-10 w-px bg-border" />
          ) : null}
          {step}
        </li>
      ))}
    </ol>
  );
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 mt-1 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      {/* `space-y-*` cannot be used here: the MDX <p> mapping carries its own
          `my-5`, and zeroing it with [&>p]:m-0 also kills the margin space-y
          relies on, collapsing consecutive paragraphs into one block. Setting
          the gap on the adjacent-sibling pair instead survives both. */}
      <div className="text-lg leading-relaxed text-muted-foreground [&>*]:m-0 [&>*+*]:mt-4">
        {children}
      </div>
    </div>
  );
}
