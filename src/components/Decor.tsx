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
 * Big Dipper as it hangs on a summer evening: handle arcing up and to the left,
 * bowl sitting low and right. Listed from the handle tip down, so scroll
 * progress lights the constellation top to bottom as the page moves.
 *
 * Star sizes come from the real apparent magnitudes, so Megrez is visibly the
 * faint one and Alioth, Dubhe, and Alkaid carry the shape, the way the actual
 * asterism reads. Dubhe is a K-class giant, so it alone is warm. Mizar brings
 * its companion Alcor, the classic eyesight test.
 */
const DIPPER = [
  { x: 42, y: 10, name: "Alkaid", mag: 1.86, warm: false, lx: 7, ly: 2, end: false },
  { x: 30, y: 48, name: "Mizar", mag: 2.23, warm: false, lx: -7, ly: 2, end: true },
  { x: 26, y: 80, name: "Alioth", mag: 1.77, warm: false, lx: -7, ly: 2, end: true },
  { x: 40, y: 110, name: "Megrez", mag: 3.31, warm: false, lx: 6, ly: -4, end: false },
  { x: 72, y: 112, name: "Phecda", mag: 2.44, warm: false, lx: 7, ly: 2, end: false },
  { x: 78, y: 168, name: "Merak", mag: 2.37, warm: false, lx: 7, ly: 2, end: false },
  { x: 34, y: 160, name: "Dubhe", mag: 1.79, warm: true, lx: 2, ly: 9, end: false },
] as const;

const POINTS = DIPPER.map((s) => `${s.x},${s.y}`).join(" ");

/** Apparent magnitude to drawn radius: brighter star, bigger point. */
const starR = (mag: number) => (4.9 - mag) * 0.62;

/**
 * Constellation in the margin, lighting star by star with scroll progress.
 * Once the bowl completes, the pointer stars do their real job: Merak through
 * Dubhe, a dashed line out to Polaris. The dipper is how you find the way.
 */
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
  // The Polaris pointer earns its reveal only near the end of the page.
  const pointer = Math.min(1, Math.max(0, (progress - 0.72) / 0.28));

  return (
    // Background scale: the left quarter of the viewport is the dipper's band.
    // z-0 keeps it behind the content column (main sits at z-10), so it reads
    // as sky, not furniture.
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-[25vw] lg:flex lg:items-center lg:justify-center"
    >
      {/* viewBox starts at -16 so the Polaris pointer, which extends past the
          bowl to the left, stays inside the drawing on every viewport. */}
      <svg viewBox="-16 0 116 180" className="max-h-[88vh] w-full overflow-visible">
        <defs>
          {/* One blur, reused by every lit star's halo. */}
          <filter id="star-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Bowl's fourth side, Dubhe back to Megrez. Not on the progress path,
            so it stays faint. */}
        <line x1="34" y1="160" x2="40" y2="110" stroke="var(--hairline)" strokeWidth="0.55" />
        <polyline points={POINTS} fill="none" stroke="var(--hairline)" strokeWidth="0.55" />
        {/* pathLength=1 lets the dash offset be the scroll fraction directly.
            Two passes: a soft glow under a crisp line, like starlight. */}
        <polyline
          points={POINTS}
          fill="none"
          stroke="#fff"
          strokeWidth="1.7"
          opacity="0.3"
          filter="url(#star-glow)"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />
        <polyline
          points={POINTS}
          fill="none"
          stroke="#fff"
          strokeWidth="0.75"
          opacity="0.9"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />

        {/* Star chart caption, sitting inside the bowl. */}
        <text
          x="56"
          y="140"
          textAnchor="middle"
          fontSize="3.6"
          letterSpacing="0.2em"
          fill="var(--muted-foreground)"
          opacity="0.4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          BIG DIPPER
        </text>

        {/* The Pointers: Merak through Dubhe leads to Polaris, and to north. */}
        <g opacity={pointer}>
          <line
            x1="34"
            y1="160"
            x2="-3"
            y2="153.3"
            stroke="#fff"
            strokeWidth="0.4"
            strokeDasharray="1.6 2.4"
            opacity="0.5"
          />
          <g transform="translate(-5 152.9)">
            <circle r="3.6" fill="#fff" opacity="0.5" filter="url(#star-glow)" />
            <path
              d="M0 -3.6 V3.6 M-3.6 0 H3.6"
              stroke="#fff"
              strokeWidth="0.45"
              strokeLinecap="round"
              opacity="0.8"
            />
            <circle r="1.1" fill="#fff" />
          </g>
          <text
            x="-5"
            y="144"
            textAnchor="middle"
            fontSize="3.2"
            fill="var(--muted-foreground)"
            opacity="0.75"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Polaris
          </text>
        </g>

        {DIPPER.map((s, i) => {
          const on = Math.min(1, Math.max(0, lead - i + 1));
          const r = starR(s.mag);
          const color = s.warm ? "#ffd9a8" : "#d7e5ff";
          const spike = r * (2.8 + on * 2.6);
          return (
            <g key={s.name} transform={`translate(${s.x} ${s.y})`}>
              {/* Breathe wraps the whole star so halo, spikes, and core
                  shimmer together. Duration and delay vary per star, so the
                  sky never pulses in unison. */}
              <g
                className="star-breathe"
                style={{ animationDuration: `${3.2 + (i % 3) * 0.9}s`, animationDelay: `${i * 0.7}s` }}
              >
                <circle r={r * 3.3} fill={color} opacity={0.16 + on * 0.5} filter="url(#star-glow)" />
                {/* Diffraction spikes, the classic star-chart cross. Only a
                    star the scroll has reached earns them. */}
                <path
                  d={`M0 ${-spike} V${spike} M${-spike} 0 H${spike}`}
                  stroke={color}
                  strokeWidth="0.45"
                  strokeLinecap="round"
                  opacity={on * 0.85}
                />
                <circle r={r * (0.8 + on * 0.35)} fill="#fff" opacity={0.7 + on * 0.3} />
              </g>
              {/* Alcor rides just above Mizar, the old eyesight test. */}
              {s.name === "Mizar" && (
                <g className="star-breathe" style={{ animationDuration: "4.6s", animationDelay: "1.9s" }}>
                  <circle cx="4.5" cy="-3.6" r="1.9" fill={color} opacity={0.12 + on * 0.3} filter="url(#star-glow)" />
                  <circle cx="4.5" cy="-3.6" r="0.7" fill="#fff" opacity={0.6 + on * 0.4} />
                </g>
              )}
              <text
                x={s.lx}
                y={s.ly}
                textAnchor={s.end ? "end" : "start"}
                fontSize="3.1"
                fill="var(--muted-foreground)"
                opacity={0.25 + on * 0.45}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.name}
              </text>
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

/**
 * Pantry AI's answer to the Big Dipper: the life of one meal, drawn as the
 * line-art doodles the pantry wallpaper already speaks. Six stages, top to
 * bottom, lit by scroll progress; the payoff line lands at the end of the
 * page. Every path strokes currentColor, so each stage renders twice: a muted
 * base and an accent copy fading in as the reader reaches it.
 */
const JOURNEY = [
  {
    y: 24,
    label: "ingredients",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* Dry spaghetti, banded */}
        <path d="M-16 -13 L-11 13 M-13 -14 L-8 12 M-10 -14.5 L-5 11.5 M-7 -14 L-2 11" />
        <path d="M-17 -2 L-5 -4 M-16.5 1 L-4.5 -1" />
        {/* Garlic */}
        <path d="M11 -15 C10 -12 6 -11.5 6 -8 C6 -4.7 8.5 -3 11 -3 C13.5 -3 16 -4.7 16 -8 C16 -11.5 12 -12 11 -15 Z M11 -8 V-3" />
        {/* Tomato */}
        <circle cx="10" cy="8" r="5.5" />
        <path d="M10 2.5 l-2.5 -2.5 M10 2.5 l2.5 -2.5 M10 2.5 V0" />
        {/* Basil leaf */}
        <path d="M-9 16 Q-4 10 2 15 Q-3 21 -9 16 Z M-7.5 15.6 L0 14.8" />
      </g>
    ),
  },
  {
    y: 88,
    label: "prep",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* Board */}
        <rect x="-15" y="2" width="30" height="12" rx="3" />
        {/* Knife */}
        <path d="M-13 -9 H3 L1.5 -4.5 H-11 Q-14.5 -6.5 -13 -9 Z" />
        <path d="M3 -6.75 H12" strokeWidth="2.4" />
        {/* Chopped bits */}
        <path d="M-8 6 h2 v2 h-2 Z M-2 8 h2 v2 h-2 Z M4 6 h2 v2 h-2 Z" />
      </g>
    ),
  },
  {
    y: 152,
    label: "boil",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* Pot with handles */}
        <path d="M-15 -3 H15 M-12 -3 V8 Q-12 11 -9 11 H9 Q12 11 12 8 V-3 M-15 0 H-18 M15 0 H18" />
        {/* Spaghetti leaning out */}
        <path d="M-3 -3 L3 -17 M1 -3 L8 -16" />
        {/* Steam */}
        <path d="M-8 -8 q-2.5 -3.5 0 -7 M-4 -9 q-2 -3 0 -6" />
      </g>
    ),
  },
  {
    y: 216,
    label: "sauce",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* Pan and handle */}
        <rect x="-16" y="-2" width="24" height="9.5" rx="2.5" />
        <path d="M8 1 H20" strokeWidth="2.2" />
        {/* Sauce wave and tomato bits */}
        <path d="M-11 2.5 Q-8 -0.5 -5 2.5 Q-2 5.5 1 2.5" />
        <circle cx="-9" cy="4.5" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="-2" cy="5" r="0.7" fill="currentColor" stroke="none" />
        {/* Steam */}
        <path d="M-6 -7 q-2 -3 0 -6 M0 -8 q-2 -3 0 -6" />
      </g>
    ),
  },
  {
    y: 280,
    label: "plate",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle r="15" />
        <circle r="10" opacity="0.6" />
        {/* Noodle twirl */}
        <path d="M-6 -1 A6 5 0 1 1 5.5 1.5 A4 3.5 0 1 1 -3 2 A2 1.7 0 1 1 1.5 2" />
        <circle cx="3" cy="-4" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="-4" cy="4" r="0.8" fill="currentColor" stroke="none" />
        <path d="M0 -6 l2 -2" />
      </g>
    ),
  },
  {
    y: 344,
    label: "done",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* Empty plate, cutlery laid together: finished */}
        <circle r="15" />
        <circle r="10" opacity="0.6" />
        <path d="M-6 8 L8 -8 M8 -8 l1.5 -3 M8 -8 l3 -1.5" />
        <path d="M-9 4 L5 -12" />
        {/* A small shine for a meal used well */}
        <path d="M15 -14 v-4 M15 -14 v4 M13 -16 h4 M13 -12 h4" strokeWidth="0.9" />
      </g>
    ),
  },
] as const;

const JOURNEY_LINE = "M40 45V67M40 109V131M40 173V195M40 237V259M40 301V323";

export function PantryJourney() {
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

  // Leading stage index, fractional so each one fades in rather than snaps.
  const lead = progress * (JOURNEY.length - 1);
  // The moral of the story arrives with the last stretch of the page.
  const payoff = Math.min(1, Math.max(0, (progress - 0.75) / 0.25));

  return (
    // Same band as the Big Dipper: left quarter, full height, behind content.
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-[25vw] lg:flex lg:items-center lg:justify-center"
    >
      <svg viewBox="0 0 100 384" className="max-h-[90vh] w-full overflow-visible">
        {/* Dotted route between stages, then the accent line drawing over it. */}
        <path d={JOURNEY_LINE} fill="none" stroke="var(--hairline)" strokeWidth="0.8" strokeDasharray="0.5 3" strokeLinecap="round" />
        <path
          d={JOURNEY_LINE}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          opacity="0.8"
        />

        {JOURNEY.map((s, i) => {
          const on = Math.min(1, Math.max(0, lead - i + 1));
          return (
            <g key={s.label} transform={`translate(40 ${s.y})`}>
              <g style={{ color: "var(--muted-foreground)" }} opacity={0.35}>
                {s.art}
              </g>
              <g style={{ color: "var(--accent)" }} opacity={on}>
                {s.art}
              </g>
              <text
                x="27"
                y="2"
                fontSize="4"
                fill="var(--muted-foreground)"
                opacity={0.4 + on * 0.45}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* The point of the pantry, spelled out once the plate is clean. */}
        <text
          x="50"
          y="376"
          textAnchor="middle"
          fontSize="3.6"
          letterSpacing="0.18em"
          fill="var(--accent)"
          opacity={payoff * 0.9}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          USED WELL, NOT WASTED
        </text>
      </svg>
    </div>
  );
}
