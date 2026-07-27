import { Link } from "@tanstack/react-router";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

const links = [
  { to: "/work/ncr-assistant", label: "NCR Assistant" },
  { to: "/work/event-compass", label: "Event Compass" },
  { to: "/work/pantry-ai", label: "Pantry AI" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-8"
      >
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" className="min-w-0 shrink-0 text-[0.95rem] font-semibold tracking-tight">
            Siyeon Park
          </Link>
          <span className="hidden meta-row lg:inline">Software Engineer</span>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/resume"
            className="whitespace-nowrap rounded-md border border-foreground/20 px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Resume
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="justify-self-end rounded-md border border-hairline p-2 md:hidden"
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-hairline px-5 py-3 md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.to} className="border-b border-hairline last:border-0">
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-muted-foreground"
                  activeProps={{ className: "text-foreground font-medium" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link to="/resume" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-accent">
                Resume
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    // relative z-10 keeps the footer above the Event Compass starfield.
    <footer className="relative z-10 border-t border-hairline">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight">
            Open to new grad software engineering and forward deployed roles.
          </p>


          <a
            href="mailto:siyeon3934@gmail.com"
            className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            siyeon3934@gmail.com
          </a>
        </div>
        <ul className="flex flex-col gap-2 text-sm md:items-end">
          <li>
            <a
              className="text-muted-foreground transition-colors hover:text-accent"
              href="https://github.com/syp0000"
              target="_blank"
              rel="noreferrer"
            >
              github.com/syp0000
            </a>
          </li>
          <li>
            <a
              className="text-muted-foreground transition-colors hover:text-accent"
              href="https://linkedin.com/in/siyeon-park-714215276"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/siyeon-park-714215276
            </a>
          </li>
          <li>
            <Link className="text-muted-foreground transition-colors hover:text-accent" to="/resume">
              Resume, PDF
            </Link>
          </li>
          <li className="meta-row pt-4">Siyeon Park, 2026</li>
        </ul>
      </div>
    </footer>
  );
}
