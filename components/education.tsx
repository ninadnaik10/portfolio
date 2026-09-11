import { Card } from "@heroui/react";

import { Section } from "@/components/section";
import type { Degree } from "@/lib/content";

export function Education({
  degrees,
  index,
}: {
  degrees: Degree[];
  index: string;
}) {
  if (degrees.length === 0) return null;

  return (
    <Section id="education" index={index} title="Education">
      <ul className="space-y-4">
        {degrees.map((degree) => (
          <li key={degree.degree}>
            <Card>
              <Card.Header>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <Card.Title className="text-xl font-bold tracking-tight sm:text-2xl">
                    {degree.degree}
                  </Card.Title>
                  <span className="text-muted font-mono text-xs whitespace-nowrap">
                    {degree.start} — {degree.end}
                  </span>
                </div>
                <Card.Description className="text-muted mt-1.5 text-sm">
                  {degree.institution}
                  {degree.location ? (
                    <>
                      <span className="text-separator mx-2">/</span>
                      {degree.location}
                    </>
                  ) : null}
                  {degree.detail ? (
                    <>
                      <span className="text-separator mx-2">/</span>
                      <span className="text-foreground font-semibold">
                        {degree.detail}
                      </span>
                    </>
                  ) : null}
                </Card.Description>
              </Card.Header>
            </Card>
          </li>
        ))}
      </ul>

    </Section>
  );
}
