import { buttonVariants } from "@heroui/styles";

import { ArrowUpRightIcon } from "@/components/icons";

/**
 * A card's footer action — Source, Blog, Certificate — using the same button
 * variant as "Read more", so every control on a card reads identically.
 *
 * A real <a> wearing HeroUI's button classes rather than `<Button>`: these
 * navigate, so they need an href, middle-click, "open in new tab" and link
 * semantics for assistive tech. `buttonVariants()` returns the same BEM classes
 * the component uses, so the two are visually identical.
 *
 * `relative z-10` is load-bearing on project cards: the whole card is covered
 * by a stretched-link overlay, and without it these would be unclickable.
 */
export function CardLink({
  children,
  external = true,
  href,
  icon: Icon,
}: {
  children: React.ReactNode;
  /** Internal anchors skip target/rel and the external-link arrow. */
  external?: boolean;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      className={`${buttonVariants({ size: "sm", variant: "secondary" })} relative z-10 gap-1.5`}
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
      {external ? <ArrowUpRightIcon className="size-3 opacity-70" /> : null}
    </a>
  );
}
