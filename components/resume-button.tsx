import { buttonVariants } from "@heroui/styles";

import { FileTextIcon } from "@/components/icons";

/**
 * A real <a> wearing HeroUI's button styling, rather than `<Button>`.
 *
 * Button is a React Aria press-handler with no `href`, so it would not
 * middle-click, open in a new tab, or expose link semantics to assistive tech.
 * `buttonVariants()` returns the same BEM classes the component uses, so this
 * looks identical while staying a genuine link.
 */
export function ResumeButton({
  className,
  href,
  size = "md",
}: {
  className?: string;
  href: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <a
      className={`${buttonVariants({ size, variant: "primary" })} ${className ?? ""}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FileTextIcon className={size === "sm" ? "size-4" : "size-[18px]"} />
      Resume
    </a>
  );
}
