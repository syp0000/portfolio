import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import {
  AiRows,
  CardGrid,
  CaseBlock,
  ContributionRows,
  DecisionList,
  Figure,
  MetricStrip,
  Prose,
  ScreenshotSlot,
  FullBleedShot,
  VideoFigure,
  type AiRowKind,
  type Metric,
} from "./Blocks";

export type Shot = string | { file?: string; caption: string; full?: boolean; owner?: string };

export type CaseData = {
  meta: string[];
  headline: string;
  /** Optional decorative mark shown beside the headline. */
  mark?: ReactNode;
  lede: string;
  /**
   * The 15 second read. Required, so no case study can ship without one.
   * ReactNode rather than string so the figures can carry <strong>.
   */
  summary: { problem: ReactNode; built: ReactNode; result: ReactNode };
  metrics: Metric[];
  contributions?: { title: string; heading?: string; items: { title: string; body: string }[]; note?: string };
  costLabel?: string;
  costTitle?: string;
  cost: ReactNode;
  constraintsLabel?: string;
  constraintsTitle?: string;
  constraints?: { title: string; body: string }[];
  built: ReactNode;
  diagram: ReactNode;
  figureCaption: string;
  video?: { src: string; poster?: string; caption: string };
  fullBleed?: { file: string; caption: string };
  shots: Shot[];
  shotCols?: 2 | 3;
  decisions: { title: string; body: string }[];
  decisionsLabel?: string;
  decisionsTitle?: string;
  aiLabel?: string;
  aiThesis?: string;
  ai?: { kind: AiRowKind; title: string; body: string }[];
  changedLabel?: string;
  changed: ReactNode;
  extra?: { label: string; body: ReactNode };
  repoUrl?: string;
  demoUrl?: string;
};



/**
 * Emphasis for the figure that matters in a summary line. Same accent underline
 * the homepage headline uses, so the site has one way of saying "this bit".
 * box-decoration-break keeps the rule under every line when it wraps.
 */
export function Key({ children }: { children: ReactNode }) {
  return (
    <span className="border-b-[0.09em] border-accent/70 pb-[0.03em] font-semibold [box-decoration-break:clone]">
      {children}
    </span>
  );
}

/**
 * Highlighter for a phrase inside a long paragraph. Sweeps in while the phrase
 * is in the middle of the viewport and retracts once it leaves, in both scroll
 * directions. The words stay semibold throughout: animating weight would reflow
 * the paragraph under the reader's eye mid-scroll.
 */
export function Mark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      // Stays observing rather than disconnecting on first hit, so the
      // highlight retracts on the way out and sweeps back in on the way
      // return, in whichever direction the reader is going.
      ([e]) => setLit(e.isIntersecting),
      // Symmetric band: lit only while the phrase sits in the middle 60% of
      // the viewport, so it lights and clears at the same point either way.
      { rootMargin: "-20% 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} data-lit={lit} className="mark-sweep">
      {children}
    </span>
  );
}

/**
 * The whole case study in three lines, above the fold. Everything here is said
 * again at length further down; this is the version for someone who gives the
 * page twenty seconds.
 */
function SkimBlock({ summary }: { summary: CaseData["summary"] }) {
  const rows: [string, ReactNode][] = [
    ["Problem", summary.problem],
    ["What I built", summary.built],
    ["Result", summary.result],
  ];

  return (
    <div className="mt-10">
      <p className="meta-row tick-label text-accent">Quick summary</p>
      {/* Full container width, matching the metric strip below it. */}
      <dl className="mt-4 divide-y divide-hairline rounded-md border-2 border-accent/40 bg-surface">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 px-5 py-4 md:grid-cols-[minmax(0,9rem)_1fr] md:gap-8 md:px-6"
          >
            <dt className="meta-row pt-0.5 text-accent">{label}</dt>
            <dd className="text-[1.0625rem] font-medium leading-relaxed">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CaseStudy({ data }: { data: CaseData }) {
  return (
    <article>
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-14 md:px-8 md:pt-24 md:pb-16">
        <Reveal>
         <div className="relative">
          <ul className="meta-row flex flex-wrap items-center gap-x-3 gap-y-2">
            {data.meta.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-hairline">/</span>}
                {m}
              </li>
            ))}
          </ul>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold md:text-6xl">{data.headline}</h1>
          {/* Absolute, and centred on the whole intro rather than the headline
           * alone: a mark taller than the headline would otherwise hang down
           * over the lede. Never drives layout, however big it gets. */}
          {data.mark && (
            <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
              {data.mark}
            </div>
          )}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {data.lede}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {data.demoUrl && (
              <a
                href={data.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                <ArrowSquareOut size={16} /> Live demo
              </a>
            )}
            {data.repoUrl && (
              <a
                href={data.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <GithubLogo size={16} /> Repository
              </a>
            )}
          </div>
         </div>
        </Reveal>
        <Reveal delay={80}>
          <SkimBlock summary={data.summary} />
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <MetricStrip items={data.metrics} />
      </div>

      {data.fullBleed && (
        <FullBleedShot file={data.fullBleed.file} caption={data.fullBleed.caption} />
      )}

      {data.contributions && (
        <section className="mt-16 border-y-2 border-accent/40 bg-surface md:mt-20">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Reveal>
              <p className="meta-row text-accent">{data.contributions.title}</p>
              {data.contributions.heading && (
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                  {data.contributions.heading}
                </h2>
              )}
            </Reveal>
            <Reveal className="mt-10">
              <ContributionRows
                items={data.contributions.items}
                note={data.contributions.note}
              />
            </Reveal>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <CaseBlock label={data.costLabel ?? "The cost of the problem"} title={data.costTitle}>
          <Prose>{data.cost}</Prose>
        </CaseBlock>

        {data.constraints && data.constraints.length > 0 && (
          <CaseBlock
            label={data.constraintsLabel ?? "Constraints"}
            title={data.constraintsTitle ?? "Why this was not easy"}
          >
            <CardGrid items={data.constraints} />
          </CaseBlock>
        )}

        <CaseBlock label={data.contributions ? "What we built" : "What I built"}>
          <Prose>{data.built}</Prose>

          <div className="mt-10">
            <Figure number={1} caption={data.figureCaption}>
              {data.diagram}
            </Figure>
          </div>
          {data.video && data.video.src && (
            <div className="mt-6">
              <VideoFigure
                src={data.video.src}
                poster={data.video.poster}
                caption={data.video.caption}
              />
            </div>
          )}
          <div
            className={`mt-6 grid items-start gap-4 ${
              data.shotCols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
            }`}
          >

            {data.shots.map((s) => {
              const shot = typeof s === "string" ? { caption: s } : s;
              return (
                <div
                  key={shot.file ?? shot.caption}
                  className={
                    typeof s !== "string" && s.full
                      ? data.shotCols === 3
                        ? "sm:col-span-2 lg:col-span-3"
                        : "md:col-span-2"
                      : undefined
                  }
                >
                  <ScreenshotSlot caption={shot.caption} file={shot.file} owner={(shot as { owner?: string }).owner} />
                </div>
              );
            })}
          </div>
        </CaseBlock>

        <CaseBlock
          label={data.decisionsLabel ?? "Key decisions"}
          title={data.decisionsTitle ?? "Each choice, with its tradeoff named"}
        >
          <DecisionList items={data.decisions} />
        </CaseBlock>
      </div>

      {data.ai && data.ai.length > 0 && (
        <section className="border-y-2 border-accent/40 bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <p className="meta-row text-accent">
                {data.aiLabel ?? "What the model does, and what it doesn't"}
              </p>
              {data.aiThesis && (
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                  {data.aiThesis}
                </h2>
              )}
            </Reveal>
            <Reveal className="mt-12">
              <AiRows rows={data.ai} />
            </Reveal>
          </div>
        </section>
      )}


      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <CaseBlock label={data.changedLabel ?? "What changed"}>
          <Prose>{data.changed}</Prose>
        </CaseBlock>
        {data.extra && (
          <CaseBlock label={data.extra.label}>
            <Prose>{data.extra.body}</Prose>
          </CaseBlock>
        )}
      </div>
    </article>
  );
}
