import { createFileRoute } from "@tanstack/react-router";
import resumeAsset from "@/assets/SiyeonPark_SWE_Resume.pdf.asset.json";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume, Siyeon Park, Software Engineer" },
      {
        name: "description",
        content:
          "Resume of Siyeon Park, a software engineer in Phoenix building production tooling for operational problems. View or download the PDF.",
      },
      { property: "og:title", content: "Resume, Siyeon Park" },
      {
        property: "og:description",
        content: "View or download the resume of Siyeon Park, software engineer.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Resume</h1>
          <p className="mt-2 text-sm text-muted-foreground">Siyeon Park, software engineer, Phoenix.</p>
        </div>
        <a
          href={resumeAsset.url}
          download="SiyeonPark_SWE_Resume.pdf"
          className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Download PDF
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-hairline bg-card">
        <object data={resumeAsset.url} type="application/pdf" className="h-[85vh] w-full">
          <div className="p-8 text-sm text-muted-foreground">
            Your browser can't display the PDF inline.{" "}
            <a className="text-accent underline" href={resumeAsset.url} download="SiyeonPark_SWE_Resume.pdf">
              Download the resume instead.
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
