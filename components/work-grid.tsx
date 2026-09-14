import { Card, Chip, Link } from "@heroui/react";

import { LogoAvatar } from "@/components/logo-avatar";

import { ArrowUpRightIcon, socialIcons } from "@/components/icons";
import { CardLink } from "@/components/card-link";
import { Section } from "@/components/section";
import type { Work } from "@/lib/content";

const GitHubIcon = socialIcons.github;

function WorkCard({ work }: { work: Work }) {
  // The card links to the live site when there is one, else the repo.
  const primary = work.url ?? work.repo;

  return (
    <Card
      className={`group hover:bg-surface-secondary relative flex h-full flex-col transition-colors ${
        work.featured ? "sm:col-span-2" : ""
      }`}
    >
      <Card.Header>
        <div className="flex items-start gap-3">
          <LogoAvatar
            alt={work.name}
            fallback={work.logoFallback}
            size="sm"
            src={work.logo}
          />
        <Card.Title className="flex flex-1 items-start justify-between gap-3 text-xl font-bold tracking-tight">
          {primary ? (
            /* `static` is load-bearing: HeroUI's .link sets position:relative,
               which would scope the after:inset-0 overlay to the title text
               instead of the whole card, leaving the card unclickable. */
            <Link
              className="text-foreground static no-underline after:absolute after:inset-0 hover:underline"
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
          {primary ? (
            <ArrowUpRightIcon className="text-muted group-hover:text-accent mt-1 size-4 shrink-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          ) : null}
        </Card.Title>
        </div>
        <Card.Description className="text-muted mt-2 leading-relaxed">
          {work.description}
        </Card.Description>
      </Card.Header>

      <Card.Footer className="mt-auto flex-col items-start gap-4 pt-2">
        {work.stack && work.stack.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {work.stack.map((tech) => (
              <li key={tech}>
                <Chip size="sm" variant="soft">
                  <Chip.Label>{tech}</Chip.Label>
                </Chip>
              </li>
            ))}
          </ul>
        ) : null}

        {(work.repo && work.url) || work.article ? (
          <div className="flex flex-wrap items-center gap-2">
            {work.repo && work.url ? (
              <CardLink href={work.repo} icon={GitHubIcon}>
                Source
              </CardLink>
            ) : null}
            {work.article ? (
              <CardLink href={work.article}>Blog</CardLink>
            ) : null}
          </div>
        ) : null}
      </Card.Footer>
    </Card>
  );
}

export function WorkCards({ items }: { items: Work[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((work) => (
        <WorkCard key={work.name} work={work} />
      ))}
    </div>
  );
}

export function WorkGrid({
  id,
  index,
  items,
  title,
}: {
  id: string;
  index: string;
  items: Work[];
  title: string;
}) {
  if (items.length === 0) return null;

  return (
    <Section id={id} index={index} title={title}>
      <WorkCards items={items} />
    </Section>
  );
}
