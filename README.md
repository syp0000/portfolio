# Siyeon Park — Portfolio

Personal portfolio with three case studies: **NCR Assistant** (a production reporting tool I shipped alone to a battery plant floor), **Event Compass** (the data and analytics layer of my senior capstone), and **PantryAI** (a pantry and meal-planning product built by a team of four).

**Live:** https://portfolio-silk-gamma-tup092grmy.vercel.app

## How it was built

1. **Prototyped in Lovable** (and Lovable driven from Claude) to get the structure, copy, and case-study content standing in hours instead of days.
2. **Downloaded the codebase** and did the real work in **Claude Code**: per-route theming, the scroll-driven illustrations, device frames, typography and contrast passes, and every correction since.
3. **Portrait video generated with Gemini** (disclosed on the About page). The product demo videos were recorded and edited by me.
4. **Deployed on Vercel**, auto-deploying from `main`.

### The Lovable tradeoff, honestly

Lovable got me from zero to a complete, deployed site remarkably fast — that speed is real and I would use it again for a first draft. The cost is the code it leaves behind: the generated codebase was tangled enough that I could not imagine retouching it by hand. The way out was working on it with Claude Code, which could hold the whole repo in its head and refactor with intent — shared components (`CaseStudy`, `Blocks`, `Frames`, `Decor`), one `ROUTE_LOOKS` map for per-route decoration, and design tokens that every page reads instead of scattered styles. Prototype fast, then make the code yours.

## Design notes

Each case study has its own palette and a scroll-driven illustration in the margin. They are decorative, but none of them are arbitrary.

### Event Compass — the Big Dipper

The project is called Event *Compass*, and the Big Dipper is how people have always found direction: follow the two pointer stars out of the bowl and they lead you to Polaris, the North Star. So the page is a night sky. As you scroll, the constellation lights up star by star — drawn with the real apparent magnitudes, so Megrez is faint and Alioth is bright, with Alcor riding beside Mizar — and at the end of the page the Pointers extend out to Polaris.

It is also personal. Every experience on this site is a star: individually small, together a shape that points somewhere. My career question is the same one the dipper answers — finding direction.

### PantryAI — ingredients become a meal

A soft S-curve of watercolor illustrations runs beside the copy. Dry spaghetti, canned tomatoes, garlic, and olive oil surface scattered as you scroll, drift together, become a plated meal — and then an empty plate, cutlery down. That arc *is* PantryAI's purpose: food gets used well instead of wasted. It is also just my daily routine — cook from what I have, eat, clean plate.

### NCR Assistant — a live circuit

The tool was built for the plant floor, so its page speaks the floor's language: a single vertical run of PLC ladder logic, drawn from the same diagrams I read at work. Scroll energizes the wire top to bottom, each contact closes as current reaches it, and the one labeled contact is `SYSTEM FAULT` — because every fault should leave a record.

### One system underneath

- Every route has its own palette, but they are all the same set of CSS tokens. The tokens are registered with `@property`, so navigating between pages interpolates the whole site's color through oklch instead of snapping.
- The scroll pieces share one mechanism: page scroll fraction drives opacity, position, and line drawing. No autoplay, no loops, reversible by scrolling back up.
- `prefers-reduced-motion` swaps choreography for static compositions.

## Stack

- [TanStack Start](https://tanstack.com/start) + React + TypeScript
- Tailwind CSS v4 (tokens via `@theme` / `@property`)
- Deployed on Vercel

## Running locally

```sh
npm install
npm run dev      # vite dev server
npm run build    # production build
```

## Structure

```
src/
  routes/            one file per page (TanStack file routing)
  components/
    CaseStudy.tsx    shared case-study layout (quick summary, marks, sections)
    Blocks.tsx       metric strips, figures, decision lists, screenshot slots
    Frames.tsx       browser/phone device frames, picked from image aspect
    Decor.tsx        starfield, Big Dipper, food journey, ladder circuit, cursors
  styles.css         design tokens, per-route palettes, palette transition
public/              logos, demo videos, journey illustrations
```
