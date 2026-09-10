"use client";

import type { Key } from "@heroui/react";

import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";

import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";

const OPTIONS = [
  { Icon: SunIcon, id: "light", label: "Light" },
  { Icon: MoonIcon, id: "dark", label: "Dark" },
  { Icon: MonitorIcon, id: "system", label: "System" },
] as const;

type ThemeName = (typeof OPTIONS)[number]["id"];

/** Never fires — the value flips once, when hydration swaps the snapshot. */
const noopSubscribe = () => () => {};

const FADE_MS = 280;

function prefers(query: string) {
  return window.matchMedia(query).matches;
}

function resolveAppearance(theme: ThemeName): "light" | "dark" {
  if (theme !== "system") return theme;
  return prefers("(prefers-color-scheme: dark)") ? "dark" : "light";
}

/**
 * next-themes applies the theme class from a passive effect, which lands after
 * startViewTransition() has already snapshotted the DOM. So the class flip has
 * to happen inside the transition callback ourselves; setTheme then re-applies
 * the identical class and persists to localStorage, with no visual change.
 */
function paintAppearance(appearance: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(appearance);
  root.style.colorScheme = appearance;
}

// Each button is 2rem wide inside a 0.25rem-padded track. Used both to place
// the sliding thumb and to locate a button's centre without a DOM lookup.
const BUTTON_PX = 32;
const TRACK_PAD_PX = 4;

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);

  // The active theme is unknowable while prerendering, so hold the markup
  // steady until hydration rather than guessing and mismatching.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div aria-hidden className="h-10 w-[6.5rem] shrink-0" />;
  }

  const current = (theme ?? "system") as ThemeName;
  const activeIndex = Math.max(
    0,
    OPTIONS.findIndex((option) => option.id === current),
  );

  const select = (keys: Set<Key>) => {
    const next = [...keys][0] as ThemeName | undefined;
    if (!next || next === current) return;

    const appearance = resolveAppearance(next);
    const root = document.documentElement;

    // Selecting "system" when it resolves to the appearance already on screen
    // repaints nothing, so there is nothing to reveal.
    const repaints = appearance !== resolvedTheme;

    if (!repaints || prefers("(prefers-reduced-motion: reduce)")) {
      setTheme(next);
      return;
    }

    if (typeof document.startViewTransition !== "function") {
      // Firefox and friends: brief colour cross-fade instead. Scoped in time
      // so it never leaves a global transition slowing down hover states.
      root.classList.add("theme-fade");
      window.setTimeout(
        () => root.classList.remove("theme-fade"),
        FADE_MS + 40,
      );
      setTheme(next);
      return;
    }

    // Expand the circle from the newly selected button to the furthest
    // viewport corner. The button's centre is derived from the track's box and
    // the option index, so no DOM id is needed on the ToggleButtons — their
    // `id` is the selection key and must stay equal to the theme name.
    const track = trackRef.current;
    if (track) {
      const box = track.getBoundingClientRect();
      const nextIndex = OPTIONS.findIndex((option) => option.id === next);
      const x =
        box.left + TRACK_PAD_PX + nextIndex * BUTTON_PX + BUTTON_PX / 2;
      const y = box.top + TRACK_PAD_PX + BUTTON_PX / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      root.style.setProperty("--theme-reveal-x", `${x}px`);
      root.style.setProperty("--theme-reveal-y", `${y}px`);
      root.style.setProperty("--theme-reveal-r", `${radius}px`);
    }

    document.startViewTransition(() => {
      paintAppearance(appearance);
      setTheme(next);
    });
  };

  return (
    <div
      className="border-border/80 bg-surface relative flex shrink-0 rounded-lg border p-1"
      ref={trackRef}
    >
      {/* The sliding thumb. Sits behind the buttons and animates on change. */}
      <span
        aria-hidden
        className="bg-background border-border/60 pointer-events-none absolute top-1 left-1 size-8 rounded-md border shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
        style={{ transform: `translateX(${activeIndex * BUTTON_PX}px)` }}
      />

      <ToggleButtonGroup
        disallowEmptySelection
        isDetached
        aria-label="Colour theme"
        className="relative gap-0"
        selectedKeys={[current]}
        selectionMode="single"
        size="sm"
        onSelectionChange={select}
      >
        {OPTIONS.map(({ Icon, id, label }) => (
          <ToggleButton
            isIconOnly
            aria-label={label}
            className="text-muted data-[selected=true]:text-foreground size-8 rounded-md bg-transparent transition-colors data-[selected=true]:bg-transparent"
            id={id}
            key={id}
          >
            <Icon className="size-[17px]" />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
