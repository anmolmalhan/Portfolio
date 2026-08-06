import { ArrowRight, Check, Laptop, Lock, Server, Smartphone, Terminal as TerminalIcon, X } from "lucide-react";

/**
 * Post diagrams, built from HTML rather than SVG.
 *
 * An SVG diagram wide enough to read on a desktop scales to unreadable text on
 * a phone, and this post is specifically about working from a phone. HTML nodes
 * reflow: the flow runs left-to-right on desktop and stacks vertically on
 * mobile, with the type staying at its real size either way. They also inherit
 * the theme tokens for free, which an <img> of an SVG cannot.
 */

function Node({
  icon: Icon,
  label,
  detail,
  accent = false,
}: {
  icon: typeof Laptop;
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-center"
      style={
        accent
          ? {
              borderColor: "color-mix(in oklab, var(--syntax-blue) 35%, transparent)",
              backgroundColor: "color-mix(in oklab, var(--syntax-blue) 7%, transparent)",
            }
          : undefined
      }
    >
      <Icon
        className="h-5 w-5"
        style={{ color: accent ? "var(--syntax-blue)" : undefined }}
        aria-hidden
      />
      <span className="font-mono text-sm text-foreground">{label}</span>
      <span className="text-xs leading-relaxed text-muted-foreground">{detail}</span>
    </div>
  );
}

/** `down` forces the arrow vertical at every width. Used for the wrap between
 *  diagram rows, where a rightward arrow would read as "continues right" when
 *  the flow actually continues on the line below. */
function Connector({ label, down = false }: { label?: string; down?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 py-2 sm:py-0">
      <ArrowRight
        className={`h-4 w-4 text-muted-foreground ${down ? "rotate-90" : "rotate-90 sm:rotate-0"}`}
        aria-hidden
      />
      {label ? (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Phone to agent: what each piece in the stack is actually responsible for. */
export function ConnectionFlow() {
  return (
    <figure className="my-10">
      {/* Five nodes will not fit side by side in the post's 768px reading
          column: the labels wrap and the detail lines clip. Two rows of
          shorter nodes stay legible at that width and collapse to a single
          column on a phone. */}
      <div className="grid grid-cols-1 items-stretch gap-1 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-2 sm:p-6">
        <Node icon={Smartphone} label="Termius" detail="on your phone" />
        <Connector label="tailnet" />
        <Node icon={Lock} label="Tailscale" detail="private network" />
        <Connector label="port 22" />
        <Node icon={Server} label="sshd" detail="on the Mac" />

        <div className="sm:col-span-5">
          <Connector down />
        </div>

        <div className="sm:col-span-5 grid grid-cols-1 items-stretch gap-1 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2">
          <Node icon={TerminalIcon} label="tmux" detail="holds the session open" accent />
          <Connector />
          <Node icon={Laptop} label="Claude Code" detail="keeps running either way" />
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        Each layer does exactly one job. Tailscale solves reachability, tmux solves persistence,
        and neither one knows about the other.
      </figcaption>
    </figure>
  );
}

/**
 * The failure this post exists to explain: which process started tmux decides
 * whether the login Keychain is reachable.
 */
export function SessionOwnership() {
  const rows = [
    {
      ok: true,
      title: "Started at the desk",
      chain: ["Terminal.app (GUI login)", "tmux server", "claude"],
      result: "Keychain unlocked, stays signed in",
    },
    {
      ok: false,
      title: "Started over SSH",
      chain: ["sshd (remote session)", "tmux server", "claude"],
      result: "Keychain unreachable, asks you to log in",
    },
  ];

  return (
    <figure className="my-10 grid gap-4 md:grid-cols-2">
      {rows.map((row) => {
        const color = row.ok ? "var(--syntax-green)" : "var(--syntax-magenta)";
        const Icon = row.ok ? Check : X;

        return (
          <div
            key={row.title}
            className="rounded-xl border p-5"
            style={{
              borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
              backgroundColor: `color-mix(in oklab, ${color} 5%, transparent)`,
            }}
          >
            <p className="mb-4 flex items-center gap-2 font-mono text-sm" style={{ color }}>
              <Icon className="h-4 w-4" aria-hidden />
              {row.title}
            </p>

            <ol className="space-y-1.5">
              {row.chain.map((step, i) => (
                <li
                  key={step}
                  className="font-mono text-xs text-muted-foreground"
                  style={{ paddingLeft: `${i * 14}px` }}
                >
                  {i > 0 ? "└─ " : ""}
                  {step}
                </li>
              ))}
            </ol>

            <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-foreground/80">
              {row.result}
            </p>
          </div>
        );
      })}
    </figure>
  );
}
