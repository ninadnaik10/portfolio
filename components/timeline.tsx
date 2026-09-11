import { Card, Chip, Link } from "@heroui/react";

import { ArrowUpRightIcon } from "@/components/icons";
import { LogoAvatar } from "@/components/logo-avatar";

import type { Job } from "@/lib/content";

function TimelineItem({ item }: { item: Job }) {
  return (
    <li>
      <Card>
        <Card.Header className="flex-row items-start gap-4">
          <LogoAvatar
            alt={item.company}
            fallback={item.logoFallback}
            src={item.logo}
          />
          <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <Card.Title className="text-xl font-bold tracking-tight sm:text-2xl">
              {item.role}
            </Card.Title>
            <span className="text-muted font-mono text-xs whitespace-nowrap">
              {item.start} — {item.end}
            </span>
          </div>
          <Card.Description className="text-muted mt-1.5 flex flex-wrap items-center gap-x-2 text-sm">
            {item.url ? (
              <Link
                className="text-foreground font-semibold"
                href={item.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.company}
              </Link>
            ) : (
              <span className="text-foreground font-semibold">
                {item.company}
              </span>
            )}
            {item.note ? <span className="italic">({item.note})</span> : null}
            {item.type ? (
              <>
                <span className="text-separator">/</span>
                <span>{item.type}</span>
              </>
            ) : null}
            {item.location ? (
              <>
                <span className="text-separator">/</span>
                <span>{item.location}</span>
              </>
            ) : null}
          </Card.Description>
          </div>
        </Card.Header>

        <Card.Content>
          <ul className="space-y-2.5">
            {item.highlights.map((highlight) => (
              <li
                className="text-muted relative pl-5 text-base leading-relaxed before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-current before:opacity-50"
                key={highlight.slice(0, 40)}
              >
                {highlight}
              </li>
            ))}
          </ul>
        </Card.Content>

        {(item.stack && item.stack.length > 0) || item.article ? (
          <Card.Footer className="flex-col items-start gap-4">
            {item.stack && item.stack.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {item.stack.map((tech) => (
                  <li key={tech}>
                    <Chip size="sm" variant="soft">
                      <Chip.Label>{tech}</Chip.Label>
                    </Chip>
                  </li>
                ))}
              </ul>
            ) : null}
            {item.article ? (
              <Link
                className="text-muted hover:text-foreground inline-flex items-center gap-1 text-xs font-medium no-underline"
                href={item.article}
                rel="noopener noreferrer"
                target="_blank"
              >
                Blog
                <ArrowUpRightIcon className="size-3" />
              </Link>
            ) : null}
          </Card.Footer>
        ) : null}
      </Card>
    </li>
  );
}

export function Timeline({ items }: { items: Job[] }) {
  if (items.length === 0) return null;

  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <TimelineItem
          item={item}
          key={`${item.company}-${item.role}-${item.start}`}
        />
      ))}
    </ol>
  );
}
