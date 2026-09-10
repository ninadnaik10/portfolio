import { Chip, Link } from "@heroui/react";

import type { Job } from "@/lib/content";

function TimelineItem({ item }: { item: Job }) {
  return (
    <li className="group relative pb-12 pl-8 last:pb-0">
      {/* Spine + node. */}
      <span
        aria-hidden
        className="bg-border absolute top-2 bottom-0 left-0 w-px group-last:hidden"
      />
      <span
        aria-hidden
        className="border-background bg-accent absolute top-1.5 left-0 size-3 -translate-x-1/2 rounded-full border-2"
      />

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
          {item.role}
        </h3>
        <span className="text-muted font-mono text-xs whitespace-nowrap">
          {item.start} — {item.end}
        </span>
      </div>

      <p className="text-muted mt-1.5 flex flex-wrap items-center gap-x-2 text-sm">
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
          <span className="text-foreground font-semibold">{item.company}</span>
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
      </p>

      <ul className="mt-4 space-y-2.5">
        {item.highlights.map((highlight) => (
          <li
            className="text-muted relative pl-5 text-base leading-relaxed before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-current before:opacity-50"
            key={highlight.slice(0, 40)}
          >
            {highlight}
          </li>
        ))}
      </ul>

      {item.stack && item.stack.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {item.stack.map((tech) => (
            <li key={tech}>
              <Chip size="sm" variant="soft">
                <Chip.Label>{tech}</Chip.Label>
              </Chip>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Timeline({ items }: { items: Job[] }) {
  if (items.length === 0) return null;

  return (
    <ol className="mt-2">
      {items.map((item) => (
        <TimelineItem
          item={item}
          key={`${item.company}-${item.role}-${item.start}`}
        />
      ))}
    </ol>
  );
}
