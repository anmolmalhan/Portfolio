import { ChevronRight, Info } from "lucide-react";

/**
 * Original UI sketches for the two macOS steps.
 *
 * These are drawn, not captured. Screenshots of macOS and of the Tailscale
 * client are both proprietary and not licensed for reuse, and a borrowed
 * screenshot from an older OS would show a layout the reader does not have in
 * front of them. A sketch carries the same information, stays legible at phone
 * width, and follows the site theme.
 *
 * Deliberately schematic rather than a pixel-copy of Apple's chrome: the point
 * is which row to find and which control to flip, not a reproduction of the
 * settings window.
 */

function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="ml-1 text-xs font-medium text-muted-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full transition-colors"
      style={{ backgroundColor: on ? "var(--syntax-green)" : "var(--border)" }}
    >
      <span
        className="absolute h-[18px] w-[18px] rounded-full bg-white shadow-sm"
        style={{ left: on ? 18 : 2 }}
      />
    </span>
  );
}

/** Step 1: where Remote Login lives and what it should look like when on. */
export function SharingPaneSketch() {
  const rows = [
    { label: "Screen Sharing", on: false },
    { label: "File Sharing", on: false },
    { label: "Remote Login", on: true, highlight: true },
    { label: "Remote Management", on: false },
  ];

  return (
    <figure className="my-10">
      <Window title="System Settings">
        <div className="flex flex-col sm:flex-row">
          <div className="border-b border-border p-3 sm:w-40 sm:border-b-0 sm:border-r">
            {["General", "Network", "Privacy & Security"].map((item) => (
              <div
                key={item}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  item === "General" ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex-1 p-4">
            <p className="mb-3 text-sm font-medium text-foreground">Sharing</p>
            <div className="divide-y divide-border rounded-lg border border-border">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 px-3 py-2.5"
                  style={
                    row.highlight
                      ? { backgroundColor: "color-mix(in oklab, var(--syntax-green) 8%, transparent)" }
                      : undefined
                  }
                >
                  <span
                    className={`text-sm ${row.highlight ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {row.label}
                  </span>
                  <span className="flex items-center gap-2">
                    {row.highlight ? (
                      <Info className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    ) : null}
                    <Toggle on={row.on} />
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ChevronRight className="h-3 w-3" aria-hidden />
              Allow access for: Only these users
            </p>
          </div>
        </div>
      </Window>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        System Settings, General, Sharing. Remote Login on, and scoped to your account through the
        info button rather than left open to all users.
      </figcaption>
    </figure>
  );
}

/** Step 2: what a correctly connected Tailscale looks like, and where the address is. */
export function TailscaleMenuSketch() {
  return (
    <figure className="my-10">
      <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium text-foreground">Tailscale</span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--syntax-green)" }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--syntax-green)" }} />
            Connected
          </span>
        </div>

        <div className="px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">This device</p>
          {/* Placeholder identifiers only. Never put a real device name or
              tailnet address in published copy. */}
          <p className="mt-1.5 font-mono text-sm text-foreground">my-macbook</p>
          <p className="font-mono text-xs text-muted-foreground">100.64.0.12</p>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Network devices</p>
          <p className="mt-1.5 flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--syntax-green)" }} />
            my-iphone
          </p>
        </div>
      </div>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        The menu bar has to read Connected, not just installed. This is the first thing to check
        when the setup stops working.
      </figcaption>
    </figure>
  );
}
