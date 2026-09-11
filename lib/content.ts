import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { load } from "js-yaml";

export type SocialIcon =
  | "github"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "mail"
  | "globe"
  | "rss";

export interface Social {
  label: string;
  icon: SocialIcon;
  url: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline?: string;
  location?: string;
  email?: string;
  photo?: string;
  initials?: string;
  resume?: string;
}

export interface Job {
  company: string;
  /** Path under public/, e.g. /logos/commotion.png. */
  logo?: string;
  /** Initials shown while no logo file exists. Set by the loader. */
  logoFallback?: string;
  note?: string;
  url?: string;
  role: string;
  type?: string;
  start: string;
  end: string;
  location?: string;
  highlights: string[];
  stack?: string[];
  /** Optional write-up about this work. */
  article?: string;
}

export interface Work {
  name: string;
  /** Path under public/, e.g. /logos/redspot.png. */
  logo?: string;
  /** Initials shown while no logo file exists. Set by the loader. */
  logoFallback?: string;
  date?: string;
  description: string;
  stack?: string[];
  url?: string;
  repo?: string;
  /** Optional write-up about this work. */
  article?: string;
  featured?: boolean;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Degree {
  degree: string;
  institution: string;
  location?: string;
  start: string;
  end: string;
  detail?: string;
}

export interface Paper {
  title: string;
  authors?: string;
  venue?: string;
  date?: string;
  status?: string;
  summary?: string;
  url?: string;
  /** Text for the link, e.g. "Certificate", "DOI", "PDF". */
  url_label?: string;
  /** Name of a related entry in `projects`, shown as a cross-reference. */
  project?: string;
}

export interface OpenSource {
  programs: Job[];
  contributions: Work[];
}

export interface Content {
  profile: Profile;
  about: string[];
  socials: Social[];
  experience: Job[];
  projects: Work[];
  open_source: OpenSource;
  skills: SkillGroup[];
  education: Degree[];
  research: Paper[];
  footer?: { note?: string };
}

/** Up to two initials, e.g. "Arxena Inc." -> "AI", "Commotion" -> "C". */
function initialsOf(label: string): string {
  return (
    label
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("") || "?"
  );
}

/**
 * A path that is not actually in public/ would prerender a broken <img>, so
 * drop it and let the initials fallback render server-side instead. The slot
 * itself is kept — declaring `logo:` in YAML is what asks for the avatar.
 */
function attachLogo<T extends { logo?: string }>(item: T, label: string): T {
  if (!item.logo) return item;

  const exists = existsSync(join(process.cwd(), "public", item.logo));
  if (!exists) {
    console.warn(
      `[content] logo "${item.logo}" not found in public/ — showing initials for "${label}".`,
    );
  }
  return { ...item, logo: exists ? item.logo : undefined, logoFallback: initialsOf(label) };
}

/**
 * Read at module scope so it runs once during the static build. The `content/`
 * directory is not traced into the serverless bundle, which is fine — every
 * page that uses this is prerendered to HTML at build time.
 */
function loadContent(): Content {
  const file = join(process.cwd(), "content", "portfolio.yaml");

  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    throw new Error(`Could not read ${file}. Portfolio content is required.`);
  }

  const parsed = load(raw);
  if (parsed === null || typeof parsed !== "object") {
    throw new Error("content/portfolio.yaml did not parse to an object.");
  }

  const content = parsed as Partial<Content>;

  // Fail the build loudly rather than shipping a page with empty sections.
  if (!content.profile?.name) {
    throw new Error("content/portfolio.yaml is missing `profile.name`.");
  }

  // A photo path that isn't actually in public/ would prerender a broken
  // <img> into the static HTML. Drop it so the initials fallback renders
  // server-side instead of only after the client hits the load error.
  const profile = { ...content.profile };
  if (
    profile.photo?.startsWith("/") &&
    !existsSync(join(process.cwd(), "public", profile.photo))
  ) {
    console.warn(
      `[content] profile.photo "${profile.photo}" not found in public/ — falling back to initials.`,
    );
    delete profile.photo;
  }

  return {
    profile,
    about: content.about ?? [],
    socials: content.socials ?? [],
    experience: (content.experience ?? []).map((job) =>
      attachLogo(job, job.company),
    ),
    projects: (content.projects ?? []).map((work) =>
      attachLogo(work, work.name),
    ),
    open_source: {
      programs: (content.open_source?.programs ?? []).map((job) =>
        attachLogo(job, job.company),
      ),
      contributions: (content.open_source?.contributions ?? []).map((work) =>
        attachLogo(work, work.name),
      ),
    },
      skills: content.skills ?? [],
    education: content.education ?? [],
    research: content.research ?? [],
    footer: content.footer,
  };
}

let cached: Content | null = null;

/**
 * The YAML is not a module dependency, so a module-scope `loadContent()` would
 * be cached for the life of the dev server and never notice edits to
 * content/portfolio.yaml. Cache in production (where this runs once, at build
 * time) and re-read on every render in development.
 */
export function getContent(): Content {
  if (process.env.NODE_ENV === "development") return loadContent();
  cached ??= loadContent();
  return cached;
}
