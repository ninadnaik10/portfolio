import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { WorkCards } from "@/components/work-grid";
import type { OpenSource as OpenSourceContent } from "@/lib/content";

export function OpenSource({
  content,
  index,
}: {
  content: OpenSourceContent;
  index: string;
}) {
  const { contributions, programs } = content;
  if (programs.length === 0 && contributions.length === 0) return null;

  return (
    <Section id="open-source" index={index} title="Open Source">
      <Timeline items={programs} />
      {contributions.length > 0 ? (
        <div className={programs.length > 0 ? "mt-4" : ""}>
          <WorkCards items={contributions} />
        </div>
      ) : null}
    </Section>
  );
}
