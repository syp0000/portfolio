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
          "I like the part where you find out you built the wrong thing. Background and experience of a new grad software engineer in Phoenix.",
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

function About() {
  return (
    <div>
      <Section className="pb-10 md:pb-12">
        <Reveal>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] md:text-6xl">
            I spot operational problems and build the fix.
          </h1>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-10 max-w-2xl space-y-6 text-[1.0625rem] leading-relaxed text-foreground/80">
            <p>
              I'm a software engineer with a background in data science, working directly with users on a manufacturing
              floor. I found a real operational business problem and built a solution without being asked.
            </p>
            <p>
              I’m good at bridging technical systems and the people who rely on them, using sound judgment to turn
              problems into solutions people will actually adopt.
            </p>
            <p>I am looking for new grad software engineering and forward deployed engineering roles.</p>
          </div>
        </Reveal>
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
                <ul className="mt-3 max-w-2xl space-y-2 text-[0.975rem] leading-relaxed text-muted-foreground">
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
