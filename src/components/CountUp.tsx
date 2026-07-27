import { useEffect, useRef, useState } from "react";

const LEADING = /^(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatLike(sample: string, value: number) {
  const hasCommas = sample.includes(",");
  const decimals = sample.includes(".") ? sample.split(".")[1].length : 0;
  const fixed = value.toFixed(decimals);
  if (!hasCommas) return fixed;
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${grouped}.${dec}` : grouped;
}

/**
 * Animates the leading number of a value string from zero on scroll into view.
 * Everything after the leading number is preserved verbatim.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(LEADING);
  const raw = match?.[1];
  const target = raw ? Number(raw.replace(/,/g, "")) : NaN;
  const animatable = !!raw && Number.isFinite(target);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!animatable || prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rest = value.slice(raw!.length);
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(formatLike(raw!, target * eased) + rest);
          if (t < 1) frame = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, raw, target, animatable]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
