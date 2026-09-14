import { Link } from "@heroui/react";

import { socialIcons } from "@/components/icons";
import type { Social } from "@/lib/content";

export function SocialLinks({
  className,
  size = "md",
  socials,
}: {
  className?: string;
  size?: "sm" | "md";
  socials: Social[];
}) {
  if (socials.length === 0) return null;

  const box = size === "sm" ? "size-9" : "size-11";
  const glyph = size === "sm" ? "size-[17px]" : "size-5";

  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className ?? ""}`}>
      {socials.map((social) => {
        const Icon = socialIcons[social.icon] ?? socialIcons.globe;
        const external = !social.url.startsWith("mailto:");

        return (
          <li key={social.url}>
            <Link
              aria-label={social.label}
              className={`${box} press-scale text-muted hover:text-foreground hover:border-foreground/25 hover:bg-surface flex items-center justify-center rounded-md border border-transparent no-underline`}
              href={social.url}
              rel={external ? "noopener noreferrer me" : undefined}
              target={external ? "_blank" : undefined}
            >
              <Icon className={glyph} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
