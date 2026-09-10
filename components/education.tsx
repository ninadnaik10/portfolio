import { Link } from "@heroui/react";

import { Section } from "@/components/section";
import type { Degree, Role } from "@/lib/content";

export function Education({
  degrees,
  index,
  roles,
}: {
  degrees: Degree[];
  index: string;
  roles: Role[];
}) {
  if (degrees.length === 0 && roles.length === 0) return null;

  return (
    <Section id="education" index={index} title="Education">
      {degrees.map((degree) => (
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
          key={degree.degree}
        >
          <div className="min-w-0">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
              {degree.degree}
            </h3>
            <p className="text-muted mt-1.5 text-sm">
              {degree.institution}
              {degree.location ? (
                <>
                  <span className="text-separator mx-2">/</span>
                  {degree.location}
                </>
              ) : null}
            </p>
          </div>
          <div className="text-muted font-mono text-xs whitespace-nowrap sm:text-right">
            <p>
              {degree.start} — {degree.end}
            </p>
            {degree.detail ? (
              <p className="text-foreground mt-1 font-semibold">
                {degree.detail}
              </p>
            ) : null}
          </div>
        </div>
      ))}

      {roles.length > 0 ? (
        <div className={degrees.length > 0 ? "mt-14" : ""}>
          <h3 className="eyebrow">Roles of Responsibility</h3>
          <ul className="border-border/70 mt-5 divide-y">
            {roles.map((role) => (
              <li
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t py-4 first:border-t-0 first:pt-0"
                key={`${role.title}-${role.org}`}
              >
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight">{role.title}</p>
                  <p className="text-muted mt-0.5 text-sm">
                    {role.url ? (
                      <Link
                        href={role.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {role.org}
                      </Link>
                    ) : (
                      role.org
                    )}
                  </p>
                </div>
                <span className="text-muted font-mono text-xs whitespace-nowrap">
                  {role.start} — {role.end}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
