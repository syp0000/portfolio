import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { shotImages, shotDims } from "@/lib/shots";
import { CountUp } from "./CountUp";
import { DeviceFrame, frameKind } from "./Frames";

export type Metric = { value: string; label: string };

export function MetricStrip({ items }: { items: Metric[] }) {
  return (
    <div className="grid grid-cols-1 border-y border-hairline md:grid-cols-2 lg:grid-cols-4">
      {items.map((m, i) => (
        <Reveal
          key={m.value + m.label}
          delay={i * 60}
          className="group relative border-b border-hairline px-5 py-9 transition-colors last:border-b-0 hover:bg-surface sm:px-6 lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <div className="num text-4xl font-medium md:text-5xl">
            <CountUp value={m.value} />
          </div>
          <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-muted-foreground">
            {m.label}
          </p>
        </Reveal>
      ))}
    </div>

  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24 ${className}`}>
      {children}
    </section>
  );
}

/** Narrow left label, wide right content. Collapses under 768px. */
export function CaseBlock({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-hairline py-14 md:grid-cols-[minmax(0,190px)_minmax(0,1fr)] md:gap-12 md:py-20">
      <Reveal>
        <h2 className="meta-row tick-label md:sticky md:top-24">{label}</h2>
      </Reveal>
      <Reveal delay={60} className="min-w-0">
        {title && (
          <h3 className="mb-6 max-w-3xl text-2xl font-semibold md:text-3xl">{title}</h3>
        )}
        {children}
      </Reveal>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-5 text-[1.0625rem] leading-relaxed text-foreground/80">
      {children}
    </div>
  );
}

export function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-craft overflow-hidden rounded-md border border-hairline bg-card p-5">
      <h4 className="text-[0.95rem] font-semibold">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function CardGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((c) => (
        <MiniCard key={c.title} {...c} />
      ))}
    </div>
  );
}

export type AiRowKind = "Used" | "Not used" | "Guardrail";

export function AiRows({
  rows,
}: {
  rows: { kind: AiRowKind; title: string; body: string }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-accent/30 bg-accent/25">
      {rows.map((r) => (
        <div key={r.title} className="bg-card p-6 md:p-9">
          <span className="meta-row inline-block rounded-md border border-accent/50 bg-accent-soft px-3 py-1.5 text-[0.75rem] font-semibold text-accent">
            {r.kind}
          </span>
          <h4 className="mt-5 max-w-3xl text-xl font-semibold leading-snug md:text-2xl">
            {r.title}
          </h4>
          <p className="mt-3 max-w-3xl text-[1.0625rem] leading-relaxed text-muted-foreground">
            {r.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Numbered decision list. Deliberately not the CardGrid layout. */
export function DecisionList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="max-w-3xl">
      {items.map((d, i) => (
        <li
          key={d.title}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-hairline py-6 first:border-t-0 first:pt-0"
        >
          <span className="num pt-0.5 text-sm text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h4 className="text-[1.0625rem] font-semibold">{d.title}</h4>
            <p className="mt-2 text-[0.975rem] leading-relaxed text-muted-foreground">{d.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** High weight "What I built" block. Distinct surface, large headings. */
export function ContributionRows({
  items,
  note,
}: {
  items: { title: string; body: string }[];
  note?: string;
}) {
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline md:grid-cols-3">
        {items.map((it, i) => (
          <div key={it.title} className="bg-card p-6 md:p-8">
            <span className="num text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="mt-4 text-xl font-semibold leading-snug md:text-2xl">{it.title}</h4>
            <p className="mt-3 text-[1.0rem] leading-relaxed text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-5 max-w-3xl text-[0.975rem] leading-relaxed text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

export function ScreenshotSlot({
  caption,
  file,
  owner,
}: {
  caption: string;
  file?: string;
  owner?: string;
}) {
  const src = file ? shotImages[file] : undefined;
  const dims = file ? shotDims[file] : undefined;

  const ownerTag = owner ? (
    <span className="meta-row mr-2 inline-block whitespace-nowrap rounded border border-accent/50 bg-accent-soft px-2 py-0.5 text-[0.7rem] font-semibold text-accent">
      {owner}
    </span>
  ) : null;

  if (src) {
    const kind = frameKind(file);
    return (
      <figure className={kind === "phone" ? "mx-auto w-full max-w-[320px]" : ""}>
        <DeviceFrame kind={kind}>
          <img
            src={src}
            alt={caption}
            loading="lazy"
            decoding="async"
            width={dims?.w}
            height={dims?.h}
            className="block h-auto w-full bg-surface object-contain"
          />
        </DeviceFrame>
        <figcaption className="mt-4 text-left text-sm leading-relaxed text-muted-foreground">
          {ownerTag}
          {caption}
        </figcaption>
      </figure>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-foreground/25 bg-surface px-6 py-16 text-center">
      <p className="meta-row">Screenshot placeholder</p>
      {file && <p className="num text-sm text-accent">{file}</p>}
      {ownerTag}
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{caption}</p>
    </div>
  );
}




export function Figure({
  children,
  number,
  caption,
}: {
  children: ReactNode;
  number: number;
  caption: string;
}) {
  return (
    <figure className="rounded-md border border-hairline bg-card p-5 md:p-8">
      <div className="overflow-x-auto">{children}</div>
      <figcaption className="mt-5 border-t border-hairline pt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="num mr-2 text-foreground">Fig. {number}.</span>
        {caption}
      </figcaption>
    </figure>
  );
}

export function VideoFigure({
  src,
  poster,
  caption,
  label = "Product demo",
}: {
  src: string;
  poster?: string;
  caption: string;
  label?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-md border-2 border-accent/40 bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
        <p className="meta-row text-accent">{label}</p>
        <p className="meta-row text-[0.7rem] text-muted-foreground">Full walkthrough</p>
      </div>
      {src ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="w-full bg-foreground/5"
          style={{ aspectRatio: "16 / 9" }}
        />
      ) : (
        <div
          className="flex w-full items-center justify-center border-y-2 border-dashed border-hairline bg-foreground/5 px-6 text-center"
          style={{ aspectRatio: "16 / 9" }}
        >
          <p className="meta-row text-muted-foreground">Video slot, expected file: ncr-demo.mp4</p>
        </div>
      )}
      <figcaption className="border-t border-hairline px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

/** One screenshot per case study, promoted out of the content column. */
export function FullBleedShot({ file, caption }: { file: string; caption: string }) {
  const src = shotImages[file];
  const dims = shotDims[file];
  if (!src) return null;
  return (
    <Reveal as="section" className="py-16 md:py-24">
      <figure>
        <div className="flex justify-center px-5 md:px-8">
          <DeviceFrame kind={frameKind(file)} className="max-w-full">
            <img
              src={src}
              alt={caption}
              width={dims?.w}
              height={dims?.h}
              loading="lazy"
              decoding="async"
              className="block max-h-[75vh] w-auto max-w-full bg-surface object-contain"
            />
          </DeviceFrame>
        </div>
        <figcaption className="mx-auto mt-6 max-w-6xl px-5 text-sm leading-relaxed text-muted-foreground md:px-8">
          {caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}
