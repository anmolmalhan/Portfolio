import Image from "next/image";
import { cn } from "@/lib/utils";

type FigureProps = {
  /** Omit while the screenshot is still to be taken: the slot renders as a
   *  labelled placeholder at the exact final aspect ratio, so the page never
   *  reflows when the real file lands. */
  src?: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** Instruction shown inside an empty slot. Doubles as the shot list. */
  shot?: string;
  /** Phone captures are portrait and would otherwise render absurdly tall on a
   *  desktop viewport, so they are capped to a readable column. */
  device?: "phone" | "desktop";
  /** Set on the first in-view figure only. */
  priority?: boolean;
};

/**
 * A figure in post body copy.
 *
 * width/height are required, not optional. Post images sit below the fold in
 * long text and an unreserved box is the classic CLS source: the paragraph
 * below jumps when the image decodes. Passing intrinsic dimensions lets
 * next/image reserve the ratio up front.
 */
export function Figure({
  src,
  alt,
  caption,
  width,
  height,
  shot,
  device = "desktop",
  priority = false,
}: FigureProps) {
  const framed = device === "phone" ? "max-w-[300px] mx-auto" : "w-full";

  return (
    <figure className="my-10 md:my-12">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-muted",
          framed,
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={device === "phone" ? "300px" : "(max-width: 768px) 100vw, 768px"}
            priority={priority}
            className="w-full h-auto"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 p-8 text-center"
            style={{ aspectRatio: `${width} / ${height}` }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              screenshot slot
            </span>
            <span className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {shot ?? alt}
            </span>
          </div>
        )}
      </div>

      {caption ? (
        <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
