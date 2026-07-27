import { useEffect, useState } from "react";
import { PencilSimple } from "@phosphor-icons/react";

/**
 * Background stars. Positions come from a hash of the index rather than
 * Math.random so server and client render the same sky (no hydration mismatch).
 */
const FIELD = Array.from({ length: 130 }, (_, i) => {
  const frac = (seed: number) => {
    const n = Math.sin(seed) * 43758.5453;
    return n - Math.floor(n);
  };
  return {
    left: frac(i * 12.9898) * 100,
    top: frac(i * 78.233 + 4) * 100,
    size: 1.2 + frac(i * 3.17 + 9) * 2.2,
    delay: frac(i * 5.71 + 2) * 6,
    dim: 0.4 + frac(i * 9.13 + 7) * 0.6,
  };
});

/** Slowly wheeling starfield for the dark routes. Decorative only. */
export function StarField() {
  return (
    /*
     * 145vmax is the smallest square whose inscribed circle still covers the
     * viewport at every angle (needs sqrt(2) x vmax), so the rotation never
     * swings an empty corner in. Bigger than that is wasted repaint area.
     * will-change promotes it to its own layer, keeping the spin on the GPU
     * instead of repainting a viewport-and-a-half every frame.
     */
    <div
      aria-hidden="true"
      style={{ willChange: "transform" }}
      className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[145vmax] w-[145vmax] -translate-x-1/2 -translate-y-1/2 [animation:sky-wheel_300s_linear_infinite] motion-reduce:animate-none"
    >
      {FIELD.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground motion-reduce:!animate-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.dim,
            animation: `twinkle ${4 + (i % 5)}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Big Dipper stood on end: Dubhe at the top, Alkaid at the bottom, so scroll
 * progress runs down the constellation. Coordinates are the real asterism
 * shape transposed into a 100x180 viewBox.
 */
const DIPPER = [
  [34, 20], // Dubhe
  [78, 12], // Merak
  [72, 68], // Phecda
  [40, 70], // Megrez
  [26, 100], // Alioth
  [30, 132], // Mizar
  [42, 170], // Alkaid
] as const;

const POINTS = DIPPER.map(([x, y]) => `${x},${y}`).join(" ");

/** Constellation in the margin, lighting star by star with scroll progress. */
export function BigDipper() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Leading star index, fractional so each one fades in rather than snaps.
  const lead = progress * (DIPPER.length - 1);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <svg viewBox="0 0 100 180" className="h-[26rem] w-[14.4rem] overflow-visible">
        <defs>
          {/* One blur, reused by every lit star's halo. */}
          <filter id="star-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
        {/* Bowl's fourth side. Not on the progress path, so it stays faint. */}
        <line x1="40" y1="70" x2="34" y2="20" stroke="var(--hairline)" strokeWidth="1" />
        <polyline points={POINTS} fill="none" stroke="var(--hairline)" strokeWidth="1" />
        {/* pathLength=1 lets the dash offset be the scroll fraction directly. */}
        <polyline
          points={POINTS}
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          opacity="0.85"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />
        {DIPPER.map(([x, y], i) => {
          const on = Math.min(1, Math.max(0, lead - i + 1));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="2.5" fill="var(--hairline)" />
              <circle cx={x} cy={y} r={7} fill="#fff" opacity={on * 0.75} filter="url(#star-glow)" />
              <circle cx={x} cy={y} r={2.5 + on * 1.5} fill="#fff" opacity={on} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export type CursorKind = "star" | "pencil" | "pantry";

/** Each route's follower, and the glow that keeps it legible on its ground. */
const CURSORS: Record<CursorKind, { glow: string; node: React.ReactNode }> = {
  star: {
    glow: "drop-shadow(0 0 7px rgba(255,255,255,0.85))",
    node: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="#fff">
        <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" />
      </svg>
    ),
  },
  pencil: {
    glow: "drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 70%, transparent))",
    node: <PencilSimple size={22} weight="fill" className="text-accent" />,
  },
  // The mascot is already high contrast, so it gets a cast shadow rather than a
  // glow, which would disappear against the light pantry ground.
  pantry: {
    glow: "drop-shadow(0 3px 6px rgba(0,0,0,0.28))",
    node: <img src="/PantryAI_LG.png" alt="" width={40} height={40} />,
  },
};

/**
 * A small mark trailing the pointer. Renders nothing until the first real
 * mousemove, so touch devices never get a marooned icon at the origin.
 */
export function CursorFollower({ kind }: { kind: CursorKind }) {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setAt({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!at) return null;
  const { glow, node } = CURSORS[kind];

  return (
    <div
      aria-hidden="true"
      // duration-500 is the lag: the mark eases toward the pointer instead of
      // pinning to it.
      className="pointer-events-none fixed left-0 top-0 z-50 -ml-2.5 -mt-2.5 transition-transform duration-500 ease-out motion-reduce:hidden"
      style={{ transform: `translate(${at.x}px, ${at.y}px)`, filter: glow }}
    >
      {node}
    </div>
  );
}
