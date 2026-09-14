"use client";

import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#open-source", label: "Open Source" },
  { href: "#projects", label: "Projects" },
  { href: "#research", label: "Research" },
  { href: "#skills", label: "Skills" },
] as const;

const LINK =
  "nav-link press-scale text-muted hover:text-foreground hover:bg-surface data-[active=true]:text-foreground relative rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap";

const SECTION_IDS = NAV.map((item) => item.href.slice(1));

function sectionFromHash() {
  const id = window.location.hash.slice(1);
  return SECTION_IDS.includes(id) ? id : null;
}

export function SiteNavList({ className }: { className: string }) {
  const [active, setActive] = useState("about");
  const locked = useRef(false);
  const unlockTimer = useRef(0);
  const lock = useRef(() => {});

  useEffect(() => {
    const elements = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();

    const unlock = () => {
      locked.current = false;
      window.clearTimeout(unlockTimer.current);
      window.removeEventListener("scrollend", unlock);
    };

    lock.current = () => {
      locked.current = true;
      window.clearTimeout(unlockTimer.current);
      window.addEventListener("scrollend", unlock, { once: true });
      unlockTimer.current = window.setTimeout(unlock, 1000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting);
        }
        if (locked.current) return;
        const next = SECTION_IDS.find((id) => visible.get(id));
        if (next) setActive(next);
      },
      {
        rootMargin: "-128px 0px -50% 0px",
        threshold: 0,
      },
    );

    const onHash = () => {
      const id = sectionFromHash();
      if (!id) return;
      setActive(id);
      lock.current();
    };

    for (const el of elements) observer.observe(el);
    window.addEventListener("hashchange", onHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
      unlock();
    };
  }, []);

  return (
    <ul className={className}>
      {NAV.map((item) => {
        const id = item.href.slice(1);
        const isActive = active === id;

        return (
          <li key={item.href}>
            <a
              aria-current={isActive ? "location" : undefined}
              className={LINK}
              data-active={isActive}
              href={item.href}
              onClick={() => {
                setActive(id);
                lock.current();
              }}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
