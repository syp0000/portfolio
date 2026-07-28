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
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Paper-wrapped spaghetti bundle, on the diagonal */}
        <path d="M-19 -17 L-13 -2 M-16.5 -18 L-11 -2.5 M-14 -18.5 L-9 -3 M-11.5 -18 L-7 -3 M-21 -15.5 L-15 -1.5" />
        <path d="M-17 -6 L-5 -9 L-4 -3 L-16 0 Z" />
        <path d="M-16 -3 L-5 -6" strokeWidth="0.7" />
        <path d="M-15 0 L-11 13 M-13 -0.5 L-9 13.5 M-11 -1 L-7 13 M-9 -1.7 L-5 12 M-7 -2.2 L-2 11" />
        {/* Garlic bulb, clove lines and a little hatching */}
        <path d="M10 -19 C8.6 -16.5 5 -16 4.3 -12.2 C3.7 -8.8 6.5 -6.3 10 -6.3 C13.5 -6.3 16.3 -8.8 15.7 -12.2 C15 -16 11.4 -16.5 10 -19 Z" />
        <path d="M8.2 -6.6 C8 -10 8.6 -13.5 10 -19 M12 -6.6 C12.2 -10 11.6 -13.5 10 -19" strokeWidth="0.7" />
        <path d="M8 -6.3 l-0.5 1.4 M10 -6.2 l0 1.5 M12 -6.3 l0.5 1.4" strokeWidth="0.7" />
        <path d="M6.3 -8.6 q-0.8 -2.2 0 -4.2 M13.9 -8.8 q0.8 -2.2 0 -4.1" strokeWidth="0.7" />
        {/* Tomato with star calyx and a highlight */}
        <path d="M4 5 C4 1.6 6.6 -0.9 10 -0.9 C13.4 -0.9 16.1 1.7 16 5 C15.9 8.4 13.3 11 9.9 10.9 C6.5 10.8 4 8.3 4 5 Z" />
        <path d="M10 -0.9 l-3.2 -1.7 M10 -0.9 l-1.2 -3 M10 -0.9 l1.4 -2.9 M10 -0.9 l3.3 -1.5" strokeWidth="0.9" />
        <path d="M6.4 3.2 q0.5 -1.9 2.1 -2.7" strokeWidth="0.7" />
        {/* Basil, two veined leaves */}
        <path d="M-8 17.5 C-6 12.5 -1 11 3 13.5 C1.5 18.5 -3.5 20.5 -8 17.5 Z" />
        <path d="M-6.5 17 C-4 14.5 -1 13.5 2 13.8" strokeWidth="0.7" />
        <path d="M-4.8 15.8 l-0.8 1.7 M-2.4 14.6 l-0.7 1.9 M-0.2 13.9 l-0.5 1.9" strokeWidth="0.7" />
        <path d="M4.5 16.2 C6.3 13 10.2 12.4 12.8 14.2 C11.6 17.6 7.9 18.8 4.5 16.2 Z" />
        <path d="M5.8 16 C8.2 14.2 10.6 14 12.1 14.4" strokeWidth="0.7" />
      </g>
    ),
  },
  {
    y: 88,
    label: "prep",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Wooden board with grain and a handle hole */}
        <path d="M-16 4 L12 3.4 Q15.5 3.4 15.6 6.8 L15.8 11.6 Q15.8 14.8 12.4 14.9 L-13 15.4 Q-16.4 15.4 -16.3 12 Z" />
        <path d="M-13 8 q6 -1 12 0 t10 0.4 M-12 11.6 q6 1 12 0 t9 -0.6" strokeWidth="0.7" />
        <circle cx="12.6" cy="9" r="1.2" strokeWidth="0.9" />
        {/* Chef's knife, riveted handle */}
        <path d="M-15 -8.8 L2.5 -9.4 C1.8 -5.4 -1.5 -3.4 -6 -3.6 L-12.6 -4.4 C-15 -5.2 -15.8 -7 -15 -8.8 Z" />
        <path d="M2.6 -9.6 L13 -10.1 Q14.8 -10.2 14.7 -8.4 Q14.6 -6.6 12.8 -6.6 L2.9 -6.9 Z" />
        <circle cx="6.2" cy="-8.4" r="0.45" fill="currentColor" stroke="none" />
        <circle cx="10.6" cy="-8.6" r="0.45" fill="currentColor" stroke="none" />
        {/* Chopped tomato, seeds in the wedges */}
        <path d="M-8 7.6 l2.6 -1.4 l0.8 2.6 l-2.8 0.7 Z M-1 9.6 l2.4 -1.2 l1 2.4 l-2.7 0.8 Z M6 7 l2.2 -1 l0.9 2.2 l-2.5 0.7 Z" strokeWidth="0.9" />
        <circle cx="-6.6" cy="7.9" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="0.4" cy="9.8" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="7.2" cy="7.5" r="0.35" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    y: 152,
    label: "boil",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Stock pot, doubled rim, loop handles */}
        <path d="M-14.5 -4 Q0 -5.6 14.5 -4 M-14.5 -4 Q0 -2.6 14.5 -4" />
        <path d="M-13 -3.9 C-13.4 3 -12.6 8.4 -10.6 10.6 Q-5 12.4 0 12.4 Q5 12.4 10.6 10.6 C12.6 8.4 13.4 3 13 -3.9" />
        <path d="M-13.2 -1.5 Q-17.5 -1 -16.8 2 Q-16.2 4.4 -13.1 3.4 M13.2 -1.5 Q17.5 -1 16.8 2 Q16.2 4.4 13.1 3.4" />
        {/* Spaghetti fanned into the water, bubbles at the line */}
        <path d="M-4 -4 L-8 -19 M-1.5 -4 L-2.5 -20 M1 -4 L3.5 -19.5 M3.5 -4 L9 -18 M6 -4.4 L13 -15.5" />
        <circle cx="-8" cy="-2.4" r="0.8" strokeWidth="0.7" />
        <circle cx="7" cy="-1.2" r="0.8" strokeWidth="0.7" />
        <circle cx="0" cy="-0.8" r="0.8" strokeWidth="0.7" />
        {/* Steam curls */}
        <path d="M-15.5 -9 C-18 -12 -15 -14.5 -17 -17.5 M17 -8 C19.5 -11 16.5 -13.5 18.5 -16.5" strokeWidth="0.9" />
      </g>
    ),
  },
  {
    y: 216,
    label: "sauce",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Saucepan, doubled rim, gripped handle */}
        <path d="M-17.6 -2.2 L7.6 -2.7 M-17 -2.2 C-17.4 2 -16.6 5.2 -14.6 7.2 Q-6 9 4.6 7.4 C6.8 5.6 7.6 2.4 7.2 -2.5" />
        <path d="M7.4 -2.6 L20 -3.7 Q21.6 -3.8 21.5 -2.2 Q21.4 -0.7 19.8 -0.6 L7.6 0.3" />
        <path d="M16.4 -3.2 l-0.2 2.4 M18.6 -3.4 l-0.2 2.5" strokeWidth="0.7" />
        {/* Bolognese: wavy surface, stippled, one basil leaf */}
        <path d="M-15 0.6 Q-12 -1.2 -9 0.6 T-3 0.6 T3 0.6" strokeWidth="0.9" />
        <circle cx="-12" cy="2.8" r="0.4" fill="currentColor" stroke="none" />
        <circle cx="-8" cy="3.8" r="0.4" fill="currentColor" stroke="none" />
        <circle cx="-4" cy="2.6" r="0.4" fill="currentColor" stroke="none" />
        <circle cx="0" cy="3.6" r="0.4" fill="currentColor" stroke="none" />
        <circle cx="3" cy="2.4" r="0.4" fill="currentColor" stroke="none" />
        <circle cx="-10" cy="5.4" r="0.4" fill="currentColor" stroke="none" />
        <circle cx="-2" cy="5.8" r="0.4" fill="currentColor" stroke="none" />
        <path d="M-7 3.6 c1.4 -1.8 3.6 -1.8 4.6 -0.4 c-1.2 1.6 -3.4 1.8 -4.6 0.4 Z" strokeWidth="0.9" />
        {/* Steam curls */}
        <path d="M-8 -6 C-10 -9 -7.5 -11 -9.5 -14 M0 -6.5 C-2 -9.5 0.5 -11.5 -1.5 -14.5" strokeWidth="0.9" />
      </g>
    ),
  },
  {
    y: 280,
    label: "plate",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Plate, fork left, spoon right, like a recipe card */}
        <path d="M-12.5 0 C-12.5 -7 -7 -12.6 0 -12.5 C7 -12.4 12.6 -7 12.5 0 C12.4 7 7 12.6 0 12.5 C-7 12.4 -12.5 7 -12.5 0 Z" />
        {/* Noodle nest with strand texture */}
        <path d="M-9.5 0.5 C-9 -5.5 -4.5 -9.6 1 -9.2 C6.5 -8.8 9.8 -4.6 9.3 0.8 C8.8 5.8 4.4 9.6 -0.8 9.3 C-5.8 9 -9.8 5.4 -9.5 0.5 Z" strokeWidth="0.9" />
        <path d="M-8 -3 q2 -1.6 4.2 -0.6 M-3 -7.5 q2.4 -1 4.6 0.2 M4 -6.5 q2 0.8 2.8 3 M7 1.5 q-0.4 2.6 -2.6 4 M1 7.6 q-2.6 0.6 -4.8 -0.8 M-7 4 q-1.4 -2 -1.2 -4.4" strokeWidth="0.7" />
        {/* Sauce blob, stippled, basil on top */}
        <path d="M-4.5 -0.5 C-4 -3.8 -1 -5.4 2 -4.6 C4.8 -3.9 5.6 -1 4.6 1.6 C3.6 4 0.4 5 -2.2 4 C-4.4 3.2 -5 1.4 -4.5 -0.5 Z" strokeWidth="0.9" />
        <circle cx="-2" cy="-1.5" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="1" cy="-2.4" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="2.6" cy="0" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="0.4" cy="1.8" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="-2.6" cy="1.2" r="0.35" fill="currentColor" stroke="none" />
        <path d="M0 -3.4 c0.8 -1.6 2.6 -2 3.6 -1 c-0.6 1.4 -2.4 1.9 -3.6 1 Z" strokeWidth="0.9" />
        {/* Fork */}
        <path d="M-21 -9 V-4.6 M-19.7 -9.4 V-4.6 M-18.3 -9.4 V-4.6 M-17 -9 V-4.6" strokeWidth="0.9" />
        <path d="M-21 -4.6 L-20.4 -1.5 L-17.6 -1.5 L-17 -4.6 M-19 -1.5 V9.5" />
        {/* Spoon */}
        <path d="M19 -9.5 C21.3 -9.5 22.6 -7.2 22.4 -4.8 C22.2 -2.6 20.8 -1.2 19 -1.2 C17.2 -1.2 15.8 -2.6 15.6 -4.8 C15.4 -7.2 16.7 -9.5 19 -9.5 Z" />
        <path d="M19 -1.2 V9.5" />
      </g>
    ),
  },
  {
    y: 344,
    label: "done",
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Clean plate, inner ring, faint sauce traces and crumbs */}
        <path d="M-12.5 0 C-12.5 -7 -7 -12.6 0 -12.5 C7 -12.4 12.6 -7 12.5 0 C12.4 7 7 12.6 0 12.5 C-7 12.4 -12.5 7 -12.5 0 Z" />
        <path d="M-8 0 C-8 -4.5 -4.5 -8.1 0 -8 C4.5 -7.9 8.1 -4.5 8 0 C7.9 4.5 4.5 8.1 0 8 C-4.5 7.9 -8 4.5 -8 0 Z" strokeWidth="0.8" opacity="0.7" />
        <path d="M-4 2 q2 1.7 5 0.7 M-1 -3.4 q2.2 0.4 3.4 2" strokeWidth="0.7" />
        <circle cx="-4.6" cy="-1.6" r="0.35" fill="currentColor" stroke="none" />
        <circle cx="3.4" cy="4" r="0.35" fill="currentColor" stroke="none" />
        {/* Cutlery laid together across the plate: finished */}
        <path d="M-6.5 8 L4.5 -5 M4.5 -5 l0.6 -3 M4.5 -5 l2 -2.4 M4.5 -5 l3 -1.2" />
        <path d="M-9 3.6 L2 -9" />
        <path d="M-8.2 4.4 L-4 -0.6" strokeWidth="0.7" />
        {/* The shine of a plate used well */}
        <path d="M13.5 -16.5 V-9.5 M10 -13 H17" strokeWidth="0.9" />
        <circle cx="16.5" cy="-8" r="0.4" fill="currentColor" stroke="none" />
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
      {/* viewBox min-x of 14 slides the whole column toward the screen edge. */}
      <svg viewBox="14 0 100 384" className="max-h-[90vh] w-full overflow-visible">
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

/**
 * NCR Assistant's counterpart: a live diagnostic schematic, not an
 * illustration. Thin technical lines, labeled rectangular nodes, and log
 * fragments appearing as evidence while scroll traces the signal path. The
 * accent amber marks the active fault; green appears exactly once, at
 * verified recovery. Everything unaffected stays muted.
 */
const CIRCUIT = [
  { y: 24, label: "HMI", kind: "ok", note: ["op lead @ line", "shift day  09:35"] },
  { y: 88, label: "PLC #4", kind: "ok", note: ["modbus poll 200ms"] },
  { y: 152, label: "EOL #1", kind: "fault", note: ["ERR 0x03 CRC", "09:41:07 timeout"] },
  { y: 216, label: "NCR FORM", kind: "ok", note: ["mgmt #1482", "issue: serial NG"] },
  { y: 280, label: "PG / RDS", kind: "ok", note: ["INSERT 200 OK", "rec_id 2517"] },
  { y: 344, label: "RESOLVED", kind: "recovered", note: ["verified 10:32"] },
] as const;

const CIRCUIT_LINE = "M30 34V78M30 98V142M30 162V206M30 226V270M30 290V334";
const RECOVERY_GREEN = "oklch(0.72 0.17 152)";

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

  const lead = progress * (CIRCUIT.length - 1);
  const payoff = Math.min(1, Math.max(0, (progress - 0.75) / 0.25));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-[25vw] lg:flex lg:items-center lg:justify-center"
    >
      <svg viewBox="8 0 100 384" className="max-h-[90vh] w-full overflow-visible">
        {/* Bus: quiet trace, then the established path, then the live pulse
            travelling down whatever scroll has verified so far. */}
        <path d={CIRCUIT_LINE} fill="none" stroke="var(--hairline)" strokeWidth="0.5" />
        <path
          d={CIRCUIT_LINE}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="0.5"
          opacity="0.55"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />
        <g opacity={progress * 0.8}>
          <path
            className="sig-pulse"
            d={CIRCUIT_LINE}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.8"
            strokeDasharray="2 16"
            strokeLinecap="round"
          />
        </g>

        {CIRCUIT.map((s, i) => {
          const on = Math.min(1, Math.max(0, lead - i + 1));
          const lit =
            s.kind === "fault"
              ? "var(--accent)"
              : s.kind === "recovered"
                ? RECOVERY_GREEN
                : "var(--foreground)";
          return (
            <g key={s.label} style={{ fontFamily: "var(--font-mono)" }}>
              {/* Node, muted base then lit overlay */}
              <rect x="14" y={s.y - 6.5} width="32" height="13" rx="1" fill="none" stroke="var(--hairline)" strokeWidth="0.6" />
              <rect
                x="14"
                y={s.y - 6.5}
                width="32"
                height="13"
                rx="1"
                fill="none"
                stroke={lit}
                strokeWidth="0.7"
                opacity={on * (s.kind === "ok" ? 0.65 : 1)}
              />
              {/* Alarm ring, only while the fault is the active stage */}
              {s.kind === "fault" && (
                <rect
                  x="12.2"
                  y={s.y - 8.3}
                  width="35.6"
                  height="16.6"
                  rx="1.6"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="0.45"
                  strokeDasharray="2 2"
                  opacity={on * 0.7}
                />
              )}
              <text x="30" y={s.y + 1.4} textAnchor="middle" fontSize="3.4" letterSpacing="0.08em" fill="var(--muted-foreground)" opacity="0.55">
                {s.label}
              </text>
              <text x="30" y={s.y + 1.4} textAnchor="middle" fontSize="3.4" letterSpacing="0.08em" fill={lit} opacity={on}>
                {s.label}
              </text>
              {/* Verified check, the one green mark on the board */}
              {s.kind === "recovered" && (
                <path d={`M48.5 ${s.y - 0.5} l1.6 2 l3.2 -4.4`} fill="none" stroke={RECOVERY_GREEN} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={on} />
              )}
              {/* Evidence stub and log fragments */}
              <path d={`M46 ${s.y} H50`} stroke={lit} strokeWidth="0.4" opacity={on * 0.6} />
              {s.note.map((line, n) => (
                <text
                  key={line}
                  x="52"
                  y={s.y - 1 + n * 4.4}
                  fontSize="2.9"
                  fill={s.kind === "ok" ? "var(--muted-foreground)" : lit}
                  opacity={on * 0.85}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* The thesis, once the trace completes. */}
        <text
          x="30"
          y="374"
          textAnchor="middle"
          fontSize="3.3"
          letterSpacing="0.16em"
          fill="var(--muted-foreground)"
          opacity={payoff * 0.85}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          EVERY FAULT LEAVES A RECORD
        </text>
      </svg>
    </div>
  );
}
