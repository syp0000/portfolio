import { createFileRoute } from "@tanstack/react-router";
import { CaseStudy, type CaseData } from "@/components/CaseStudy";
import { PantryDiagram, PantryMark } from "@/components/Diagrams";
import { shotImages } from "@/lib/shots";

export const Route = createFileRoute("/work/pantry-ai")({
  head: () => ({
    meta: [
      { title: "Pantry AI, cook from what you already have" },
      {
        name: "description",
        content:
          "A pantry and meal planning product built by four people. I designed the schema and API contracts, owned two modules, and the team placed third of twenty.",
      },
      { property: "og:title", content: "Pantry AI, an inventory problem in a kitchen" },
      {
        property: "og:description",
        content:
          "Designing the data model and API contracts three other engineers build against. Case study by Siyeon Park.",
      },
    ],
  }),
  component: () => <CaseStudy data={data} />,
});

const data: CaseData = {
  meta: ["Top 3 of 20 teams", "2025", "Team of 4", "CWRU Software Engineering"],
  headline: "Cook from what you already have.",
  mark: <PantryMark className="h-80 w-80" />,
  lede: "Food gets wasted when people forget what is sitting in the back of the pantry. PantryAI helps users track what they own, see what is close to expiring, generate recipes from those ingredients, and plan meals for the week.",
  metrics: [
    {
      value: "55",
      label:
        "API endpoints across pantry, recipe, meal planner, grocery, preferences, and social workflows",
    },
    { value: "19", label: "Routed screens, from pantry management to social recipe discovery" },
    { value: "3", label: "Integrated services: Supabase, OpenAI, and Spoonacular" },
    { value: "3 of 20", label: "Placed in the course cohort" },
  ],

  contributions: {
    title: "What I built",
    heading:
      "The pantry system was the base of the app. Everything else depended on it.",
    items: [
      {
        title: "The database and the migration",
        body: "I set up the Supabase database after we moved away from Firebase. I built the first half of the schema during the migration, including 7 of the final 14 tables. The rest were added later as the project grew.",
      },
      {
        title: "18 pantry API routes",
        body: "Inventory management, item creation and updates, filtering, sorting, expiration handling, low stock checks, batch updates, ingredient validation, autocomplete, and search. I documented the routes with JSDoc so the team had browsable API documentation while building.",
      },
      {
        title: "The meal planner front end",
        body: "The weekly calendar, breakfast, lunch and dinner slots, an optional fourth meal slot, week navigation, a popup month calendar, and the grocery view beside the planner.",
      },
    ],
    note: "The recipe generator and For Your Taste social features were built by my teammates. I helped design the shared schema and API shapes so our work could connect cleanly.",
  },

  cost: (
    <>
      <p>
        Most food waste at home is not complicated. People buy things they already have, forget what
        is about to expire, and then throw food away.
      </p>
      <p>
        The hard part is that pantry apps only work if people keep using them. That means the data
        entry has to be simple, the food names have to stay clean, and the rest of the app has to
        actually use the pantry instead of treating it like a separate list.
      </p>
    </>
  ),
  built: (
    <>
      <p>PantryAI has four connected parts.</p>
      <p>
        The pantry tracks ingredients, quantities, categories, and expiration dates. The recipe
        generator uses selected pantry items to create recipes. The meal planner lets users schedule
        saved recipes onto a weekly calendar. The grocery list helps users track what they still
        need.
      </p>
      <p>
        The social section, For Your Taste, lets users share recipes, like posts, comment, and
        browse what other people are cooking.
      </p>
      <p>
        The important part is how the pieces connect. The pantry decides what ingredients are
        available. The recipe generator works from those ingredients. The meal planner schedules the
        recipes. The grocery list fills in what is missing.
      </p>
    </>
  ),

  diagram: <PantryDiagram />,
  figureCaption:
    "Five screens, four layers, one pantry underneath all of it. Recipes are generated from items the user picked. Meal plans schedule recipes that were already saved. The grocery list fills in what the pantry does not have. Spoonacular checks ingredient names before anything is written, and expired items move into their own table so the pantry only shows food you can still use.",
  // No full-bleed hero shot: the demo video already opens on the pantry screen,
  // and it appears again in the grid below.
  // The upload was named .mov but the container is already MP4/H.264, so it is
  // served as .mp4 to keep the MIME type honest.
  video: {
    src: "/pantryai.mp4",
    poster: shotImages["pa-01-pantry.jpg"],
    caption:
      "A walkthrough of the running app: the pantry with expiration countdowns, recipe generation from selected items, the weekly meal planner, and the grocery list beside it.",
  },
  shots: [
    {
      file: "pa-06-welcome.jpg",
      caption: "Start page. Where a new user lands.",
      owner: "Team",
    },
    {
      file: "pa-05-login.jpg",
      caption: "Login and signup, with email or Google.",
      owner: "Team",
    },
    {
      file: "pa-01-pantry.jpg",
      caption:
        "The pantry. Every item carries a quantity and a countdown to expiration. This screen runs on the 18 routes I built.",
      owner: "Backend by me",
    },
    {
      file: "pa-02-recipe-generator.jpg",
      caption:
        "Recipe generator. Pick items out of the pantry, add preferences and notes, and generate.",
      owner: "Team",
    },
    {
      file: "pa-03-meal-planner.jpg",
      caption:
        "Meal planner. Saved recipes get scheduled onto the week, with the grocery list beside it.",
      owner: "Built by me",
    },
    {
      file: "pa-04-feed.jpg",
      caption: "For Your Taste. Saved recipes get shared, liked, and commented on.",
      owner: "Team",
    },
  ],

  decisionsLabel: "Technical decisions",
  decisions: [
    {
      title: "Moved from Firebase to Supabase",
      body: "I moved the app from Firebase to Supabase because the data became relational. Pantry items, recipes, users, saved meals, grocery lists, and posts all needed relationships that were awkward to manage in Firebase.",
    },
    {
      title: "Validated ingredient names with Spoonacular",
      body: "Users can type anything, but bad ingredient names create problems later when the recipe generator tries to use them. One endpoint validates ingredient names, and another gives autocomplete suggestions so users are guided toward valid entries.",
    },
    {
      title: "Kept expiration logic centralized",
      body: "Instead of spreading date checks across every screen, the app moves expired items out of the active pantry view and into an expired items table, so the pantry stays focused on usable food.",
    },
    {
      title: "Stored meal plans by date and meal type",
      body: "That made the weekly calendar easier to render and update, since each slot could be found directly from the selected day and meal name.",
    },
    {
      title: "Case insensitive matching on grocery items",
      body: "Adding Milk and milk updates the same item instead of creating duplicates.",
    },
  ],

  aiLabel: "Where OpenAI fits",
  ai: [
    {
      kind: "Used",
      title: "Recipe generation, with constraints",
      body: "OpenAI is used for recipe generation, but only with constraints. The model receives the user's real pantry items and preferences, then generates recipes from that context.",
    },
    {
      kind: "Not used",
      title: "Anything that needs a clear answer",
      body: "Ingredient validation comes from Spoonacular. Expiration is based on dates. Those are not places where guessing is useful.",
    },
  ],

  changedLabel: "What I learned",
  changed: (
    <>
      <p>
        This project taught me that the best place for logic is not always the front end.
      </p>
      <p>
        Expiration rules belonged close to the data. Ingredient validation needed an external food
        source. Batch updates were better than sending one request per item. API contracts mattered
        because four people were building at the same time.
      </p>
      <p>
        The final project placed 3rd out of 20 teams, but the bigger takeaway was learning how much
        smoother a project becomes when the data model, API routes, and UI all agree with each
        other.
      </p>
    </>
  ),
};
