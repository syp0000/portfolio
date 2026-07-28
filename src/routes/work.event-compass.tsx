import { createFileRoute } from "@tanstack/react-router";
import { CaseStudy, Key, Mark, type CaseData } from "@/components/CaseStudy";
import { CompassDiagram, CompassMark } from "@/components/Diagrams";
import { StandingShot } from "@/components/Frames";
import demoVideo from "@/assets/event-compass-demo.mp4.asset.json";
import { shotImages } from "@/lib/shots";

export const Route = createFileRoute("/work/event-compass")({
  head: () => ({
    meta: [
      { title: "Event Compass, the data layer behind the planner dashboard" },
      {
        name: "description",
        content:
          "A cleaning pipeline that turned a raw Qualtrics export into a queryable dataset, 18 analytics endpoints, and Campus Insights, the landing dashboard a planner opens first. Capstone case study by Siyeon Park.",
      },
      { property: "og:title", content: "Event Compass, everything the planner sees first" },
      {
        property: "og:description",
        content:
          "54,516 raw survey points filtered to a trustworthy dataset, 18 analytics endpoints, and the four tabbed dashboard that is the product's home route.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CaseStudy data={data} />,
});

const data: CaseData = {
  meta: ["Senior capstone", "2025", "Team of 5", "University Program Board"],
  headline: "Everything the planner sees first.",
  // The logo's navy blue disappears against the space palette, so lift it.
  mark: (
    <div className="relative h-80 w-80">
      {/* Tucked low and to the right, behind the compass. Smaller than the mark
       * so it reads as a detail hanging off it, not a second subject. */}
      <StandingShot
        file="ec-01-insights.jpg"
        alt="Campus Insights, the landing dashboard"
        className="absolute left-40 top-52 z-0 h-32"
      />
      <CompassMark className="relative z-10 h-80 w-80 -translate-y-8 brightness-[2.3] saturate-150" />
    </div>
  ),
  repoUrl: "https://github.com/syp0000/EventCompass",

  lede: "The University Program Board runs some of the biggest events on campus, but planning often depended on what previous organizers happened to remember. For Event Compass, I built the data foundation behind the planner dashboard, turning a raw Qualtrics export into reliable analytics planners could actually use.",
  summary: {
    problem: (
      <>
        Campus event planners worked from memory, because the survey data sat in an{" "}
        <Key>84 column export</Key> nobody could query.
      </>
    ),
    built: (
      <>
        The cleaning pipeline, the Supabase schema, <Key>18 analytics endpoints</Key>, and{" "}
        <Key>Campus Insights</Key>, the dashboard planners open first.
      </>
    ),
    result: (
      <>
        <Key>54,516 raw survey points</Key> filtered to <Key>36,308</Key> across 58 documented
        fields, powering four dashboard views.
      </>
    ),
  },
  metrics: [
    { value: "49", label: "API routes, across 41 React components and 11 pages" },
    {
      value: "18",
      label:
        "Analytics endpoints spanning demographics, preferences, engagement, budget sensitivity, event performance, and evaluator scoring",
    },
    { value: "54,516", label: "Raw survey data points, 36,308 after cleaning" },
    {
      value: "5",
      label: "Core planning operations: activities, schedule, shopping, tasks, and budget",
    },
  ],

  contributions: {
    title: "What I built",
    heading: "The data and analytics layer behind Event Compass.",
    items: [
      {
        title: "The data pipeline",
        body: "I built the cleaning and tokenization pipeline that turned a raw Qualtrics export into a queryable dataset. I also designed the Supabase tables the product reads from.",
      },
      {
        title: "Campus Insights",
        body: "I built the home dashboard planners see first. Its tabs let them explore campus preferences, demographics, pricing, and engagement. The same screen also shows recent event performance and what is coming next.",
      },
      {
        title: "18 analytics endpoints",
        body: "I built 18 of the application's 49 API routes. These endpoints supply the data used by Campus Insights and the last event analytics view.",
      },
    ],
    note: "The event builder, copilot, and forecasting work were built by my teammates. I include the full product for context, and every screenshot identifies who built the part being shown.",
  },

  costLabel: "84 columns. Still guessing",
  cost: (
    <>
      <p>
        Planners had survey data in Qualtrics and attendance history in CampusGroups, but the
        information lived in separate places.
      </p>
      <p>
        The Qualtrics export alone had 84 columns with labels like QID47_Browser. It needed
        significant cleaning before it could answer a planning question, so planners often relied on
        memory instead.
      </p>
    </>
  ),
  constraints: [
    {
      title: "Student event planning is messy by nature",
      body: "Event ideas, attendance expectations, budgets, vendors, food preferences, availability, and campus culture all change at once. Event Compass had to support planning decisions without pretending the inputs were clean or fixed.",
    },
    {
      title: "The product depended on trust before interaction",
      body: "Campus Insights sits on the home page, so users see analytics before they ask the copilot anything. That meant the dashboard could not feel like a demo. It needed reliable defaults, clean categories, and numbers that were defensible at first glance.",
    },
    {
      title: "Raw campus data had to become product intelligence",
      body: "The project combined survey exports, historical event information, student preferences, and planning workflows. Each source had different structure and quality, so the system needed cleaning, normalization, and translation before it could power recommendations or charts.",
    },
    {
      title: "Generic AI was not enough",
      body: "A general model does not automatically understand UPB events, local venues, campus habits, budget realities, or student shorthand. Event Compass needed campus specific context so its suggestions felt operational, not generic.",
    },
    {
      title: "Planning tools had to connect, not sit separately",
      body: "The dashboard, event builder, budget, tasks, schedule, shopping list, analytics, and copilot all needed to reinforce the same event planning flow. The challenge was making the app feel like one decision system instead of separate features.",
    },
  ],

  built: (
    <>
      <p>
        The project starts with the data. The raw Qualtrics export had <Mark>649 survey responses spread
        across 84 columns</Mark>, plus extra header rows, metadata, preview entries, low quality
        submissions, and fields that were not useful for planning. After cleaning, it became <Mark>626
        usable responses across 58 columns</Mark>. Rows were <Mark>filtered using reCAPTCHA score and response
        duration</Mark>, and identifying or administrative fields were removed before the data was used in
        the app.
      </p>
      <p>
        <Mark>The cleaning step also created a data dictionary</Mark>. Every original column was mapped to a
        short name, the actual survey question, and the Qualtrics import ID. That made the survey
        easier to query and easier to maintain when the export changed. For open text answers, a
        second pass protected <Mark>46 campus specific phrases</Mark> such as Cedar Point, West Side Market,
        Thwing Tuesday, UPBeat Spring Concert, and Ninja Creami before tokenizing the text. After
        that, the text was cleaned, lemmatized, and stripped of common filler words.
      </p>
      <p>
        The product built on top of that data is more than a chat box. It opens with Campus
        Insights, a dashboard for survey analytics with <Mark>four sections: campus preferences,
        demographics, budget and price sensitivity, and engagement and community</Mark>. It shows what
        students want, who responded, what they are willing to pay, how they hear about events, what
        keeps them from attending, and what makes them feel connected to campus.
      </p>
      <p>
        The event builder starts by asking how much the planner already knows. They can begin with
        no idea, a rough idea, or a solid idea. From there, the app collects the organization name,
        mission, goals, vibe, preferred dates, location needs, venue, constraints, budget, and
        expected attendance. Based on that brief, it <Mark>creates several complete event concepts</Mark> with a
        budget range, duration, attendance estimate, venue, activities, schedule, supplies, and prep
        tasks.
      </p>
      <p>
        Once the planner picks a concept, they choose what parts of the plan to create: activities,
        schedule, shopping list, task checklist, and budget. <Mark>The final event plan has eight tabs</Mark>:
        Overview, Activities, Schedule, Tasks, Budget, Shopping, Summary, and Forecast. Each event
        can move through Planning, Confirmed, Completed, or Cancelled.
      </p>
      <p>
        The shopping tab connects planning to real products. It <Mark>searches Amazon first, then Google
        Shopping if needed</Mark>, and returns listings with images, prices, ratings, reviews, vendors, and
        links within the selected price range. Choosing a product fills in the vendor, price, and
        link for the shopping item.
      </p>
      <p>
        The budget tab tracks the total budget, allocated amounts, spending, remaining funds, and
        category progress. The forecast tab gives the event <Mark>a predicted score out of 5.00</Mark>, estimates
        attendance and rating, and shows which features affected the prediction, including timing,
        structure, incentives, budget, registration, and location. At the end, the planner can
        generate a report and use the browser print dialog to save it as a PDF.
      </p>
    </>
  ),

  diagram: <CompassDiagram />,
  figureCaption:
    "The Qualtrics export came as 84 columns with machine names and three header rows on top. Nobody can query that. So staging does two things: it cleans the survey fields, and it writes a dictionary that maps every column back to the question a student actually saw. Then it normalizes into survey, respondent, response, question, answer. That is why there are four analytics views here and not four separate pipelines. Planning runs on its own track and meets the data at the outputs. Everything on the right only works as well as what got through on the left.",
  video: {
    src: demoVideo.url,
    poster: shotImages["ec-01-insights.jpg"],
    caption:
      "A one minute walkthrough of the real system: Campus Insights, guided intake, concept generation, the eight tab plan, live product search inside the shopping list, and the Forecast tab.",
  },
  // No full-bleed hero: Campus Insights rides beside the compass at the top,
  // and still opens the shot grid below at full size.
  shots: [
    {
      file: "ec-01-insights.jpg",
      owner: "Built by me",
      caption: "Campus Insights, the landing dashboard. Four tabbed views over the cleaned survey data.",

    },
    {
      file: "ec-02-intake.jpg",
      owner: "Team",
      caption: "The structured brief that feeds concept generation.",
    },
    {
      file: "ec-03-concepts.jpg",
      owner: "Team",
      caption:
        "Generated event concepts, each with budget, duration, attendance estimate, and venue.",
    },
    {
      file: "ec-04-budget.jpg",
      owner: "Team",
      caption: "Budget tracking by category, showing planned against committed spend.",
    },
    {
      file: "ec-05-shopping.jpg",
      owner: "Team",
      caption: "Live product search inside the shopping list, filtered by budget range.",
    },
    {
      file: "ec-06-forecast.jpg",
      owner: "Team",
      caption:
        "The forecast tab, a regression over historical events, fit on the dataset this pipeline produced.",
    },
  ],
  decisions: [
    {
      title: "Filter on reCAPTCHA score and completion time, not on nulls",
      body: "Responses that scored under 0.30 on reCAPTCHA, or came back in under ten seconds, were dropped. Twenty three did not survive. Dropping empty cells is cleaning. Deciding which submissions were not people is quality.",
    },
    {
      title: "Generate the codebook, do not maintain one",
      body: "The rename step writes out a dictionary mapping every original column to a short name, its question text, and its import id. A hand written codebook is wrong the first time the survey changes.",
    },
    {
      title: "Teach the tokenizer the campus",
      body: "Cedar Point, Thwing Tuesday, Spring Comedian, and 42 other local phrases collapse into single tokens before anything else runs. Standard tokenization turns Cedar Point into cedar and point, which means nothing. The theme analysis is only as good as the words it knows.",
    },
    {
      title: "Split the dashboard by question, not by chart type",
      body: "Campus Insights is tabbed into preferences, demographics, budget sensitivity, and engagement. A planner shows up with one of those four questions. Nobody shows up looking for a bar chart.",
    },
    {
      title: "Branch the intake on how much the planner already knows",
      body: "The builder asks first: no idea, rough idea, or solid idea. One form for all three would have been wrong for all three.",
    },
    {
      title: "Forecast with a regression, and show the coefficients",
      body: "Attendance and rating come from a model fit to past events, and the Feature Contributions table shows what drove each number. A score with no explanation gets ignored by the first planner who disagrees with it.",
    },
    {
      title: "Real products with real prices, not a text list",
      body: "The shopping tab pulls live listings with images, prices, and ratings, and clicking one fills in the vendor and the cost. A shopping list you cannot act on is just a note to yourself.",
    },
  ],

  aiThesis:
    "Nothing on the dashboard is generated. Every number traces back to a real response.",
  ai: [
    {
      kind: "Not used",
      title: "Nothing in the analytics path",
      body: "Every number on the dashboard is counted from the cleaned dataset. A planner reading attendance or cost per person is reading arithmetic, and can click back to the responses behind it.",
    },
    {
      kind: "Not used",
      title: "Deciding which responses were real",
      body: "Bots and speeders are caught by reCAPTCHA score and completion time. If a model made that call, nobody could check it later, and that filter is the reason anyone can trust the dataset.",
    },
    {
      kind: "Used",
      title: "Elsewhere in the product, by teammates",
      body: "Concept generation uses a language model, and the attendance forecast uses a regression fit to past events. Both read the cleaned dataset. Neither is my work, and both are only as good as the pipeline under them.",
    },
  ],

  changedLabel: "The Glow-Up",
  changed: (
    <>
      <p>
        The team turned Event Compass into a working event planning system. The raw survey started
        with 649 responses across 84 columns. After cleaning, it became 626 usable responses across
        58 documented fields. That data now supports Campus Insights, the landing page, with four
        dashboard views backed by 18 analytics endpoints.
      </p>
      <p>
        The product also includes a guided event builder, concept generation, an eight-tab planning
        workspace, budget tracking, task and schedule tools, shopping support, forecasting, copilot
        suggestions, and printable reports.
      </p>
      <p>
        The data quality matters because every dashboard number, recommendation, and forecast
        depends on what survived the cleaning step. If low-quality rows stayed in, the product would
        treat them like real student behavior.
      </p>
      <p>
        The main limitation is that Event Compass has not yet been tested through a full event
        cycle, from forecast to actual turnout and post-event feedback.
      </p>
    </>
  ),

};

