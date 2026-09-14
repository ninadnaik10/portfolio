"use client";

import type { Key } from "@heroui/react";

import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

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

/** Shared by the pre-hydration placeholder and the live control, so swapping
 *  between them causes no layout shift. */
const TRACK =
  "border-border/80 bg-surface relative flex shrink-0 rounded-lg border p-1";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  // The active theme is unknowable while prerendering, so hold the markup
  // steady until hydration rather than guessing and mismatching.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // Pre-hydration the selected theme is unknowable, but the control itself is
  // not — so render the real track and icons rather than an empty box. A blank
  // placeholder reads as "no theme toggle" for however long hydration takes,
  // which on a phone is long enough to notice and, if JS never runs, forever.
  // Dimensions match the live control exactly, so hydration causes no shift.
  if (!mounted) {
    return (
      <div aria-hidden className={TRACK}>
        {OPTIONS.map(({ Icon, id }) => (
          <span
            className="text-muted flex size-10 items-center justify-center sm:size-8"
            key={id}
          >
            <Icon className="size-[17px]" />
          </span>
        ))}
      </div>
    );
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
    // repaints nothing, so there is nothing to cross-fade.
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

    // Everything that actually changes the theme lives in this callback, so if
    // a browser accepts startViewTransition but never invokes it, the click
    // would silently do nothing. Guard with a one-shot fallback.
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      paintAppearance(appearance);
      setTheme(next);
    };

    const transition = document.startViewTransition(apply);
    window.setTimeout(apply, 300);

    // A transition aborts if the document is hidden, or if a second theme is
    // picked before the first fade finishes — both reject `ready` and
    // `finished`. The theme still applies either way, so swallow them rather
    // than let an expected abort surface as an unhandled rejection.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  };

  return (
    <div className={TRACK}>
      {/* The sliding thumb. Sits behind the buttons and animates on change. */}
      <span
        aria-hidden
        className="theme-thumb bg-background border-border/60 pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-md border shadow-sm"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
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
            className="text-muted data-[selected=true]:text-foreground size-10 rounded-md bg-transparent transition-colors data-[selected=true]:bg-transparent sm:size-8"
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
