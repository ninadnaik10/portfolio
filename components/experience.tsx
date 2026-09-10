import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import type { Job } from "@/lib/content";

export function Experience({ index, jobs }: { index: string; jobs: Job[] }) {
  if (jobs.length === 0) return null;

  return (
    <Section id="experience" index={index} title="Experience">
      <Timeline items={jobs} />
    </Section>
  );
}
