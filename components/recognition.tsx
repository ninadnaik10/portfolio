import { Section } from "@/components/section";
import type { Award } from "@/lib/content";

export function Recognition({
  awards,
  index,
}: {
  awards: Award[];
  index: string;
}) {
  if (awards.length === 0) return null;

  return (
    <Section id="recognition" index={index} title="Recognition">
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {awards.map((award) => (
          <li className="border-accent border-l-2 pl-5" key={award.title}>
            <h3 className="font-bold tracking-tight text-pretty">
              {award.title}
            </h3>
            <p className="text-muted mt-1.5 text-sm leading-relaxed">
              {award.detail}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
