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
  tagline: string;
  location?: string;
  email?: string;
  photo?: string;
  initials?: string;
  resume?: string;
}

export interface Job {
  company: string;
  note?: string;
  url?: string;
  role: string;
  type?: string;
  start: string;
  end: string;
  location?: string;
  highlights: string[];
  stack?: string[];
}

export interface Work {
  name: string;
  date?: string;
  description: string;
  stack?: string[];
  url?: string;
  repo?: string;
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

export interface Role {
  title: string;
  org: string;
  url?: string;
  start: string;
  end: string;
}

export interface Award {
  title: string;
  detail: string;
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
  roles: Role[];
  recognition: Award[];
  footer?: { note?: string };
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
    experience: content.experience ?? [],
    projects: content.projects ?? [],
    open_source: {
      programs: content.open_source?.programs ?? [],
      contributions: content.open_source?.contributions ?? [],
    },
      skills: content.skills ?? [],
    education: content.education ?? [],
    roles: content.roles ?? [],
    recognition: content.recognition ?? [],
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
