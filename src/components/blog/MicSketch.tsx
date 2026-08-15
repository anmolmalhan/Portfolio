import { ArrowRight, Check, ChevronDown, Volume2, X } from "lucide-react";

/**
 * UI sketches for the DJI mic post, drawn rather than captured, for the same
 * reasons set out in UiSketch.tsx: macOS chrome and third-party app windows are
 * proprietary, a borrowed capture shows a layout the reader does not have, and
 * a real screenshot of my own machine would carry my own dictation history and
 * device names into published copy.
 *
 * Each one covers a place a reader can actually get stuck, which is not the
 * same as every place there is a window. The command steps are transcripts, not
 * pictures, so they are handled by <Terminal>.
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

/** The proof-of-life signal: tapping the button moves the system volume. */
export function VolumeHudSketch() {
  return (
    <figure className="my-10">
      <div className="mx-auto max-w-[320px] rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-3 text-center text-sm font-medium text-foreground">Speakers</p>
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
            <span
              className="block h-full w-[86%] rounded-full"
              style={{ backgroundColor: "var(--syntax-amber)" }}
            />
          </span>
        </div>
      </div>

      <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
        Tap the link button with the receiver plugged in and the system volume HUD appears.
        That popup is the entire test. The button is already reaching your Mac, it is just
        talking about volume.
      </figcaption>
    </figure>
  );
}

/** The GUI route for the mapping, and the dropdown that scopes it to one device. */
export function KarabinerDeviceSketch() {
  return (
    <figure className="my-10">
      <Window title="Karabiner-Elements">
        <div className="p-4 md:p-5">
          <div className="mb-4 flex flex-wrap gap-1.5" aria-hidden>
            {["Simple Modifications", "Complex Modifications", "Devices"].map((tab) => (
              <span
                key={tab}
                className={`rounded-md px-2.5 py-1 text-xs ${
                  tab === "Simple Modifications"
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            Target device
          </p>
          <div
            className="mb-5 flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            style={{
              borderColor: "color-mix(in oklab, var(--syntax-blue) 40%, transparent)",
              backgroundColor: "color-mix(in oklab, var(--syntax-blue) 7%, transparent)",
            }}
          >
            <span className="min-w-0 truncate font-mono text-sm text-foreground">
              Wireless Microphone RX
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-lg border border-border p-3">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                From key
              </p>
              <p className="font-mono text-xs [overflow-wrap:anywhere] text-foreground">
                volume_increment
              </p>
            </div>
            {/* The pair stacks vertically below sm, where a rightward arrow
                reads as "continues to the right" against a flow that actually
                continues below. Same treatment as Connector in Diagrams.tsx. */}
            <ArrowRight
              className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0"
              aria-hidden
            />
            <div className="rounded-lg border border-border p-3">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                To key
              </p>
              <p className="font-mono text-xs text-foreground">f13</p>
            </div>
          </div>
        </div>
      </Window>

      <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
        The target device dropdown is the important control. Leave it on
        &ldquo;For all devices&rdquo; and you lose the volume keys on your actual keyboard.
      </figcaption>
    </figure>
  );
}

/** Which of the two hotkey rows to change, and why the other one cannot work. */
export function DictationHotkeySketch() {
  const rows = [
    {
      usable: false,
      title: "Push to talk",
      sub: "Hold to dictate, release to stop.",
      value: "Fn",
      why: "Needs a key held down. The link button only sends a momentary tap, so this row can never fire.",
    },
    {
      usable: true,
      title: "Hands-free mode",
      sub: "Tap to start; tap again to stop.",
      value: "F13",
      why: "Matches how the button behaves. This is the row to change.",
    },
  ];

  return (
    <figure className="my-10">
      <div className="flex flex-col gap-4">
        {rows.map((row) => {
          const color = row.usable ? "var(--syntax-green)" : "var(--syntax-magenta)";
          const Icon = row.usable ? Check : X;

          return (
            <div
              key={row.title}
              className="rounded-xl border p-4 md:p-5"
              style={{
                borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
                backgroundColor: `color-mix(in oklab, ${color} 5%, transparent)`,
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className="h-4 w-4 shrink-0" style={{ color }} aria-hidden />
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.sub}</p>
                </div>

                <span className="flex shrink-0 items-center gap-2">
                  <span className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground">
                    {row.value}
                  </span>
                  <span className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    Change…
                  </span>
                </span>
              </div>

              <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground/80">
                {row.why}
              </p>
            </div>
          );
        })}
      </div>

      <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
        Most dictation apps offer both. Picking the wrong row is the easiest way to lose an
        evening to a button that seems to do nothing.
      </figcaption>
    </figure>
  );
}
