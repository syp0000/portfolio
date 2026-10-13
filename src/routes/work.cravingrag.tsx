import { createFileRoute } from "@tanstack/react-router";
import { CaseStudy, Key, Mark, type CaseData } from "@/components/CaseStudy";
import { CravingDiagram, CravingMark } from "@/components/Diagrams";

export const Route = createFileRoute("/work/cravingrag")({
  head: () => ({
    meta: [
      { title: "CravingRAG, recipe search that answers with evidence" },
      {
        name: "description",
        content:
          "A solo retrieval project on Snowflake Cortex. Describe a craving in everyday language and get real recipes back, with the ingredient lines behind each match. Blind-judged evaluation, NDCG@5 from 0.582 to 0.844.",
      },
      { property: "og:title", content: "CravingRAG, search how food feels" },
      {
        property: "og:description",
        content:
          "20,000 real recipes, evidence behind every score, and an evaluation that keeps its weak results visible. Case study by Siyeon Park.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/work/cravingrag" }],
  }),
  component: () => <CaseStudy data={data} />,
});

const data: CaseData = {
  meta: ["Public demo live", "2026", "Solo project", "Snowflake Cortex"],
  headline: "Describe the craving. Get a real recipe, with evidence.",
  mark: <CravingMark className="h-80 w-80" />,
  repoUrl: "https://github.com/syp0000/CravingRAG",
  demoUrl: "https://demo.cravingrag.com",
  lede: "An earlier project generated recipes with an AI model, and they satisfied every written requirement without feeling believable as food. CravingRAG tests the opposite idea: search 20,000 real recipes by how a person wants food to feel, and show the ingredient lines behind every match.",
  summary: {
    problem: (
      <>
        Generated recipes <Key>did not feel like food</Key>, and meaning-based search quietly fails
        the moment someone says <Key>"no shellfish"</Key>.
      </>
    ),
    built: (
      <>
        A retrieval pipeline on <Key>Snowflake Cortex</Key> over <Key>20,000 real recipes</Key>,
        with evidence required for every score and a blind human evaluation of four methods.
      </>
    ),
    result: (
      <>
        NDCG@5 rose from <Key>0.582 to 0.844</Key>, and hard exclusion took exclusion queries from{" "}
        <Key>0.245 to 0.855</Key>.
      </>
    ),
  },
  metrics: [
    {
      value: "0.844",
      label:
        "NDCG@5 for the best method, up from 0.582 for raw text embedding, on the frozen 342-recipe evaluation set",
    },
    {
      value: "386",
      label: "Query and recipe pairs scored by a human judge, blind to which method produced them",
    },
    {
      value: "21 min",
      label: "To enrich all 20,000 recipes with evidence-backed sensory scores, for about $90",
    },
    {
      value: "0",
      label: "External LLM APIs and separate vector databases. Everything runs inside Snowflake",
    },
  ],

  costLabel: "The problem worth testing",
  cost: (
    <>
      <p>
        Recipe generation looked solved until the output had to be cooked. The generated dishes
        checked every box in the prompt and still read like nobody had ever made them. Real recipes
        carry the judgment of someone who actually fed people, so the better question became whether
        search could understand a craving, not whether a model could write a plausible dish.
      </p>
      <p>
        Cravings are feelings, not keywords. "Something cozy" should find a ramen recipe that never
        uses the word cozy. Embeddings handle that well, and fail at the part that matters most:
        negation. A search for "no almonds" can surface almond recipes precisely because the word
        almonds is sitting in the query. A system that respects restrictions cannot leave them to
        semantic similarity.
      </p>
    </>
  ),

  constraintsLabel: "Constraints",
  constraintsTitle: "What made this more than a demo",
  constraints: [
    {
      title: "Embeddings cannot say no",
      body: "Vector similarity finds things that are near a meaning. An excluded ingredient is a rule, not a meaning, so exclusions had to leave the embedding space entirely and run as checks against the real title and ingredient text.",
    },
    {
      title: "No evidence, no score",
      body: "AI-extracted qualities can be wrong. Every sensory score has to cite an ingredient or instruction line from the recipe, and a score without evidence is left empty rather than guessed.",
    },
    {
      title: "Honest numbers only",
      body: "Fifteen development queries and one human judge is a small evaluation. The writeup says so, keeps the wide confidence intervals visible, and never presents the 342-recipe score as a score for the 20,000-recipe live collection.",
    },
    {
      title: "Every live search costs money",
      body: "Cortex calls are paid. The public demo replays 20 precomputed results and never contacts Snowflake, while the live app sits behind Cloudflare Access with a least-privilege Snowflake role.",
    },
  ],

  built: (
    <>
      <p>
        CravingRAG reads each recipe once. <Mark>Snowflake Cortex scores eight sensory qualities,
        spicy through comforting, and each score must cite an ingredient or instruction line</Mark>.
        The same pass writes a sensory profile for each recipe, which is embedded and stored. Nothing
        is reread at search time.
      </p>
      <p>
        A search parses the craving into qualities and exclusions, finds the closest sensory
        profiles by vector similarity, then <Mark>removes any recipe whose real ingredient text
        contains an excluded item</Mark>. A final quality layer, Lean V3, drops drinks from food
        searches, recipe fragments, identity mismatches, and near-duplicates of the same dish
        family. The app returns up to five recipes, and fewer when fewer hold up.
      </p>
      <p>
        The React app has three pages. Search returns the matches and shows why each one matched,
        down to the ingredient line. Catalog turns the same scores into a planning question, what
        people ask for that the catalog does not provide, using clearly labeled synthetic demand.
        About explains the pipeline and its limitations in plain language. <Mark>Every search can
        also write a decision record</Mark>: how the query was interpreted, which candidates were
        rejected and why, and what was selected.
      </p>
      <p>
        The whole thing was evaluated before it was scaled. Four retrieval methods ran against the
        same 15 queries on a frozen 342-recipe collection, and a human judged 386 query and recipe
        pairs without knowing which method produced them. Only then did the pipeline run on 20,000
        recipes, which promptly exposed new failures, drinks in food searches and duplicate dishes,
        and those failures became Lean V3.
      </p>
    </>
  ),

  diagram: <CravingDiagram />,
  figureCaption:
    "Enrichment runs once per recipe: dlt loads the RecipeNLG corpus into Snowflake, Cortex scores eight qualities with required evidence, and one sensory profile embedding is stored per recipe. A search parses the craving, ranks by vector similarity, enforces exclusions against the real ingredient text rather than the embeddings, and filters obvious misses. The top five carry their evidence lines, each search can write a decision record, and the public demo replays twenty saved results without a single live call.",

  shots: [
    {
      file: "cr-01-search.jpg",
      caption:
        "The public gallery at demo.cravingrag.com. Twenty saved cravings replay real pipeline results, so anyone can try it without triggering a paid Cortex call.",
    },
    {
      file: "cr-02-results.jpg",
      caption:
        'Results for "a warm spicy soup, no shellfish". The detail panel shows why the recipe matched and the ingredient lines that back it up, with the exclusion applied as a rule.',
    },
    {
      file: "cr-04-catalog.jpg",
      caption:
        "The Catalog page asks a business question with the same scores: what do people request that the menu barely offers. The demand data is synthetic and labeled as such on the page.",
    },
    {
      file: "cr-05-about.jpg",
      caption:
        "The About page explains the pipeline, the evaluation, and the limitations in plain language, including what the system deliberately refuses to guess.",
    },
  ],

  decisionsLabel: "Technical decisions",
  decisions: [
    {
      title: "Search real recipes instead of generating new ones",
      body: "The previous project proved a model can satisfy a prompt without producing believable food. Retrieval caps the system's creativity at zero and spends it all on understanding the craving.",
    },
    {
      title: "Rewrite recipes into sensory language before embedding",
      body: "Embedding an AI-written sensory profile of each recipe beat embedding the raw recipe text, 0.732 NDCG@5 against 0.582. The profile describes how the dish feels, which is the language cravings are spoken in.",
    },
    {
      title: "Enforce exclusions on text, not in the vector space",
      body: "Hard string checks against the real title and ingredients took exclusion-query NDCG from 0.245 to 0.855, the single largest improvement in the evaluation. It is a preference filter and the app says so, not allergy guidance.",
    },
    {
      title: "Require evidence for every score",
      body: "A spicy score of 0.8 points at the ingredient line that earned it, such as ten Thai chile peppers. If Cortex cannot find a supporting line, the score stays empty. That rule survived the scale-up: every non-empty score in the 20,000-recipe run still had evidence.",
    },
    {
      title: "Publish the losing methods too",
      body: "The structured eight-quality scores lost the ranking contest to profile embeddings and the writeup keeps that result, along with the wide confidence interval on the exclusion gain. The weak numbers are what make the strong ones credible.",
    },
    {
      title: "Keep the evaluation score attached to its collection",
      body: "The 0.844 belongs to the frozen 342-recipe development set. The live 20,000-recipe collection has no NDCG claim, and the README says a full V3 evaluation would need a holdout query set and a second judge.",
    },
    {
      title: "Split the demo from the live app",
      body: "The public demo is static, reads gallery.json, and costs nothing per visit. The live app takes any phrase, makes paid Cortex calls, and sits behind Cloudflare Access with a least-privilege Snowflake role defined in SQL.",
    },
  ],

  aiLabel: "Where the AI sits",
  aiThesis: "The model reads and describes. It never decides what is excluded.",
  ai: [
    {
      kind: "Used",
      title: "Reading each recipe once",
      body: "Cortex extracts the eight sensory qualities with their evidence lines and writes the sensory profile that gets embedded. This runs once per recipe at load time, never per search.",
    },
    {
      kind: "Used",
      title: "Understanding the craving",
      body: "The query is parsed and embedded so that cozy noodle bowl can find a ramen recipe that never says cozy.",
    },
    {
      kind: "Not used",
      title: "Exclusions and rankings that must be right",
      body: "Excluded ingredients are string checks against the real recipe text. Recipe content is never generated. Where a wrong answer has a cost, the system uses rules it can replay.",
    },
  ],

  changedLabel: "What I learned",
  changed: (
    <>
      <p>
        Scale creates its own failure modes. The 342-recipe collection never showed a drink in a
        food search, because it was too small to contain many drinks. The 20,000-recipe run surfaced
        drinks, fragments, and near-duplicate dish families within minutes of going live, and the
        fix was a quality layer the evaluation had never asked for.
      </p>
      <p>
        The other lesson was about claims. It is tempting to put 0.844 next to the 20,000-recipe
        collection, and it would be wrong. Keeping each number attached to the exact dataset that
        produced it costs a sentence of nuance in the README and buys the right to be believed.
      </p>
    </>
  ),
};
