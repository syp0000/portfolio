import { createFileRoute } from "@tanstack/react-router";
import { CaseStudy, Key, Mark, type CaseData } from "@/components/CaseStudy";
import { NcrDiagram } from "@/components/Diagrams";
import { StandingShot } from "@/components/Frames";

import { shotImages } from "@/lib/shots";
import ncrDemo from "@/assets/ncr-demo.mp4.asset.json";
export const Route = createFileRoute("/work/ncr-assistant")({
  head: () => ({
    meta: [
      { title: "NCR Assistant, a production reporting tool for a battery line" },
      {
        name: "description",
        content:
          "A mobile first reporting tool built solo for a battery manufacturing line, adopted by the operator leads (managers) of each station. Locked and versioned records, a duplicate guard, and ten minutes of paperwork down to three.",
      },
      { property: "og:title", content: "NCR Assistant, the tool the plant floor actually uses" },
      {
        property: "og:description",
        content:
          "Found an unassigned bottleneck on the floor, shipped it to production, and demoed every release to the people using it. Case study by Siyeon Park.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

    links: [{ rel: "canonical", href: "/work/ncr-assistant" }],
  }),
  component: () => <CaseStudy data={data} />,
});

const data: CaseData = {
  meta: ["In production", "2026", "LSP USA", "Sole engineer"],
  headline: "Ten minutes on paper, three minutes on a phone.",
  mark: <StandingShot file="ncr-01-form.jpg" className="h-80" />,
  repoUrl: "https://github.com/syp0000/Demo_ncr",

  lede: "Nonconformance reports on the battery line were still being written by hand, passed around verbally, and entered again later. I noticed the problem while working on root cause analysis and built a tool to replace that process, even though nobody had asked me to.",
  summary: {
    problem: (
      <>
        Operator leads (managers) of each station manually wrote around <Key>100 reports per day</Key>.
      </>
    ),
    built: (
      <>
        A <Key>production reporting workflow</Key> used by the floor team.
      </>
    ),
    result: (
      <>
        Reporting time fell from <Key>10 minutes to 3</Key>, with{" "}
        <Key>2,500+ structured records</Key>.
      </>
    ),
  },
  metrics: [
    { value: "10 to 3", label: "Minutes per report" },
    { value: "100", label: "Reports moving through it each day" },
    { value: "2,500+", label: "Records accumulated in production" },
    { value: "1", label: "Engineer on the project, start to finish" },
  ],
  costLabel: "Let's put a number on it",
  cost: (
    <p>
      At roughly 100 reports a day and ten minutes per report, the plant was spending more than
      sixteen hours of labor on documentation every day. Most of that time went toward
      transcription, and every handwritten or retyped field created another chance for information
      to go missing.
    </p>
  ),
  constraintsLabel: "Motivation",
  constraintsTitle: "What made this worth building",
  constraints: [
    {
      title: "One report was easy. Ten reports were not.",
      body: "Writing an NCR was not technically difficult, but operator leads had to repeat the same process throughout the day. Ten reports could take as long as 100 minutes, much of it spent entering similar information again and again.",
    },
    {
      title: "The users were managing the floor.",
      body: "The tool was built for the operator leads (managers) who run each station, not for dedicated administrative staff. Documentation was necessary, but it competed with the production issues and people they were responsible for managing.",
    },
    {
      title: "Everyone can read, not everyone can write",
      body: "Users need the full log to do their job, because a defect someone else logged an hour ago is the context for the one in front of them. But an audited record cannot be editable by whoever opens it. Read wide, write narrow, with the author able to delegate.",
    },
    {
      title: "I was improving an existing workflow, not replacing it.",
      body: "The judgment behind each NCR still belonged to the operator lead of the station. The tool removed the repetitive manual entry and made it faster to turn that judgment into a complete report.",
    },
    {
      title: "Nobody had assigned the project.",
      body: "There was no formal mandate to build or use it. I had to show that it made the existing process easier, then improve it based on how the operator leads actually used it.",
    },
  ],
  built: (
    <>
      <p>
        I built a <Mark>mobile first quality reporting tool</Mark> for the production line, designed for the
        moment when an operator lead is standing at the station with a phone in hand and no time to
        fight software.
      </p>
      <p>
        The app turns a quick line side form into a <Mark>structured, auditable record</Mark> in PostgreSQL on
        AWS RDS. Operator leads can see all records, edit only their own, and grant shared edit access
        when another user needs to help. Admins get full database access. Completed records are
        locked before editing, and <Mark>every change is captured in per record history</Mark>, so the audit
        trail is as real as the report itself.
      </p>
      <p>
        The workflow is built around the way the plant actually runs. Records are grouped into My
        Records and All Records, filtered by Open and Done, and shown across the <Mark>last two
        operational days instead of calendar days</Mark>. Deletion is soft, bulk actions are supported, and
        each report carries the details that matter on the floor: management number, station, time
        window, report type, issue, action, and optional evidence photo.
      </p>
      <p>
        The form does the quiet work for the operator lead. It calculates duration from start and end
        time, steps management numbers up or down, handles suffixes, switches between Work
        Completion and Defect Report modes, and catches bad entries inline. If someone tries to file
        the same management number and process twice within twenty four hours, <Mark>the app stops them
        with a specific message</Mark>.
      </p>
      <p>
        I also added Korean and English polish and translation for the two free text fields. The
        browser never talks to the model directly. The app API relays the request, and the model
        only touches the text the operator lead reviews. <Mark>Structured values stay deterministic, validated,
        and human owned.</Mark>
      </p>
      <p>
        The result is a tool that removes the worst part of recurring quality reports: retyping the
        same station level defect again and again. Operator leads can copy a clean numbered report,
        export JSON, attach evidence, and move on. <Mark>Fast on the floor, defensible in an audit.</Mark>
      </p>
    </>
  ),

  diagram: <NcrDiagram />,
  figureCaption:
    "The model sits next to the write path, never in it. It only rewrites free text the operator lead typed. Everything structured, the times, the station, the management number, is entered by a person and checked by code. The operator lead reads the result before it saves. Nothing outside the API touches the database, including the two roles, which are views the API builds rather than connections to it.",
  video: {
    src: ncrDemo.url,
    poster: shotImages["ncr-01-form.jpg"],
    caption:
      "A thirty second walkthrough: filling a work completion report, polishing the free text, the duplicate guard refusing a repeat entry, and the saved record in the log.",
  },
  shotCols: 3,
  // No full-bleed hero: the form sits beside the headline as the mark instead,
  // and appears again at readable size in the grid below.
  shots: [
    {
      file: "ncr-01-form.jpg",
      caption:
        "The report form. Duration computes itself, the process picker covers the real line, and each free text field can be polished or translated in place.",
    },
    {
      file: "ncr-02-my-records.jpg",
      caption:
        "My Records. Each report carries a station, a time window, a sequential number, and a lock. Shown in the admin view, which adds the Admin tab.",
    },
    {
      file: "ncr-03-all-records.jpg",
      caption:
        "All Records. Users read every report and edit only their own, unless the author allows shared edit on that record.",
    },
  ],
  decisions: [

    {
      title: "Mobile first, not mobile responsive",
      body: "I designed the phone layout first and let desktop inherit. The alternative was a desktop form squeezed down, which is how internal tools quietly go unused.",
    },
    {
      title: "Keep the model out of the write path",
      body: "An operator lead can type a few words instead of stopping to write a full sentence. The API sends that text to the model, which rewrites it clearly and translates between Korean and English when needed. It only ever touches the free text description. The station, shift, time, report type, and every other structured value are chosen by the person filing and checked by code, which also calculates the duration. A quality record ends up in customer reviews, so nothing in it should come from something I cannot reproduce.",
    },
    {
      title: "Show the rewrite before saving it",
      body: "Small wording changes matter here. Turning seep into leak changes what the report claims. The rewritten sentence appears in the field first, and the author edits or rejects it before anything saves.",
    },
    {
      title: "Refuse the duplicate, and say why",
      body: "The same management number and process cannot be entered twice in twenty four hours. The tool blocks it and names the conflicting record rather than silently accepting a second one. Duplicate quality records are worse than missing ones, because both look valid later and only one is true.",
    },
    {
      title: "Lock records by default, and version every change",
      body: "An audited quality record that any open tab can overwrite is not a record. Editing requires an explicit unlock, and every change is written to a per record history. The alternative was trusting people to be careful with a document that ends up in customer reviews.",
    },
    {
      title: "Default the list to operational days, not calendar days",
      body: "A shift that starts at 23:00 and ends at 07:00 belongs to one working day, not two. Windowing by calendar date would have split it and made the default view wrong for exactly the people who use it most.",
    },
    {
      title: "Roles before features",
      body: "Role based access went in early rather than after launch. An operator lead seeing admin controls would have killed trust faster than any missing feature.",
    },
    {
      title: "A public twin of the private tool",
      body: "I built a separate deployment with no company data to test changes safely before they reached the floor. It doubles as the only version I can show anyone outside the plant.",
    },
    {
      title: "Demo in person, every release",
      body: "I showed each release to the operator leads face to face instead of sending a changelog. Slower per release, and the reason usage grew instead of stalling at launch.",
    },
  ],





  changed: (
    <>
      <p>
        A report that used to take about ten minutes now takes about three. Across 100 reports a
        day, that gives roughly 700 minutes back to the production team.
      </p>
      <p>
        More than 2,500 structured records have accumulated since launch. Quality data that once
        sat in paper files can now be searched and analyzed.
      </p>
    </>
  ),

  extra: {
    label: "Trust built on the floor",
    body: (
      <p>
        A senior quality engineer at LG Energy Solution asked me to represent the team in a client
        interview. That came from the working relationship I had built on the production floor and
        my ability to explain technical issues clearly to people outside my team.
      </p>
    ),
  },


};
