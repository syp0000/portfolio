/**
 * Technical documentation figures. Real SVG, accent color on flow arrows.
 */

const box =
  "fill-[var(--card)] stroke-[var(--hairline)]";
const label = "fill-[var(--foreground)] text-[12px] font-medium";
const sub = "fill-[var(--muted-foreground)] text-[10px]";

function Defs() {
  return (
    <defs>
      <marker
        id="arw"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

const flow = {
  stroke: "var(--accent)",
  strokeWidth: 1.4,
  markerEnd: "url(#arw)",
  fill: "none",
} as const;

function Node({
  x,
  y,
  w = 150,
  h = 58,
  title,
  meta,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  meta?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" className={box} strokeWidth="1" />
      <text x={x + w / 2} y={meta ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" className={label}>
        {title}
      </text>
      {meta && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className={sub}>
          {meta}
        </text>
      )}
    </g>
  );
}

export function NcrDiagram() {
  return (
    <svg viewBox="0 0 900 340" className="h-auto w-full min-w-[680px]" role="img"
      aria-label="The operator lead submits from a mobile web form to the Node.js API, which is the only thing the browser talks to. The API calls the Anthropic API for polish and translation and receives the text back, then returns it for operator confirmation. On submit the API runs deterministic validation on time format, duplicate process, and overlap checks, and writes to PostgreSQL on AWS RDS. Reads travel back from PostgreSQL to the Node.js API, which scopes them by role and renders a user view that reads all records and writes its own and shared ones, and an admin view with full access to all records. No role touches the database directly">
      <Defs />
      <Node x={10} y={140} title="Operator lead, at the line" meta="mobile web form" w={170} />
      <Node x={240} y={140} title="Node.js API" meta="JWT, locking, history" w={170} />
      <Node x={230} y={20} title="Anthropic API" meta="Korean and English, polish and translate" w={200} />
      <Node x={225} y={252} title="Operator confirmation" meta="review, overwrite, submit" w={200} />
      <Node x={490} y={140} title="Deterministic validation" meta="time format, duplicate process, overlap checks" w={190} h={64} />
      <Node x={730} y={140} title="PostgreSQL on AWS RDS" meta="2,500+ records" w={160} />
      <Node x={10} y={26} title="User view" meta="reads all, writes own and shared" w={170} h={52} />
      <Node x={10} y={258} title="Admin view" meta="full access, all records" w={170} h={52} />

      <path d="M 180 169 L 236 169" {...flow} />

      <path d="M 295 138 L 295 82" {...flow} strokeDasharray="4 4" />
      <path d="M 355 82 L 355 136" {...flow} strokeDasharray="4 4" />

      <path d="M 295 198 L 295 248" {...flow} />
      <path d="M 360 248 L 360 200" {...flow} />

      <path d="M 410 169 L 486 169" {...flow} />
      <path d="M 680 172 L 726 170" {...flow} />

      {/* read path: PostgreSQL back to the API, then out to role scoped views */}
      <path d="M 810 198 L 810 228 L 380 228 L 380 200" {...flow} strokeDasharray="4 4" />
      <path d="M 240 186 L 212 186 L 212 288 L 184 288" {...flow} strokeDasharray="4 4" />
      <path d="M 240 152 L 212 152 L 212 52 L 184 52" {...flow} strokeDasharray="4 4" />
      <text x={216} y={112} className={sub}>role scoped</text>
      <text x={216} y={124} className={sub}>reads</text>
    </svg>
  );
}




export function CompassDiagram() {
  const grp = { fill: "none", stroke: "var(--hairline)", strokeDasharray: "4 3", opacity: 0.9 };
  const gl = { fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" };
  const bx = { fill: "var(--card)", stroke: "var(--hairline)", strokeWidth: 1 };
  const T = { fill: "var(--foreground)", fontSize: 11.5, fontWeight: 500 };
  const S = { fill: "var(--muted-foreground)", fontSize: 9 };
  const f = { stroke: "var(--accent)", strokeWidth: 1.25, fill: "none", markerEnd: "url(#arw)" } as const;

  return (
    <svg viewBox="0 0 1240 686" className="h-auto w-full min-w-[900px]" role="img"
      aria-label="Event Compass architecture in six groups. Inputs are a Qualtrics survey export of 649 responses across 84 columns, CampusGroups history of 52 past events, and planner intake. The data foundation stages the survey into stg_survey_raw, derives stg_dictionary for column to question mapping, and builds a normalized survey model plus a past event model. The analytics layer holds campus preferences, demographics, budget and price sensitivity, engagement and community, and the forecast model. The planning layer runs guided start into concept generation into an event plan. Workspace tables hold events, budget_items, tasks, schedule_items, shopping_items, and activities. Planner outputs are the Campus Insights dashboard, the event copilot, an eight tab planning workspace, a printable event report, and product search results. The event copilot reads all six workspace tables, so its chats and suggestions stay grounded in the open event plan.">
      <Defs />

      <rect x="8" y="34" width="182" height="632" rx="8" {...grp} />
      <text x="20" y="26" {...gl}>INPUTS</text>
      <rect x="214" y="34" width="420" height="348" rx="8" {...grp} />
      <text x="226" y="26" {...gl}>DATA FOUNDATION</text>
      <rect x="658" y="34" width="254" height="348" rx="8" {...grp} />
      <text x="670" y="26" {...gl}>ANALYTICS LAYER</text>
      <rect x="214" y="424" width="420" height="110" rx="8" {...grp} />
      <text x="226" y="416" {...gl}>PLANNING LAYER</text>
      <rect x="658" y="424" width="254" height="242" rx="8" {...grp} />
      <text x="670" y="416" {...gl}>WORKSPACE TABLES</text>
      <rect x="936" y="34" width="296" height="632" rx="8" {...grp} />
      <text x="948" y="26" {...gl}>PLANNER OUTPUTS</text>

      <path d="M176 108 L 234 112" {...f} />
      <path d="M413 104 L 436 100" {...f} />
      <path d="M413 124 C 426 124 428 172 436 178" {...f} />
      <path d="M612 100 C 624 100 626 168 634 176" {...f} />
      <path d="M612 182 C 640 182 646 95 676 95" {...f} />
      <path d="M612 188 C 640 188 646 143 676 143" {...f} />
      <path d="M612 194 C 640 194 646 191 676 191" {...f} />
      <path d="M612 200 C 640 200 646 239 676 239" {...f} />
      <path d="M890 95 C 920 95 926 160 956 168" {...f} />
      <path d="M890 143 C 920 143 926 166 956 172" {...f} />
      <path d="M890 191 C 920 191 926 180 956 178" {...f} />
      <path d="M890 239 C 920 239 926 192 956 184" {...f} />
      <path d="M176 328 L 234 322" {...f} />
      <path d="M413 322 L 676 322" {...f} />
      <path d="M890 334 C 926 334 936 424 950 440" {...f} />
      <path d="M176 500 C 200 500 206 480 224 479" {...f} />
      <path d="M356 479 L 364 479" {...f} />
      <path d="M496 479 L 504 479" {...f} />
      <path d="M626 470 L 691 468" {...f} />
      <path d="M875 470 C 906 470 926 470 954 470" {...f} />
      <path d="M817 604 C 880 604 900 610 950 612" {...f} />
      <path d="M1084 494 L 1084 516" {...f} />
      <path d="M875 458 C 900 458 912 340 950 310" {...f} />
      <path d="M817 502 C 895 502 918 370 950 318" {...f} />
      <path d="M817 536 C 902 536 924 390 950 326" {...f} />
      <path d="M817 570 C 908 570 928 410 950 334" {...f} />
      <path d="M817 596 C 913 596 932 430 950 342" {...f} />
      <path d="M817 638 C 918 638 935 450 950 350" {...f} />

      <rect x="22" y="84" width="154" height="52" rx="6" {...bx} />
      <text x="99" y="104" textAnchor="middle" {...T}>Qualtrics survey export</text>
      <text x="99" y="120" textAnchor="middle" {...S}>649 responses, 84 columns</text>
      <rect x="22" y="300" width="154" height="52" rx="6" {...bx} />
      <text x="99" y="320" textAnchor="middle" {...T}>CampusGroups history</text>
      <text x="99" y="336" textAnchor="middle" {...S}>52 events, attendance, budget</text>
      <rect x="22" y="470" width="154" height="60" rx="6" {...bx} />
      <text x="99" y="491" textAnchor="middle" {...T}>Planner intake</text>
      <text x="99" y="507" textAnchor="middle" {...S}>idea, goals, budget,</text>
      <text x="99" y="519" textAnchor="middle" {...S}>venue, audience</text>

      <rect x="234" y="90" width="179" height="48" rx="6" {...bx} />
      <text x="323" y="110" textAnchor="middle" {...T}>stg_survey_raw</text>
      <text x="323" y="125" textAnchor="middle" {...S}>cleaned survey fields</text>
      <rect x="436" y="78" width="176" height="44" rx="6" {...bx} />
      <text x="524" y="96" textAnchor="middle" {...T}>stg_dictionary</text>
      <text x="524" y="110" textAnchor="middle" {...S}>column to question mapping</text>
      <rect x="436" y="150" width="176" height="66" rx="6" {...bx} />
      <text x="524" y="170" textAnchor="middle" {...T}>survey model</text>
      <text x="524" y="186" textAnchor="middle" {...S}>survey, respondent, response,</text>
      <text x="524" y="199" textAnchor="middle" {...S}>question, answer</text>
      <rect x="234" y="292" width="179" height="60" rx="6" {...bx} />
      <text x="323" y="313" textAnchor="middle" {...T}>past event model</text>
      <text x="323" y="329" textAnchor="middle" {...S}>past_events, event_stats,</text>
      <text x="323" y="341" textAnchor="middle" {...S}>event_feedback</text>

      <rect x="676" y="76" width="214" height="38" rx="6" {...bx} />
      <text x="783" y="99" textAnchor="middle" {...T}>Campus preferences</text>
      <rect x="676" y="124" width="214" height="38" rx="6" {...bx} />
      <text x="783" y="147" textAnchor="middle" {...T}>Demographics</text>
      <rect x="676" y="172" width="214" height="38" rx="6" {...bx} />
      <text x="783" y="195" textAnchor="middle" {...T}>Budget and price sensitivity</text>
      <rect x="676" y="220" width="214" height="38" rx="6" {...bx} />
      <text x="783" y="243" textAnchor="middle" {...T}>Engagement and community</text>
      <rect x="676" y="292" width="214" height="60" rx="6" {...bx} />
      <text x="783" y="313" textAnchor="middle" {...T}>Forecast model</text>
      <text x="783" y="329" textAnchor="middle" {...S}>score, attendance, rating,</text>
      <text x="783" y="341" textAnchor="middle" {...S}>feature contributions</text>

      <rect x="224" y="451" width="132" height="56" rx="6" {...bx} />
      <text x="290" y="472" textAnchor="middle" {...T}>Guided start</text>
      <text x="290" y="487" textAnchor="middle" {...S}>no idea, rough idea,</text>
      <text x="290" y="499" textAnchor="middle" {...S}>solid idea</text>
      <rect x="364" y="451" width="132" height="56" rx="6" {...bx} />
      <text x="430" y="479" textAnchor="middle" {...T}>Concept generation</text>
      <rect x="504" y="451" width="122" height="56" rx="6" {...bx} />
      <text x="565" y="479" textAnchor="middle" {...T}>Event plan</text>

      <rect x="691" y="448" width="184" height="40" rx="6" {...bx} />
      <text x="783" y="472" textAnchor="middle" {...T}>events</text>
      <rect x="691" y="486" width="126" height="32" rx="6" {...bx} />
      <text x="754" y="506" textAnchor="middle" {...T}>budget_items</text>
      <rect x="691" y="520" width="126" height="32" rx="6" {...bx} />
      <text x="754" y="540" textAnchor="middle" {...T}>tasks</text>
      <rect x="691" y="554" width="126" height="32" rx="6" {...bx} />
      <text x="754" y="574" textAnchor="middle" {...T}>schedule_items</text>
      <rect x="691" y="588" width="126" height="32" rx="6" {...bx} />
      <text x="754" y="608" textAnchor="middle" {...T}>shopping_items</text>
      <rect x="691" y="622" width="126" height="32" rx="6" {...bx} />
      <text x="754" y="642" textAnchor="middle" {...T}>activities</text>

      <rect x="954" y="144" width="262" height="56" rx="6" {...bx} />
      <text x="1085" y="166" textAnchor="middle" {...T}>Campus Insights dashboard</text>
      <text x="1085" y="182" textAnchor="middle" {...S}>four tabs, the home route</text>
      <rect x="954" y="302" width="262" height="52" rx="6" {...bx} />
      <text x="1085" y="323" textAnchor="middle" {...T}>Event copilot</text>
      <text x="1085" y="339" textAnchor="middle" {...S}>chats and suggestions</text>
      <rect x="954" y="444" width="262" height="52" rx="6" {...bx} />
      <text x="1085" y="465" textAnchor="middle" {...T}>Eight tab planning workspace</text>
      <text x="1085" y="481" textAnchor="middle" {...S}>overview through forecast</text>
      <rect x="954" y="518" width="262" height="44" rx="6" {...bx} />
      <text x="1085" y="545" textAnchor="middle" {...T}>Printable event report</text>
      <rect x="954" y="586" width="262" height="52" rx="6" {...bx} />
      <text x="1085" y="607" textAnchor="middle" {...T}>Product search results</text>
      <text x="1085" y="623" textAnchor="middle" {...S}>images, prices, ratings, links</text>
    </svg>
  );
}



export function PantryDiagram() {
  const bx = { fill: "var(--card)", stroke: "var(--hairline)", strokeWidth: 1 };
  const T = { fill: "var(--foreground)", fontSize: 11.5, fontWeight: 500 };
  const S = { fill: "var(--muted-foreground)", fontSize: 9 };
  const CH = { fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" };
  const EL = { fill: "var(--muted-foreground)", fontSize: 8.5, fontStyle: "italic", opacity: 0.9 };
  const f = { stroke: "var(--accent)", strokeWidth: 1.25, fill: "none", markerEnd: "url(#arw)" } as const;
  const d = { stroke: "var(--muted-foreground)", strokeWidth: 1.15, fill: "none", markerEnd: "url(#arw-dim)", strokeDasharray: "4 3", opacity: 0.75 } as const;

  return (
    <svg viewBox="0 0 1340 686" className="h-auto w-full min-w-[980px]" role="img"
      aria-label="Pantry AI in four columns. User facing screens for auth, pantry, recipe generator, meal planner, and For Your Taste each call a Next.js API group. Those write to Supabase tables: users and preferences, pantry and expired items, item and saved recipes, mealplan and grocery, and the social tables. Spoonacular validates ingredient names and provides autocomplete, an OpenAI call returns structured recipe JSON, and the weekly output is scheduled meals plus a grocery list.">
      <Defs />
      <defs>
        <marker id="arw-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
        </marker>
      </defs>

      <text x="16" y="22" {...CH}>USER FACING WORKFLOW</text>
      <text x="290" y="22" {...CH}>NEXT.JS API ROUTES</text>
      <text x="596" y="22" {...CH}>SUPABASE DATA MODEL</text>
      <text x="1140" y="22" {...CH}>EXTERNAL AND OUTPUTS</text>

      <path d="M236 92 L 286 92" {...f} />
      <path d="M236 214 L 286 214" {...f} />
      <path d="M536 214 L 592 214" {...f} />
      <path d="M236 348 L 286 348" {...f} />
      <path d="M536 340 L 592 340" {...f} />
      <path d="M236 488 L 286 488" {...f} />
      <path d="M536 488 L 592 488" {...f} />
      <path d="M812 488 L 862 488" {...f} />
      <path d="M1082 488 L 1136 488" {...f} />
      <path d="M236 612 L 286 612" {...f} />
      <path d="M536 612 L 592 612" {...f} />
      <path d="M536 176 C 700 142 950 142 1136 196" {...f} />
      <path d="M536 356 C 640 300 760 288 862 322" {...f} />
      <path d="M1082 330 L 1136 330" {...f} />
      <path d="M704 250 L 704 292" {...f} />

      <path d="M536 92 L 592 92" {...d} />
      <path d="M812 92 L 862 92" {...d} />
      <path d="M704 128 L 704 174" {...d} />
      <path d="M812 214 L 862 214" {...d} />
      <path d="M806 404 C 838 426 858 444 878 462" {...d} />
      <path d="M884 394 C 862 416 800 414 762 446" {...d} />
      <path d="M916 394 C 906 470 856 580 828 602" {...d} />
      <path d="M812 612 L 862 612" {...d} />

      <text x="836" y="442" {...EL}>missing ingredients</text>
      <text x="686" y="428" {...EL}>schedule saved recipes</text>
      <text x="872" y="536" {...EL}>shared recipe_id</text>

      <rect x="16" y="62" width="220" height="60" rx="6" {...bx} />
      <text x="30" y="86" {...T}>Signed in user</text>
      <text x="30" y="103" {...S}>email or Google auth</text>
      <rect x="286" y="62" width="250" height="60" rx="6" {...bx} />
      <text x="300" y="86" {...T}>Auth context</text>
      <text x="300" y="103" {...S}>user id passed to routes</text>
      <rect x="592" y="56" width="220" height="72" rx="6" {...bx} />
      <text x="606" y="80" {...T}>users</text>
      <text x="606" y="97" {...S}>user_id, email, name</text>
      <text x="606" y="111" {...S}>created_at</text>
      <rect x="862" y="56" width="220" height="72" rx="6" {...bx} />
      <text x="876" y="80" {...T}>preferences</text>
      <text x="876" y="97" {...S}>id, user_id</text>
      <text x="876" y="111" {...S}>preference text</text>

      <rect x="16" y="176" width="220" height="76" rx="6" {...bx} />
      <text x="30" y="200" {...T}>Pantry screen</text>
      <text x="30" y="217" {...S}>add, edit, delete, search</text>
      <text x="30" y="231" {...S}>quantity and expiration</text>
      <rect x="286" y="164" width="250" height="100" rx="6" {...bx} />
      <text x="300" y="188" {...T}>Pantry API group</text>
      <text x="300" y="205" {...S}>18 routes</text>
      <text x="300" y="219" {...S}>create, update, bulk update</text>
      <text x="300" y="233" {...S}>filter, sort, search, low stock</text>
      <rect x="592" y="178" width="220" height="72" rx="6" {...bx} />
      <text x="606" y="202" {...T}>pantry</text>
      <text x="606" y="219" {...S}>pantry_id, user_id</text>
      <text x="606" y="233" {...S}>pantry_name</text>
      <rect x="862" y="178" width="220" height="72" rx="6" {...bx} />
      <text x="876" y="202" {...T}>expired_items</text>
      <text x="876" y="219" {...S}>pantry_id, name, exp_date</text>
      <text x="876" y="233" {...S}>quantity, expired_at</text>
      <rect x="1136" y="178" width="188" height="72" rx="6" {...bx} />
      <text x="1150" y="202" {...T}>Spoonacular</text>
      <text x="1150" y="219" {...S}>validate names</text>
      <text x="1150" y="233" {...S}>autocomplete</text>

      <rect x="16" y="310" width="220" height="76" rx="6" {...bx} />
      <text x="30" y="334" {...T}>Recipe generator</text>
      <text x="30" y="351" {...S}>selected pantry items</text>
      <text x="30" y="365" {...S}>preferences and notes</text>
      <rect x="286" y="310" width="250" height="76" rx="6" {...bx} />
      <text x="300" y="334" {...T}>Recipe API group</text>
      <text x="300" y="351" {...S}>recommendations</text>
      <text x="300" y="365" {...S}>detailed JSON recipe, save</text>
      <rect x="592" y="292" width="220" height="112" rx="6" {...bx} />
      <text x="606" y="316" {...T}>item</text>
      <text x="606" y="333" {...S}>item_id, pantry_id</text>
      <text x="606" y="347" {...S}>name, quantity, unit</text>
      <text x="606" y="361" {...S}>category, exp_date</text>
      <text x="606" y="375" {...S}>in_pantry, date_added</text>
      <rect x="862" y="306" width="220" height="88" rx="6" {...bx} />
      <text x="876" y="330" {...T}>saved</text>
      <text x="876" y="347" {...S}>recipe_id, user_id</text>
      <text x="876" y="361" {...S}>recipe_json</text>
      <text x="876" y="375" {...S}>created_at</text>
      <rect x="1136" y="306" width="188" height="72" rx="6" {...bx} />
      <text x="1150" y="330" {...T}>Recipe service</text>
      <text x="1150" y="347" {...S}>OpenAI call</text>
      <text x="1150" y="361" {...S}>structured JSON</text>

      <rect x="16" y="450" width="220" height="76" rx="6" {...bx} />
      <text x="30" y="474" {...T}>Meal planner</text>
      <text x="30" y="491" {...S}>week calendar</text>
      <text x="30" y="505" {...S}>breakfast, lunch, dinner, other</text>
      <rect x="286" y="450" width="250" height="76" rx="6" {...bx} />
      <text x="300" y="474" {...T}>Meal and grocery APIs</text>
      <text x="300" y="491" {...S}>create or update plan JSON</text>
      <text x="300" y="505" {...S}>add groceries with dedupe</text>
      <rect x="592" y="450" width="220" height="76" rx="6" {...bx} />
      <text x="606" y="474" {...T}>mealplan</text>
      <text x="606" y="491" {...S}>mealplan_id, user_id</text>
      <text x="606" y="505" {...S}>plan JSONB by date</text>
      <rect x="862" y="450" width="220" height="76" rx="6" {...bx} />
      <text x="876" y="474" {...T}>grocery</text>
      <text x="876" y="491" {...S}>groceryid, user_id</text>
      <text x="876" y="505" {...S}>name, quantity, unit</text>
      <rect x="1136" y="452" width="188" height="72" rx="6" {...bx} />
      <text x="1150" y="476" {...T}>Weekly output</text>
      <text x="1150" y="493" {...S}>scheduled meals</text>
      <text x="1150" y="507" {...S}>grocery list</text>

      <rect x="16" y="574" width="220" height="76" rx="6" {...bx} />
      <text x="30" y="598" {...T}>For Your Taste</text>
      <text x="30" y="615" {...S}>share, like, comment</text>
      <text x="30" y="629" {...S}>browse social recipes</text>
      <rect x="286" y="566" width="250" height="92" rx="6" {...bx} />
      <text x="300" y="590" {...T}>Social API group</text>
      <text x="300" y="607" {...S}>posts, likes, votes</text>
      <text x="300" y="621" {...S}>comments and replies</text>
      <text x="300" y="635" {...S}>trending, search, hashtags</text>
      <rect x="592" y="574" width="220" height="76" rx="6" {...bx} />
      <text x="606" y="598" {...T}>social tables</text>
      <text x="606" y="615" {...S}>posts, comments</text>
      <text x="606" y="629" {...S}>liked_posts, post_votes</text>
      <rect x="862" y="574" width="220" height="76" rx="6" {...bx} />
      <text x="876" y="598" {...T}>votes and replies</text>
      <text x="876" y="615" {...S}>comment_votes</text>
      <text x="876" y="629" {...S}>parent_cid reply chain</text>
    </svg>
  );
}

/**
 * Decorative Event Compass mark: the project logo, slowly rotating. Purely
 * ornamental, hidden from assistive tech.
 */
export function CompassMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/compass.svg"
      alt=""
      aria-hidden="true"
      // object-contain keeps the 1085x1002 artwork centred in a square box, so
      // rotation stays on the compass rose rather than wobbling around it.
      className={`origin-center animate-spin object-contain [animation-duration:36s] motion-reduce:animate-none ${className}`}
    />
  );
}

/**
 * Decorative Pantry AI mark: the mascot, bobbing. It has a face, so it floats
 * rather than spins. Purely ornamental, hidden from assistive tech.
 */
export function PantryMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/PantryAI_LG.png"
      alt=""
      aria-hidden="true"
      className={`object-contain [animation:bob_5s_ease-in-out_infinite] motion-reduce:animate-none ${className}`}
    />
  );
}
