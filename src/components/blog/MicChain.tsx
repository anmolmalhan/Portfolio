import { Keyboard, Mic, Radio, Type, Usb } from "lucide-react";

/**
 * The signal path for the DJI mic post, built from HTML rather than SVG for the
 * same reason as Diagrams.tsx: an SVG wide enough to hold four labelled hops
 * plus their payload values renders that text at roughly 6px on a phone.
 *
 * Laid out as a vertical stack at every width instead of reflowing horizontally.
 * The point of the diagram is that each hop *translates* the event into a
 * different representation, and a top-to-bottom list reads as a pipeline in a
 * way that a wrapped horizontal row does not. It also means the mono payload
 * strings, which are the actual content here, never have to shrink to fit.
 */

type Side = "hardware" | "mac";

const sideColor: Record<Side, string> = {
  hardware: "var(--syntax-amber)",
  mac: "var(--syntax-blue)",
};

function Hop({
  index,
  icon: Icon,
  side,
  what,
  payload,
}: {
  index: number;
  icon: typeof Mic;
  side: Side;
  what: string;
  payload: string;
}) {
  const color = sideColor[side];

  return (
    <li
      className="flex items-start gap-4 border-b border-border p-4 last:border-0 md:px-5"
      style={{ backgroundColor: `color-mix(in oklab, ${color} 5%, transparent)` }}
    >
      <span className="flex shrink-0 items-center gap-3 pt-0.5">
        <span className="font-mono text-[11px] tabular-nums" style={{ color }}>
          {String(index).padStart(2, "0")}
        </span>
        <Icon className="h-4 w-4" style={{ color }} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{what}</span>
        {/* overflow-wrap:anywhere rather than break-all. These payloads mix
            prose with unspaced identifiers, and break-all ignores the spaces,
            splitting ordinary words mid-syllable ("start s pairing"). anywhere
            takes the space breaks first and only splits a token when the token
            itself is wider than the column, which is what a phone needs. */}
        <span
          className="mt-1 block font-mono text-xs leading-relaxed [overflow-wrap:anywhere]"
          style={{ color }}
        >
          {payload}
        </span>
      </span>
    </li>
  );
}

/** Button press to dictation, and what the event looks like at each stage. */
export function MicSignalChain() {
  return (
    <figure className="my-10">
      <ol className="list-none overflow-hidden rounded-2xl border border-border bg-card p-0">
        <Hop
          index={1}
          icon={Mic}
          side="hardware"
          what="Tap the transmitter's link button"
          payload="short press only, holding it starts pairing instead"
        />
        <Hop
          index={2}
          icon={Radio}
          side="hardware"
          what="The receiver emits a consumer HID event"
          payload="consumer_key_code: volume_increment"
        />

        <li className="flex items-center justify-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
          <Usb className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            USB-C
          </span>
        </li>

        <Hop
          index={3}
          icon={Keyboard}
          side="mac"
          what="Karabiner rewrites it, scoped to this device"
          payload="vendor 11427 / product 16392 → key_code: f13"
        />
        <Hop
          index={4}
          icon={Type}
          side="mac"
          what="Your dictation app toggles on that key"
          payload='hotkeyTrigger = {"kind":"keyCode","keyCode":105}'
        />
      </ol>

      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        Four hops, and the event changes representation at every one. Nothing here is
        DJI-specific software: the receiver is an ordinary USB keyboard as far as macOS
        is concerned.
      </figcaption>
    </figure>
  );
}
