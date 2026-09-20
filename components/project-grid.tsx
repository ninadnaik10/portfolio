import { Card, Link, Separator } from "@heroui/react";
import Image from "next/image";

import { CardLink } from "@/components/card-link";
import { Carousel } from "@/components/carousel";
import { socialIcons } from "@/components/icons";
import { LogoAvatar } from "@/components/logo-avatar";
import { Section } from "@/components/section";
import type { Work } from "@/lib/content";

const GitHubIcon = socialIcons.github;

/**
 * Cover art, or a muted panel carrying the logo when there is no screenshot
 * yet. The slot always renders so every card in a row is the same height and
 * the grid does not reflow as screenshots get added one at a time.
 */
function Cover({ work }: { work: Work }) {
  return (
    <div className="border-border/60 bg-surface-secondary relative mb-5 aspect-video w-full overflow-hidden rounded-xl border">
      {work.cover ? (
        <Image
          alt={`${work.name} screenshot`}
          className="object-cover"
          fill
          // Card width minus the 3rem of card padding, per breakpoint below.
          sizes="(min-width: 1024px) 25rem, (min-width: 640px) 21rem, calc(100vw - 6rem)"
          src={work.cover}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <LogoAvatar
            alt={work.name}
            fallback={work.logoFallback}
            src={work.logo}
          />
        </div>
      )}
    </div>
  );
}

function ProjectCard({ work }: { work: Work }) {
  // The card links to the live site when there is one, else the repo.
  const primary = work.url ?? work.repo;

  return (
    <Card className="flex h-full flex-col">
      <Cover work={work} />

      <Card.Header>
        <Card.Title className="flex items-start justify-between gap-3 text-xl font-bold tracking-tight">
          {primary ? (
            <Link
              className="text-foreground no-underline hover:underline"
              href={primary}
              rel="noopener noreferrer"
              target="_blank"
            >
              {work.name}
            </Link>
          ) : (
            work.name
          )}
          {work.date ? (
            <span className="text-muted mt-1.5 shrink-0 font-mono text-xs font-normal whitespace-nowrap">
              {work.date}
            </span>
          ) : null}
        </Card.Title>
        <Card.Description className="text-muted mt-2 leading-relaxed">
          {work.description}
        </Card.Description>
      </Card.Header>

      <Card.Footer className="mt-auto flex-col items-stretch gap-4 pt-2">
        <Separator />

        <div className="flex flex-wrap items-center gap-2">
          {work.url ? <CardLink href={work.url}>View project</CardLink> : null}
          {work.repo ? (
            <CardLink href={work.repo} icon={GitHubIcon}>
              Source
            </CardLink>
          ) : null}
          {work.article ? <CardLink href={work.article}>Blog</CardLink> : null}
        </div>

        {work.stack && work.stack.length > 0 ? (
          <p className="text-muted text-xs leading-relaxed">
            {work.stack.join(" · ")}
          </p>
        ) : null}
      </Card.Footer>
    </Card>
  );
}

export function ProjectGrid({
  index,
  items,
}: {
  index: string;
  items: Work[];
}) {
  if (items.length === 0) return null;

  return (
    <Section id="projects" index={index} title="Projects">
      {/* Stacked on a phone, a horizontal strip from `sm` up: wider cards mean
          a legible screenshot, and the arrows page through them one card at a
          time. `featured` is ignored here on purpose — every card is the same
          width so the snap points stay even. */}
      <Carousel label="projects">
        {items.map((work) => (
          <li
            className="w-full shrink-0 sm:w-[24rem] sm:snap-start lg:w-[28rem]"
            data-carousel-item
            key={work.name}
          >
            <ProjectCard work={work} />
          </li>
        ))}
      </Carousel>
    </Section>
  );
}
