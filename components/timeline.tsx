import { Card, Chip, Link } from "@heroui/react";

import { CardLink } from "@/components/card-link";
import { LogoAvatar } from "@/components/logo-avatar";

import { Expandable } from "@/components/expandable";
import type { Job } from "@/lib/content";

/**
 * Long entries collapse. The threshold is on total characters rather than
 * bullet count, so three sprawling bullets collapse the same as nine terse
 * ones — it is card height we are managing, not list length.
 */
const COLLAPSE_OVER_CHARS = 900;
const PREVIEW_BULLETS = 3;

function Highlight({ highlight }: { highlight: string }) {
  return (
    <li className="text-muted relative pl-5 text-base leading-relaxed before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-current before:opacity-50">
      {highlight}
    </li>
  );
}

function TimelineItem({ item }: { item: Job }) {
  const total = item.highlights.join(" ").length;
  const collapses =
    total > COLLAPSE_OVER_CHARS && item.highlights.length > PREVIEW_BULLETS + 1;
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
          {collapses ? (
            <Expandable>
              <ul className="space-y-2.5">
                {item.highlights.map((highlight) => (
                  <Highlight highlight={highlight} key={highlight.slice(0, 40)} />
                ))}
              </ul>
            </Expandable>
          ) : (
            <ul className="space-y-2.5">
              {item.highlights.map((highlight) => (
                <Highlight highlight={highlight} key={highlight.slice(0, 40)} />
              ))}
            </ul>
          )}
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
              <CardLink href={item.article}>Blog</CardLink>
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
