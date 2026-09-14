"use client";

import { buttonVariants } from "@heroui/styles";
import { useRef, useState } from "react";

/** Collapsed height. Deep enough to show ~3 bullets plus a sliver of the next. */
const PEEK_REM = 11;

/**
 * Clips long card content to a peek, with the cut line blurred and faded so it
 * reads as "there is more" rather than as a hard crop.
 *
 * Every bullet is rendered by the server and merely clipped by CSS — nothing is
 * withheld from the markup, so crawlers and agents still get the full text.
 */
export function Expandable({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<string>(`${PEEK_REM}rem`);
  const clip = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const box = clip.current;
    const full = inner.current?.scrollHeight ?? 0;

    if (!open) {
      // `auto` is not interpolable, so expand to a measured pixel height.
      setHeight(`${full}px`);
      setOpen(true);
      return;
    }

    // Collapsing starts from `auto` (see settle), which has nothing to animate
    // from. Pin the current height straight onto the node and force a reflow so
    // the browser commits it as the transition's start value — React would
    // batch a state update into the same render and the transition would never
    // begin. A rAF would work too, but not while the tab is backgrounded.
    if (box) {
      box.style.height = `${box.getBoundingClientRect().height}px`;
      void box.offsetHeight;
    }
    setHeight(`${PEEK_REM}rem`);
    setOpen(false);
  };

  // Release the pin once expanded so the card can still reflow — on a resize,
  // or when a font finishes loading and the text rewraps taller than measured.
  const settle = (event: React.TransitionEvent<HTMLDivElement>) => {
    // transitionend bubbles — a chip's colour transition would otherwise
    // release the pin mid-flight and snap the card to full height.
    if (event.target !== clip.current || event.propertyName !== "height") return;
    if (open) setHeight("auto");
  };

  return (
    <div>
      <div
        className="relative overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        ref={clip}
        style={{ height }}
        onTransitionEnd={settle}
      >
        <div ref={inner}>{children}</div>
        {open ? null : <span aria-hidden className="card-peek-fade" />}
      </div>

      {/* A native <button> with onClick rather than HeroUI's <Button>, which
          routes through React Aria's press handling — that cancels a press if
          the finger drifts even slightly, which is easy to do on a phone.
          `buttonVariants()` gives the identical look. */}
      <button
        aria-expanded={open}
        className={`${buttonVariants({ size: "sm", variant: "secondary" })} mt-3`}
        type="button"
        onClick={toggle}
      >
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
