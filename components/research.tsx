import { Card, Link } from "@heroui/react";

import { ArrowUpRightIcon } from "@/components/icons";
import { Section } from "@/components/section";
import type { Paper } from "@/lib/content";

export function Research({
  index,
  papers,
}: {
  index: string;
  papers: Paper[];
}) {
  if (papers.length === 0) return null;

  return (
    <Section id="research" index={index} title="Research">
      <ul className="space-y-4">
        {papers.map((paper) => (
          <li key={paper.title}>
            <Card>
              <Card.Header>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Card.Title className="text-xl font-bold tracking-tight text-pretty sm:text-2xl">
                    {paper.title}
                  </Card.Title>
                  {paper.date ? (
                    <span className="text-muted font-mono text-xs whitespace-nowrap">
                      {paper.date}
                    </span>
                  ) : null}
                </div>
                <Card.Description className="text-muted mt-1.5 flex flex-wrap items-center gap-x-2 text-sm">
                  {paper.authors ? (
                    <span className="text-foreground font-semibold">
                      {paper.authors}
                    </span>
                  ) : null}
                  {paper.venue ? (
                    <>
                      {paper.authors ? (
                        <span className="text-separator">/</span>
                      ) : null}
                      <span>{paper.venue}</span>
                    </>
                  ) : null}
                </Card.Description>
              </Card.Header>

              {paper.summary ? (
                <Card.Content>
                  <p className="text-muted text-base leading-relaxed">
                    {paper.summary}
                  </p>
                </Card.Content>
              ) : null}

              <Card.Footer className="flex-col items-start gap-4">
                {paper.status ? (
                  <p className="text-muted text-sm leading-relaxed">
                    {paper.status}
                  </p>
                ) : null}
                <div className="text-muted flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
                  {paper.url ? (
                    <Link
                      className="text-muted hover:text-foreground inline-flex items-center gap-1 no-underline transition-colors"
                      href={paper.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {paper.url_label ?? "Read the paper"}
                      <ArrowUpRightIcon className="size-3" />
                    </Link>
                  ) : null}
                  {paper.project ? (
                    <Link
                      className="text-muted hover:text-foreground no-underline transition-colors"
                      href="#projects"
                    >
                      Built as {paper.project}
                    </Link>
                  ) : null}
                </div>
              </Card.Footer>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
