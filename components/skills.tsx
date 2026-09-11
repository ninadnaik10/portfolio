import { Section } from "@/components/section";
import { SkillIcon } from "@/components/skill-icon";
import type { SkillGroup } from "@/lib/content";

export function Skills({
  groups,
  index,
}: {
  groups: SkillGroup[];
  index: string;
}) {
  if (groups.length === 0) return null;

  return (
    <Section id="skills" index={index} title="Skills">
      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.group}>
            <h3 className="eyebrow">{group.group}</h3>
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
              {group.items.map((name) => (
                <li
                  className="skill-tile border-border/70 hover:border-foreground/30 hover:bg-surface flex flex-col items-center gap-2.5 rounded-lg border px-2 py-4 text-center transition-colors"
                  key={name}
                >
                  {/* svgl logos render at width/height 100%, so the box sizes
                      them. max-w keeps a wide wordmark from stretching. */}
                  <span className="skill-logo flex h-8 w-full items-center justify-center [&_img]:h-full [&_img]:w-auto [&_img]:max-w-full [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full">
                    <SkillIcon name={name} />
                  </span>
                  <span className="text-xs leading-tight font-medium">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
