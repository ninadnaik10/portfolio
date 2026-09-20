"use client";

import { Button, ScrollShadow } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/**
 * A horizontal strip of cards with prev/next arrows.
 *
 * `children` are rendered by the server and passed straight through, so the
 * cards themselves never ship to the client — only this shell is interactive.
 * Each child is expected to be an <li> carrying `data-carousel-item`, which is
 * what a step measures to land on the next snap point.
 */
export function Carousel({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    // Fractional layout means scrollLeft lands a hair short of the maximum, so
    // an exact comparison would leave the right arrow enabled at the very end.
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    sync();

    el.addEventListener("scroll", sync, { passive: true });
    // Covers viewport resizes, breakpoint changes and covers loading in — all
    // of which change scrollWidth without firing a scroll event.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);

    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>("[data-carousel-item]");
    const list = item?.parentElement;
    const gap = list ? parseFloat(getComputedStyle(list).columnGap) || 0 : 0;
    // One card per press, so every stop is a snap point at any breakpoint.
    const amount = item
      ? item.getBoundingClientRect().width + gap
      : el.clientWidth * 0.9;
    el.scrollBy({ behavior: "smooth", left: direction * amount });
  };

  return (
    <div>
      {/* Below `sm` the cards stack vertically, so there is nothing to page. */}
      <div className="mb-4 hidden justify-end gap-2 sm:flex">
        <Button
          aria-label={`Scroll ${label} left`}
          isDisabled={!canScrollLeft}
          isIconOnly
          onPress={() => step(-1)}
          size="sm"
          variant="secondary"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          aria-label={`Scroll ${label} right`}
          isDisabled={!canScrollRight}
          isIconOnly
          onPress={() => step(1)}
          size="sm"
          variant="secondary"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <ScrollShadow
        className="sm:snap-x sm:snap-mandatory"
        hideScrollBar
        orientation="horizontal"
        ref={scroller}
      >
        {/* pb-1 keeps the cards' focus ring from being clipped by overflow. */}
        <ul className="flex flex-col gap-4 pb-1 sm:flex-row">{children}</ul>
      </ScrollShadow>
    </div>
  );
}
