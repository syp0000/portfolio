import type { CSSProperties, ReactNode } from "react";
import { shotDims, shotImages } from "@/lib/shots";

export type FrameKind = "phone" | "browser";

/**
 * Portrait captures came off a phone, landscape ones off a desktop, so the
 * frame follows from the file's own dimensions. No per-screenshot config to
 * keep in sync when shots are added.
 */
export function frameKind(file?: string): FrameKind {
  const d = file ? shotDims[file] : undefined;
  return d && d.h > d.w ? "phone" : "browser";
}

// Fixed black rather than a theme token: a cast shadow should read as shadow on
// every palette, and --foreground inverts to near-white on the dark themes.
const LIFT = "shadow-[0_28px_60px_-30px_rgb(0_0_0/0.55)]";

/**
 * Puts a screenshot inside the device it was taken on: browser chrome for
 * desktop captures, a handset bezel for phone ones.
 */
export function DeviceFrame({
  kind,
  className = "",
  style,
  children,
}: {
  kind: FrameKind;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  if (kind === "phone") {
    return (
      // flex column with a min-h-0 screen: when the frame is given a definite
      // height, the screen inherits one, which is what lets a child image size
      // itself by aspect ratio instead of stretching the bezel wide.
      <div
        className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-hairline bg-card p-2 ${LIFT} ${className}`}
        style={style}
      >
        {/* Speaker slot, the one detail that reads as "phone" at small sizes. */}
        <div className="flex shrink-0 justify-center pb-1.5 pt-0.5">
          <span className="h-1 w-10 rounded-full bg-foreground/20" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-[1.25rem]">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-hairline bg-card ${LIFT} ${className}`}
      style={style}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-hairline bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

/**
 * A framed screenshot sized by height rather than width: set a height on it and
 * the width follows the capture's own ratio. Used where a shot sits beside
 * something else, so it has to fit a slot rather than fill a column.
 */
export function StandingShot({
  file,
  alt = "",
  className = "",
}: {
  file: string;
  alt?: string;
  className?: string;
}) {
  const d = shotDims[file];
  return (
    <DeviceFrame
      kind={frameKind(file)}
      className={className}
      // Without an explicit ratio a height-only frame has no width basis and
      // stretches to fill its line.
      style={d ? { aspectRatio: `${d.w} / ${d.h}` } : undefined}
    >
      <img
        src={shotImages[file]}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        loading="lazy"
        decoding="async"
        className="block h-full w-full object-cover object-top"
      />
    </DeviceFrame>
  );
}
