import { ScrollShadow } from "@heroui/react";

import { ThemeToggle } from "@/components/theme-toggle";
import type { Content } from "@/lib/content";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#open-source", label: "Open Source" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#recognition", label: "Recognition" },
];

const LINK =
  "text-muted hover:text-foreground hover:bg-surface rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors";

export function SiteHeader({ profile }: { profile: Content["profile"] }) {
  return (
    <header className="border-border/70 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-6">
        <a
          className="font-mono text-sm font-bold tracking-tight whitespace-nowrap"
          href="#top"
        >
          {profile.name}
        </a>

        {/* Seven links only fit beside the name on a wide desktop. */}
        <nav aria-label="Sections" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <a className={LINK} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          {profile.resume ? (
            <a
              className="border-border hover:border-foreground/40 hover:bg-surface hidden rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors sm:inline-block"
              href={profile.resume}
              rel="noopener noreferrer"
              target="_blank"
            >
              Resume
            </a>
          ) : null}
          <ThemeToggle />
        </div>
      </div>

      {/* Below xl the same links become a second row that scrolls sideways.
          Only one of the two navs is ever in the accessibility tree, since the
          other is display:none at any given width. */}
      <nav
        aria-label="Sections"
        className="border-border/70 border-t xl:hidden"
      >
        <ScrollShadow
          hideScrollBar
          className="mx-auto w-full max-w-5xl px-6"
          orientation="horizontal"
          size={28}
        >
          <ul className="flex items-center gap-0.5 py-1.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <a className={LINK} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </ScrollShadow>
      </nav>
    </header>
  );
}
