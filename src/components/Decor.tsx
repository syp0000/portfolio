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
 * PantryAI food journey: loose hand-drawn line art travelling a soft S down
 * the band beside the case study. Phase 1, pantry ingredients surface
 * scattered along the top of the S; phase 2, they drift toward the middle and
 * hand off to a brief swirl of pasta on a fork; phase 3, everything resolves
 * into one finished plate that holds. Scroll owns all of it, nothing loops,
 * and there is not a word of text: the picture is the explanation.
 *
 * Ingredients stay lighter than body copy; the plate alone gets to be darker,
 * being the point of the story. Reduced motion swaps the choreography for a
 * static composition of ingredients leading to the plate.
 */
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Shared ink, one stroke weight throughout. */
function Ink({ children }: { children: React.ReactNode }) {
  return (
    <g fill="none" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  );
}

const ING_ART = {
  bundle: (
    <Ink>
      <path d="M-5 -14 L0 13 M-2 -15 L3 12 M1 -15 L6 12 M4 -14 L9 11" />
      <path d="M-7 -3 L6 -6 L7 0 L-6 3 Z" />
    </Ink>
  ),
  tomatoes: (
    <Ink>
      <circle cx="-4" cy="2" r="3.4" />
      <circle cx="3.5" cy="4" r="2.8" />
      <circle cx="1" cy="-3.5" r="3" />
      <path d="M-4 -1.4 l-1 -1.6 M1 -6.5 l0.8 -1.6 M3.5 1.2 l1.2 -1.4" />
    </Ink>
  ),
  pepper: (
    <Ink>
      <path d="M0 -8 C-6 -8 -8 -2 -7 3 C-6 8 -3 10.5 0 10.5 C3 10.5 6 8 7 3 C8 -2 6 -8 0 -8 Z" />
      <path d="M-2.5 10 C-2.6 4 -2.6 -2 -1.6 -7.6 M2.5 10 C2.6 4 2.6 -2 1.6 -7.6" />
      <path d="M0 -8 C0.2 -10 -0.8 -11 -1.8 -12.2 M-3 -9.6 q3 -1.4 6 0" />
    </Ink>
  ),
  basil: (
    <Ink>
      <path d="M-9 2 C-7 -3 -2 -4.5 2 -2 C0.5 3 -4.5 5 -9 2 Z" />
      <path d="M-7.5 1.6 C-5 -0.9 -2 -1.9 1 -1.6" />
      <path d="M2 3.5 C4 0.3 8 -0.3 10.5 1.5 C9.4 4.9 5.6 6.1 2 3.5 Z" />
      <path d="M3.4 3.4 C5.8 1.6 8.2 1.4 9.7 1.8" />
    </Ink>
  ),
  oil: (
    <Ink>
      <path d="M-2.5 -13 h5 v3.5 c3 1.5 4.5 4 4.5 7 v11.5 a2.5 2.5 0 0 1 -2.5 2.5 h-9 a2.5 2.5 0 0 1 -2.5 -2.5 v-11.5 c0 -3 1.5 -5.5 4.5 -7 z" />
      <path d="M-3.2 -14.6 h6.4 M-6 3 q3 -1.4 6 0 t6 0" />
    </Ink>
  ),
  swirl: (
    <Ink>
      <path d="M0 13 V0 M-3 -10 V-2.5 M0 -11 V-2.5 M3 -10 V-2.5 M-3 -2.5 Q0 0 3 -2.5" />
      <path d="M-7 -7 A7 5.6 0 1 0 7 -8 M5.5 -10.5 A4.5 3.6 0 1 1 -4.5 -9" />
    </Ink>
  ),
  plate: (
    <Ink>
      <path d="M-15 0 C-15 -8.5 -8.5 -15.2 0 -15 C8.8 -14.8 15.2 -8.3 15 0 C14.8 8.6 8.4 15.2 0 15 C-8.6 14.8 -15 8.4 -15 0 Z" />
      <path d="M-9.5 0.5 C-9 -5.3 -4.5 -9.4 1 -9 C6.4 -8.6 9.7 -4.5 9.2 0.8 C8.7 5.7 4.3 9.4 -0.8 9.1 C-5.7 8.8 -9.7 5.3 -9.5 0.5 Z" opacity="0.75" />
      <path d="M-7.5 -3 q2 -1.7 4.3 -0.6 M-2.5 -7 q2.4 -1 4.6 0.2 M4.5 -5.5 q2 0.9 2.7 3 M6.5 2 q-0.4 2.5 -2.5 3.9 M0.5 7.3 q-2.6 0.6 -4.7 -0.8 M-6.6 3.8 q-1.4 -2 -1.1 -4.2" opacity="0.75" />
      <path d="M-0.5 -2.5 c0.8 -1.6 2.6 -2 3.6 -1 c-0.6 1.4 -2.4 1.9 -3.6 1 Z" />
    </Ink>
  ),
};

/** Rest pose on the S, entry drift, and the progress marks of each life. */
const INGREDIENTS = [
  { art: ING_ART.bundle, x: 60, y: 42, r: -6, enter: 0.03, fade: 0.46, drift: 14 },
  { art: ING_ART.tomatoes, x: 33, y: 82, r: 5, enter: 0.08, fade: 0.54, drift: 12 },
  { art: ING_ART.pepper, x: 63, y: 116, r: 7, enter: 0.14, fade: 0.5, drift: 13 },
  { art: ING_ART.basil, x: 29, y: 146, r: -8, enter: 0.11, fade: 0.57, drift: 12 },
  { art: ING_ART.oil, x: 59, y: 176, r: 4, enter: 0.21, fade: 0.59, drift: 14 },
] as const;

const CENTER = { x: 46, y: 208 };

export function PantryJourney() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reduced motion: a still life, ingredients leading to the plate.
  const p = reduced ? null : progress;

  const swirlIn = p === null ? 0 : smooth((p - 0.36) / 0.1);
  const swirlOut = p === null ? 1 : smooth((p - 0.62) / 0.1);
  const plateIn = p === null ? 1 : smooth((p - 0.6) / 0.16);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-[25vw] lg:flex lg:items-center lg:justify-center"
    >
      <svg viewBox="0 0 100 380" className="max-h-[90vh] w-full overflow-visible">
        {INGREDIENTS.map((g) => {
          // Each ingredient: drifts up into its rest pose, later slides toward
          // the centre of the S and fades. Staggered marks keep the five from
          // ever moving as one.
          const a = p === null ? 1 : smooth((p - g.enter) / 0.09);
          const f = p === null ? 0 : smooth((p - g.fade) / 0.12);
          const c = p === null ? 0 : smooth((p - 0.44) / 0.2);
          const o = a * (1 - f) * (p === null ? 0.55 : 0.75);
          if (o <= 0.01) return null;
          const x = g.x + (CENTER.x - g.x) * c * 0.8;
          const y = g.y + g.drift * (1 - a) + (CENTER.y - g.y) * c * 0.8;
          const r = g.r * (1 - a * 0.4) + c * 6;
          return (
            <g key={g.x + "-" + g.y} opacity={o} transform={`translate(${x} ${y}) rotate(${r}) scale(1.25)`}>
              {g.art}
            </g>
          );
        })}

        {/* The brief middle beat: pasta on the fork, mixing */}
        {swirlIn > 0.01 && swirlOut < 0.99 && (
          <g
            opacity={swirlIn * (1 - swirlOut) * 0.85}
            transform={`translate(${CENTER.x} ${CENTER.y}) rotate(${-6 + 12 * (p ?? 0.5)}) scale(${1.2 + swirlIn * 0.25})`}
          >
            {ING_ART.swirl}
          </g>
        )}

        {/* The meal. Alone on the page by the time it settles, and the one
            drawing allowed to be darker than the rest. */}
        {plateIn > 0.01 && (
          <g
            opacity={plateIn * 0.95}
            transform={`translate(46 ${302 - (1 - plateIn) * 10}) scale(${1.35 + plateIn * 0.25})`}
          >
            {ING_ART.plate}
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * NCR Assistant's counterpart: one circuit, run long and vertical, drawn in
 * the ladder-logic vocabulary of the plant floor. A single wire threads
 * through contacts, splits into a parallel branch, and lands on a coil.
 * Monochrome by design: no status colors, just ink and current. The only
 * words on the board are the fault contact's.
 *
 * The life in it is the current: scroll energizes the wire top to bottom, a
 * pulse runs the energized stretch, each contact visibly closes as power
 * reaches it, and the coil breathes once it latches.
 */
/* Dead wire, drawn with open gaps at every contact and at the coil. */
const WIRE = [
  "M30 8 V58",
  "M30 62 V108",
  "M30 112 V158",
  "M30 162 V196",
  "M30 196 H22 V224",
  "M22 228 V244 H30",
  "M30 196 H38 V224",
  "M38 228 V244 H30",
  "M30 244 V304",
  "M30 316 V366",
].join(" ");

/* The current's actual route: ONE continuous subpath, top to bottom through
 * the left branch. pathLength dash-drawing on a multi-subpath path advances
 * every subpath at once in Chromium, which read as the whole board growing
 * simultaneously; a single subpath draws strictly in order. Running unbroken
 * through the contact gaps is the point: current arriving is what closes them. */
const WIRE_LIVE = "M30 8 V196 H22 V244 H30 V366";

/* The parallel branch is a spur off the route: it energizes as a unit when
 * current reaches the split, rather than being drawn along. */
const WIRE_SPUR = "M30 196 H38 V224 M38 228 V244 H30";

/** Contacts along the wire: x center, y center, cumulative distance from the
 *  top of the path, half-width of the plates, normally-closed slash. */
type WireContact = { x: number; y: number; d: number; w: number; nc: boolean; fault?: boolean };
const CONTACTS: readonly WireContact[] = [
  { x: 30, y: 60, d: 52, w: 6, nc: false },
  { x: 30, y: 110, d: 102, w: 6, nc: false },
  { x: 30, y: 160, d: 152, w: 6, nc: true, fault: true },
  { x: 22, y: 226, d: 226, w: 5, nc: false },
  { x: 38, y: 226, d: 226, w: 5, nc: true },
];

const WIRE_LEN = 374;
const COIL_D = 318;
const SPUR_D = 226;

export function NcrSchematic() {
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

  // How energized an element at distance d along the wire is, 0..1.
  const energize = (d: number) => Math.min(1, Math.max(0, (progress * WIRE_LEN - d) / 25));
  const coilOn = energize(COIL_D);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-[25vw] lg:flex lg:items-center lg:justify-center"
    >
      <svg viewBox="6 0 100 384" className="max-h-[90vh] w-full overflow-visible">
        {/* Dead wire, then the energized run, then the current itself. */}
        <path d={WIRE} fill="none" stroke="var(--hairline)" strokeWidth="0.7" />
        <path
          d={WIRE_LIVE}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="0.75"
          opacity="0.85"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />
        <path
          d={WIRE_SPUR}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="0.75"
          opacity={energize(SPUR_D) * 0.85}
        />
        <g opacity={progress * 0.6}>
          <path
            className="sig-pulse"
            d={WIRE_LIVE}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="1"
            strokeDasharray="2 16"
            strokeLinecap="round"
          />
        </g>

        {CONTACTS.map((c) => {
          const on = energize(c.d);
          const horizontal = `M${c.x - c.w} ${c.y - 2} H${c.x + c.w} M${c.x - c.w} ${c.y + 2} H${c.x + c.w}`;
          return (
            <g key={c.x + "-" + c.y}>
              {/* Contact plates, dead then energized */}
              <path d={horizontal} fill="none" stroke="var(--hairline)" strokeWidth="0.9" />
              <path d={horizontal} fill="none" stroke="var(--foreground)" strokeWidth="0.95" strokeLinecap="round" opacity={on * 0.9} />
              {c.nc && (
                <>
                  <path d={`M${c.x - 4.5} ${c.y + 4} L${c.x + 4.5} ${c.y - 4}`} fill="none" stroke="var(--hairline)" strokeWidth="0.6" />
                  <path d={`M${c.x - 4.5} ${c.y + 4} L${c.x + 4.5} ${c.y - 4}`} fill="none" stroke="var(--foreground)" strokeWidth="0.65" opacity={on * 0.9} />
                </>
              )}
              {/* The contact closing: the gap bridges only once power arrives */}
              <path d={`M${c.x} ${c.y - 2} V${c.y + 2}`} fill="none" stroke="var(--foreground)" strokeWidth="0.75" opacity={on} />
              {c.fault && (
                <text
                  x={c.x + 8.5}
                  y={c.y + 1}
                  fontSize="2.8"
                  letterSpacing="0.12em"
                  fill="var(--muted-foreground)"
                  opacity={0.45 + on * 0.4}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  SYSTEM FAULT
                </text>
              )}
            </g>
          );
        })}

        {/* Coil. Breathes once the circuit latches. */}
        <circle cx="30" cy="310" r="6" fill="none" stroke="var(--hairline)" strokeWidth="0.8" />
        <g className="star-breathe" opacity={coilOn}>
          <circle cx="30" cy="310" r="6" fill="none" stroke="var(--foreground)" strokeWidth="0.85" />
          <circle cx="30" cy="310" r="2" fill="var(--foreground)" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
