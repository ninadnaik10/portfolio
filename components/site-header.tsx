import { ScrollShadow } from "@heroui/react";
import Image from "next/image";

import { ResumeButton } from "@/components/resume-button";
import { SiteNavList } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Content } from "@/lib/content";

export function SiteHeader({ profile }: { profile: Content["profile"] }) {
  return (
    <header className="border-border/70 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-6">
        {/* The wordmark ships in two colourways; only one is ever in the
            accessibility tree, so the alt text is not announced twice. */}
        <a className="press-scale min-w-0 shrink" href="#top">
          <Image
            priority
            alt={profile.name}
            className="h-4 w-auto max-w-full object-contain object-left sm:h-5 dark:hidden"
            height={325}
            src="/logo.png"
            width={2809}
          />
          <Image
            priority
            alt={profile.name}
            aria-hidden
            className="hidden h-4 w-auto max-w-full object-contain object-left sm:h-5 dark:block"
            height={325}
            src="/logo-white.png"
            width={2809}
          />
        </a>

        {/* Seven links only fit beside the name on a wide desktop. */}
        <nav aria-label="Sections" className="ml-auto hidden xl:block">
          <SiteNavList className="flex items-center gap-0.5" />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">
          {profile.resume ? (
            <ResumeButton href={profile.resume} size="sm" />
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
          <SiteNavList className="flex items-center gap-0.5 py-1.5" />
        </ScrollShadow>
      </nav>
    </header>
  );
}
