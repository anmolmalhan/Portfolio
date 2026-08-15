import { ChevronRight, Copy, KeyRound, Plus } from "lucide-react";

/**
 * Drawn stand-ins for the three Termius screens on the phone.
 *
 * Same reasoning as UiSketch: Termius publishes a logo pack but no screenshots
 * licensed for reuse, and a borrowed capture would show a different app version
 * from the one the reader has. These are schematic on purpose. The reader needs
 * to know which fields to fill and what a working session looks like, not what
 * Termius's exact button radii are.
 *
 * Every value here is a placeholder. Never substitute real addresses or device
 * names into published copy.
 */

function PhoneFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[1.75rem] border-[6px] border-foreground/10 bg-card shadow-sm">
      <div className="flex items-center justify-center border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="text-xs font-medium text-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, chevron = false }: { label: string; value: string; chevron?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1 font-mono text-[11px] text-foreground">
        {value}
        {chevron ? <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden /> : null}
      </span>
    </div>
  );
}

/** Step 4a: the generated key, before its public half is copied out. */
export function TermiusKeySketch() {
  return (
    <figure className="my-10">
      <PhoneFrame title="Keychain">
        <div className="p-3">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <KeyRound className="h-3.5 w-3.5" style={{ color: "var(--syntax-blue)" }} aria-hidden />
            <span className="text-[11px] font-medium text-foreground">iPhone key</span>
            <span className="ml-auto rounded-full border border-border px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
              ED25519
            </span>
          </div>

          <div className="rounded-lg border border-border">
            <Field label="Type" value="Ed25519" />
            <Field label="Fingerprint" value="SHA256:a1b2..." />
          </div>

          <div
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-medium"
            style={{
              backgroundColor: "color-mix(in oklab, var(--syntax-blue) 12%, transparent)",
              color: "var(--syntax-blue-on-tint)",
            }}
          >
            <Copy className="h-3 w-3" aria-hidden />
            Copy public key
          </div>
        </div>
      </PhoneFrame>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        Termius generates the key on the phone. Only the public half ever leaves it, which is why
        this is safer than syncing a key you already have.
      </figcaption>
    </figure>
  );
}

/** Step 4b: the host entry, showing which four fields actually matter. */
export function TermiusHostSketch() {
  return (
    <figure className="my-10">
      <PhoneFrame title="New Host">
        <div className="p-3">
          <div className="rounded-lg border border-border">
            <Field label="Address" value="100.64.0.12" />
            <Field label="Port" value="22" />
            <Field label="Username" value="you" />
            <Field label="Key" value="iPhone key" chevron />
          </div>

          {/* Labelled Pro because snippets are not on the free Starter plan.
              Showing it unmarked implied the whole walkthrough was free. */}
          <p className="mt-3 mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            Startup snippet
            <span
              className="rounded px-1 py-px text-[8px] font-semibold not-italic"
              style={{
                backgroundColor: "color-mix(in oklab, var(--syntax-amber) 20%, transparent)",
                color: "var(--syntax-amber)",
              }}
            >
              PRO
            </span>
          </p>
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[10px] text-foreground">
            tmux attach -t claude
          </div>

          <div
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-medium"
            style={{
              backgroundColor: "color-mix(in oklab, var(--syntax-blue) 12%, transparent)",
              color: "var(--syntax-blue-on-tint)",
            }}
          >
            <Plus className="h-3 w-3" aria-hidden />
            Save host
          </div>
        </div>
      </PhoneFrame>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        The address is the tailnet one, never a public IP. The startup snippet turns opening the
        app into resuming the session, though it needs a Pro plan and typing the command yourself
        works just as well.
      </figcaption>
    </figure>
  );
}

/** Step 6: what a correctly attached session looks like, tmux status bar and all. */
export function TermiusAttachedSketch() {
  return (
    <figure className="my-10">
      <PhoneFrame title="my-macbook">
        <div className="flex h-[185px] flex-col">
          <div className="flex-1 space-y-1 p-3 font-mono text-[10px] leading-relaxed">
            <p className="text-muted-foreground">
              <span style={{ color: "var(--syntax-green)" }}>$ </span>
              tmux attach -t claude
            </p>
            <p className="text-foreground">Refactoring auth middleware...</p>
            <p className="text-muted-foreground">✓ Updated 3 files</p>
            <p className="text-muted-foreground">✓ Tests passing</p>
            <p className="text-foreground">
              Running build
              <span
                className="ml-1 inline-block h-3 w-1.5 translate-y-0.5"
                style={{ backgroundColor: "var(--syntax-blue)" }}
                aria-hidden
              />
            </p>
          </div>

          {/* The status bar is the tell: if this strip is missing you are in a
              bare SSH shell and nothing you run will survive disconnecting. */}
          <div
            className="flex items-center gap-2 px-2 py-1 font-mono text-[9px]"
            style={{ backgroundColor: "color-mix(in oklab, var(--syntax-green) 18%, transparent)" }}
          >
            <span
              className="rounded px-1.5 py-0.5 font-semibold"
              style={{ backgroundColor: "var(--syntax-green)", color: "var(--background)" }}
            >
              claude
            </span>
            <span className="text-foreground">0:zsh*</span>
            <span className="ml-auto text-muted-foreground">14:32</span>
          </div>
        </div>
      </PhoneFrame>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        The green strip along the bottom is the tmux status bar. If you cannot see it, you are in a
        plain SSH shell and whatever you start will die when the connection drops.
      </figcaption>
    </figure>
  );
}
