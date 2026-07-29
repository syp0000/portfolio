import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";
import { MetricStrip, Section } from "@/components/Blocks";
import { Reveal } from "@/components/Reveal";
import { HeroCollage } from "@/components/HeroCollage";
import { DeviceFrame, frameKind } from "@/components/Frames";
import { shotImages, shotDims } from "@/lib/shots";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Siyeon Park, Software Engineer" },
      {
        name: "description",
        content:
          "Software engineer who finds operational problems on the floor and ships the fix. Production tooling for a battery plant, planning software, and applied AI with judgment.",
      },
      { property: "og:title", content: "Siyeon Park, Software Engineer" },
      {
        property: "og:description",
        content:
          "Battery plant operators use a tool she built alone. It carries 100 reports a day. Three case studies, framed by business outcome.",
      },
    ],
  }),
  component: Home,
});

const metrics = [
  { value: "70%", label: "Less time per nonconformance report, 10 minutes down to 3" },
  { value: "2,500+", label: "Records running through the tool in production" },
  { value: "54,516", label: "Survey data points cleaned and modeled" },
  { value: "85x", label: "Pipeline speedup the research team shipped" },
];

/**
 * Cycles a project's screenshots in product-flow order. Each one slides out to
 * the left as the next slides in from the right, the way you page through the
 * app itself. Beats a real GIF: it reuses the screenshots already on the case
 * study pages, stays sharp at any size, adds no new bytes, and holds still for
 * anyone who asked for reduced motion.
 */
function ShotCycle({ files, name, offsetMs }: { files: string[]; name: string; offsetMs: number }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tick: ReturnType<typeof setInterval>;
    // Staggered start, so the three cards do not flip in unison.
    const lead = setTimeout(() => {
      tick = setInterval(() => setStep((n) => n + 1), 2800);
    }, offsetMs);
    return () => {
      clearTimeout(lead);
      clearInterval(tick);
    };
  }, [offsetMs]);

  const len = files.length;
  const active = step % len;
  // One kind for the whole card: a project's shots all come off the same device.
  const kind = frameKind(files[0]);
  const d = shotDims[files[0]];
  const phoneRatio = d ? `${d.w} / ${d.h}` : "9 / 16";

  return (
    <div
      // A phone stands on the card at its own height, with no surrounding
      // panel. A browser gets the 16:9 slot and the panel chrome around it.
      // overflow-hidden on both: the queued slides sit one card-width off to
      // the right and would otherwise be visible beside the current one.
      className={`relative w-full overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.02] ${
        kind === "phone"
          ? // Tall enough to carry the feature card on its own, since it sits
            // beside the copy rather than above it.
            "h-[26rem]"
          : "aspect-[16/9] rounded-md border border-hairline bg-surface"
      }`}
    >
      {files.map((f, n) => {
        // Distance forward from the current shot: 0 is on screen, len-1 is the
        // one that just left, everything else waits off to the right.
        const rel = (n - active + len) % len;
        const x = rel === 0 ? 0 : rel === len - 1 ? -100 : 100;
        // Only the outgoing and incoming shots animate. The rest reset to the
        // right with no transition, which happens off screen and so is unseen;
        // animating it would drag a stray screenshot across the card.
        const slides = rel === 0 || rel === len - 1;
        return (
          <div
            key={f}
            style={{ transform: `translateX(${x}%)` }}
            className={`absolute inset-0 flex items-center justify-center ${
              slides ? "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
            }`}
          >
            <DeviceFrame
              kind={kind}
              // A phone stands to the card's full height; its width has to come
              // from an explicit ratio, or the bezel stretches across the flex
              // line instead of following the image. A browser just fills.
              className={kind === "phone" ? "h-full" : "h-full w-full"}
              style={kind === "phone" ? { aspectRatio: phoneRatio } : undefined}
            >
              <img
                src={shotImages[f]}
                // Only the first carries the alt text: the rest are the same
                // subject rephrased, and announcing all would be noise.
                alt={n === 0 ? `${name} screenshot` : ""}
                aria-hidden={n === 0 ? undefined : true}
                width={shotDims[f]?.w}
                height={shotDims[f]?.h}
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover object-top"
              />
            </DeviceFrame>
          </div>
        );
      })}
    </div>
  );
}

const projects = [
  {
    to: "/work/ncr-assistant" as const,
    name: "NCR Assistant",
    meta: "In production, 2026",
    problem:
      "Quality reports on a battery manufacturing line took ten minutes each, on paper, one hundred times a day, written by the operator leads (managers) of each station. Nobody had filed a ticket about it.",
    outcome: "Ten minutes down to three. Over 2,500 records now structured and queryable.",
    stack: "Node.js / PostgreSQL / AWS RDS / Anthropic API",
    // Ordered as the operator walks it: fill the form, read your own records,
    // then the full log.
    thumbs: ["ncr-01-form.jpg", "ncr-02-my-records.jpg", "ncr-03-all-records.jpg"],
    feature: true,
  },
  {
    to: "/work/event-compass" as const,
    name: "Event Compass",
    meta: "Senior capstone, 2025",
    problem:
      "The largest student organization on campus planned its events from memory, because the attendance data existed but nobody could ask it a question.",
    outcome:
      "Built the data pipeline, the 18 analytics endpoints, and Campus Insights, the landing dashboard. 54,516 raw survey points filtered down to a dataset the rest of the product reads from.",


    stack: "Next.js / Supabase / OpenAI / SerpAPI",
    thumbs: [
      "ec-01-insights.jpg",
      "ec-02-intake.jpg",
      "ec-03-concepts.jpg",
      "ec-04-budget.jpg",
      "ec-05-shopping.jpg",
      "ec-06-forecast.jpg",
    ],
    feature: false,
  },
  {
    to: "/work/pantry-ai" as const,
    name: "Pantry AI",
    meta: "Top 3 of 20 teams, 2025",
    problem: "Food spoils at the back of the shelf because nobody remembers it is there.",
    outcome:
      "Stood up the Supabase database and ran the migration off Firebase, building the first half of the schema, then owned the pantry backend at 18 routes and the meal planner interface. Placed third of twenty.",


    stack: "Next.js / Supabase / OpenAI / Spoonacular",
    thumbs: [
      "pa-01-pantry.jpg",
      "pa-02-recipe-generator.jpg",
      "pa-03-meal-planner.jpg",
      "pa-04-feed.jpg",
    ],
    feature: false,
  },
];

const alsoKnowing = [
  {
    title: "SDLE Research Center",
    body: "Tuned HBase queries on a Hadoop cluster, cutting retrieval time 30 percent and contributing to an 85x pipeline speedup.",
  },
  {
    title: "Development Monitors",
    body: "Evaluated two field data collection tools by building competing prototypes, and the recommendation was adopted by both the engineering and field teams.",
  },
  {
    title: "CraveRAG",
    body: "Building a retrieval augmented generation experiment on Snowflake.",
  },
];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-hairline paper-band">
        <div className="pointer-events-none absolute inset-0 rule-grid opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-20 pb-20 md:px-8 md:pt-32 md:pb-28 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="meta-row tick-label">Software Engineer, Phoenix</p>
            <h1 className="mt-7 max-w-4xl text-[2.6rem] font-semibold leading-[1.02] md:text-[4.4rem]">
              I find operational problems and ship the{" "}
              <span className="whitespace-nowrap border-b-[0.07em] border-accent/70 pb-[0.02em]">
                fix
              </span>
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A tool I built independently now handles 100 daily reports for battery plant operators.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/work/ncr-assistant"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                See the work{" "}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="mailto:siyeon3934@gmail.com"
                className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-card/60 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <EnvelopeSimple size={16} /> Email me
              </a>
            </div>
          </Reveal>
          <div className="lg:col-span-5">
            <HeroCollage />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <MetricStrip items={metrics} />
      </div>

      <Section>
        <Reveal>
          <p className="meta-row tick-label">Selected work</p>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold md:text-4xl">
            Three problems, and what changed after.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          {projects.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 60}
              className={p.feature ? "lg:col-span-6" : "flex lg:col-span-3"}
            >
              {/* The feature card runs side by side: shot at the leading edge,
               * every line of text in one column beside it. The narrow cards
               * keep the stacked arrangement, shot above text. */}
              <Link
                to={p.to}
                className={`group card-craft flex w-full overflow-hidden rounded-md border border-hairline bg-card p-6 md:p-8 ${
                  p.feature ? "flex-col lg:flex-row lg:items-center lg:gap-12" : "flex-col"
                }`}
              >
                <div className={p.feature ? "mb-6 shrink-0 lg:mb-0 lg:w-72" : "mb-6"}>
                  <ShotCycle files={p.thumbs} name={p.name} offsetMs={i * 900} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="index-num text-2xl font-medium md:text-3xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-semibold">{p.name}</h3>
                    </div>
                    <span className="meta-row">{p.meta}</span>
                  </div>

                  <p className="mt-5 text-[1.05rem] font-semibold leading-relaxed md:text-xl">
                    {p.problem}
                  </p>
                  <p className="mt-4 text-[1.0125rem] leading-relaxed text-muted-foreground">
                    {p.outcome}
                  </p>
                  {/* mt-auto pins the footer down, so the narrow cards end at
                   * the same line however long their copy runs. */}
                  <div className="mt-auto pt-7">
                    <p className="num text-xs text-muted-foreground">{p.stack}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Read the case
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-hairline">
        <Reveal>
          <h2 className="text-2xl font-semibold md:text-3xl">Also worth knowing</h2>
        </Reveal>
        <ul className="mt-10 max-w-3xl">
          {alsoKnowing.map((a, i) => (
            <Reveal
              as="li"
              key={a.title}
              delay={i * 60}
              className="border-t border-hairline py-6 first:border-t-0 first:pt-0"
            >
              <h3 className="text-base font-semibold">{a.title}</h3>
              <p className="mt-1.5 text-[1.0125rem] leading-relaxed text-muted-foreground">
                {a.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </div>
  );
}
