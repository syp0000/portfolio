import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BigDipper, CursorFollower, NcrSchematic, PantryJourney, StarField, type CursorKind } from "../components/Decor";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav, SiteFooter } from "../components/SiteChrome";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Siyeon Park, Software Engineer" },
      {
        name: "description",
        content:
          "Software engineer building production tooling for operational problems.",
      },
      { name: "author", content: "Siyeon Park" },
      { property: "og:title", content: "Siyeon Park, Software Engineer" },
      {
        property: "og:description",
        content:
          "Software engineer building production tooling for operational problems.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://portfolio-silk-gamma-tup092grmy.vercel.app/og.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://portfolio-silk-gamma-tup092grmy.vercel.app/og.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

type Look = {
  theme: string;
  cursor: CursorKind;
  stars?: boolean;
  dipper?: boolean;
  journey?: boolean;
  schematic?: boolean;
};

// Keyed by pathname with any trailing slash stripped, so home is "".
const ROUTE_LOOKS: Record<string, Look> = {
  "": { theme: "theme-shell", cursor: "star", stars: true },
  "/about": { theme: "theme-shell", cursor: "star", stars: true },
  "/resume": { theme: "theme-shell", cursor: "star", stars: true },
  "/work/event-compass": { theme: "theme-space", cursor: "star", stars: true, dipper: true },
  "/work/pantry-ai": { theme: "theme-pantry", cursor: "pantry", journey: true },
  "/work/ncr-assistant": { theme: "theme-ncr", cursor: "pencil", schematic: true },
};

const DEFAULT_LOOK: Look = ROUTE_LOOKS[""];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // Per-route palette and decor. Applied here rather than in the routes so nav
  // and footer inherit the palette, and server-rendered so there is no flash on
  // load. Unknown routes fall back so nothing lands on the bare :root palette.
  const look = useRouterState({
    select: (s) => ROUTE_LOOKS[s.location.pathname.replace(/\/$/, "")] ?? DEFAULT_LOOK,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`palette-shift flex min-h-screen flex-col bg-background ${look.theme}`}>
        {look.stars && <StarField />}
        <SiteNav />
        {/* z-10 lifts page content above the fixed starfield behind it. */}
        <main className="relative z-10 flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        {look.dipper && <BigDipper />}
        {look.journey && <PantryJourney />}
        {look.schematic && <NcrSchematic />}
        <CursorFollower kind={look.cursor} />
      </div>
    </QueryClientProvider>
  );

}
