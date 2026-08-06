import { AlertTriangle, Info, Lightbulb } from "lucide-react";

type Tone = "note" | "warning" | "tip";

const tones: Record<Tone, { icon: typeof Info; color: string; label: string }> = {
  note: { icon: Info, color: "var(--syntax-blue)", label: "Note" },
  warning: { icon: AlertTriangle, color: "var(--syntax-amber)", label: "Watch out" },
  tip: { icon: Lightbulb, color: "var(--syntax-green)", label: "Tip" },
};

/**
 * A pulled-aside remark inside post copy.
 *
 * Tinted from the syntax tokens rather than fixed hex, so the three tones stay
 * legible on both themes. The tint is the accent at 6% over the page
 * background, which survives the dark theme's lower contrast ceiling; a solid
 * pastel fill did not.
 */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: Tone;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, color, label } = tones[type];

  return (
    <aside
      className="my-8 rounded-xl border p-5 md:p-6"
      style={{ borderColor: `color-mix(in oklab, ${color} 30%, transparent)`, backgroundColor: `color-mix(in oklab, ${color} 6%, transparent)` }}
    >
      <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest" style={{ color }}>
        <Icon className="h-4 w-4" aria-hidden />
        {title ?? label}
      </p>
      <div className="text-base leading-relaxed text-foreground/85 [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  );
}
