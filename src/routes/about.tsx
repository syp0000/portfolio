import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Blocks";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Siyeon Park, engineer close to the floor" },
      {
        name: "description",
        content:
          "Data science degree, manufacturing floor day job, and a habit of building the thing nobody asked for. Background, experience timeline, and how she works.",
      },
      { property: "og:title", content: "About Siyeon Park" },
      {
        property: "og:description",
        content:
          "I like the part where you find out you built the wrong thing. Background and experience of a new grad software engineer.",
      },
    ],
  }),
  component: About,
});

const timeline = [
  {
    date: "2026 to now",
    role: "Customer Service Engineer, Software",
    org: "LSP USA",
    body: [
      "Diagnosed HMI, PLC, and Modbus integration failures in live production.",
      "Identified a poorly documented reporting workflow and independently built a tool that reduced documentation time from 10 minutes to 3.",
      "Worked across operators, engineers, managers, and plant leadership to move technical problems toward practical solutions.",
    ],
  },
  {
    date: "2024 to 2025",
    role: "Undergraduate Research Assistant",
    org: "SDLE Research Center",
    body: [
      "Built distributed data infrastructure on a Hadoop cluster.",
      "Analyzed the system architecture and data flow before contributing, then tuned HBase queries down 30 percent.",
    ],
  },
  {
    date: "Summer 2025",
    role: "Data Science and GIS Intern",
    org: "Development Monitors",
    body: [
      "Evaluated field data collection tools by building competing prototypes.",
      "Shipped a Python and Plotly dashboard over relational survey data supporting 20 or more deployments.",
    ],
  },
  {
    date: "2022 to 2026",
    role: "B.S. Data Science, Mathematics minor",
    org: "Case Western Reserve University",
    body: ["Dean's Honor List, fall 2023, 2024, and 2025."],
  },
];

/**
 * Circular portrait. A muted, looping, controlless video behaves like a GIF but
 * at a fraction of the bytes and without the 256 colour ceiling. Paused for
 * anyone who asked for reduced motion, since CSS cannot stop playback.
 */
function Portrait() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);

  return (
    <figure className="flex flex-col items-center gap-3">
      <video
        ref={ref}
        src="/me_smile.mp4"
        aria-label="Siyeon Park"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="size-48 rounded-full border border-hairline bg-surface object-cover shadow-[0_24px_50px_-28px_rgb(0_0_0/0.6)] md:size-64"
      />
      <figcaption className="meta-row max-w-[16rem] text-center leading-relaxed">
        AI-generated with Gemini. Synthetic media, clearly disclosed.
      </figcaption>
    </figure>
  );
}

function About() {
  return (
    <div>
      <Section className="pb-10 md:pb-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
         <div>
          <Reveal>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] md:text-6xl">
              I spot operational problems and build the fix.
            </h1>
          </Reveal>
          <Reveal delay={60}>
          <div className="mt-10 max-w-2xl space-y-6 text-[1.125rem] leading-relaxed text-foreground/90">
            <p>
              I’m a software engineer with a background in data science. I currently work directly with users on a manufacturing floor, where I found a real workflow problem and built a solution without being asked.
            </p>
            <p>
              I like learning new technologies and picking up unfamiliar systems quickly. At the same time, I try to understand the problem before deciding what to build. I care about whether a solution makes sense for the people who will actually use it.
            </p>
            <p>I’m looking for new grad software engineering and forward deployed engineering roles where I can keep learning and solve real problems.</p>
            <p>Outside of work, I like to cook and travel. I also smile a lot.</p>
          </div>
          </Reveal>
         </div>
         <Reveal delay={120} className="order-first lg:order-none">
           <Portrait />
         </Reveal>
        </div>
      </Section>

      <Section className="pt-0">
        <ul>
          {timeline.map((t, i) => (
            <Reveal
              as="li"
              key={t.role}
              delay={i * 60}
              className="grid gap-3 border-t border-hairline py-8 md:grid-cols-[minmax(0,160px)_minmax(0,1fr)] md:gap-10"
            >
              <div className="num pt-0.5 text-sm text-muted-foreground">{t.date}</div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">{t.role}</h2>
                <p className="meta-row mt-1">{t.org}</p>
                <ul className="mt-3 max-w-2xl space-y-2 text-[1.0125rem] leading-relaxed text-muted-foreground">
                  {t.body.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
    </div>
  );
}
