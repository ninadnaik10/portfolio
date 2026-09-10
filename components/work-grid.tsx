import { Card, Chip, Link } from "@heroui/react";

import { ArrowUpRightIcon, socialIcons } from "@/components/icons";
import { Section } from "@/components/section";
import type { Work } from "@/lib/content";

const GitHubIcon = socialIcons.github;

function WorkCard({ work }: { work: Work }) {
  // The card links to the live site when there is one, else the repo.
  const primary = work.url ?? work.repo;

  return (
    <Card
      className={`group border-border hover:border-foreground/30 relative flex h-full flex-col border transition-colors ${
        work.featured ? "sm:col-span-2" : ""
      }`}
      variant="transparent"
    >
      <Card.Header>
        <Card.Title className="flex items-start justify-between gap-3 text-xl font-bold tracking-tight">
          {primary ? (
            <Link
              className="text-foreground no-underline after:absolute after:inset-0 hover:underline"
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

        {/* Sits above the card-wide overlay link so it stays clickable. */}
        {work.repo && work.url ? (
          <Link
            aria-label={`${work.name} source on GitHub`}
            className="text-muted hover:text-foreground relative z-10 inline-flex items-center gap-1.5 text-xs font-medium no-underline"
            href={work.repo}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon className="size-3.5" />
            Source
          </Link>
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
