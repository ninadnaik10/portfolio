import { getContent } from "@/lib/content";

/**
 * Emits /llms.txt at build time from the same YAML the page renders, so the
 * two can never drift. `force-static` makes this a prerendered file rather
 * than a request-time handler — it appears in the build output as a static
 * route and is served straight from the CDN.
 */
export const dynamic = "force-static";

const SITE = "https://ninadnaik.me";

/** Collapse the YAML's folded scalars into one clean line. */
function line(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function buildLlmsTxt(): string {
  const {
    about,
    education,
    experience,
    open_source,
    profile,
    projects,
    research,
    skills,
    socials,
  } = getContent();

  const out: string[] = [];

  out.push(`# ${profile.name}`);
  out.push("");
  out.push(
    `> ${line(
      `${profile.role}${profile.location ? ` based in ${profile.location}` : ""}. ${about[0] ?? ""}`,
    )}`,
  );
  out.push("");

  if (about.length > 1) {
    for (const paragraph of about.slice(1)) out.push(line(paragraph));
    out.push("");
  }

  if (experience.length > 0) {
    out.push("## Experience");
    out.push("");
    for (const job of experience) {
      const org = job.url ? `[${job.company}](${job.url})` : job.company;
      out.push(
        `- **${job.role}** — ${org}${job.note ? ` (${job.note})` : ""}, ${job.start} – ${job.end}${job.location ? `, ${job.location}` : ""}`,
      );
      for (const highlight of job.highlights) out.push(`  - ${line(highlight)}`);
      if (job.stack?.length) out.push(`  - Stack: ${job.stack.join(", ")}`);
    }
    out.push("");
  }

  if (education.length > 0) {
    out.push("## Education");
    out.push("");
    for (const degree of education) {
      out.push(
        `- **${degree.degree}** — ${degree.institution}, ${degree.start} – ${degree.end}${degree.detail ? ` (${degree.detail})` : ""}`,
      );
    }
    out.push("");
  }

  if (open_source.programs.length > 0 || open_source.contributions.length > 0) {
    out.push("## Open source");
    out.push("");
    for (const program of open_source.programs) {
      const org = program.url
        ? `[${program.company}](${program.url})`
        : program.company;
      out.push(
        `- **${program.role}** — ${org}, ${program.start} – ${program.end}`,
      );
      for (const highlight of program.highlights)
        out.push(`  - ${line(highlight)}`);
    }
    for (const work of open_source.contributions) {
      const href = work.url ?? work.repo;
      out.push(
        `- ${href ? `[${work.name}](${href})` : work.name}: ${line(work.description)}`,
      );
    }
    out.push("");
  }

  if (projects.length > 0) {
    out.push("## Projects");
    out.push("");
    for (const work of projects) {
      const href = work.url ?? work.repo;
      out.push(
        `- ${href ? `[${work.name}](${href})` : work.name}${work.date ? ` (${work.date})` : ""}: ${line(work.description)}`,
      );
      if (work.stack?.length) out.push(`  - Stack: ${work.stack.join(", ")}`);
      if (work.repo && work.url) out.push(`  - Source: ${work.repo}`);
    }
    out.push("");
  }

  if (research.length > 0) {
    out.push("## Research");
    out.push("");
    for (const paper of research) {
      out.push(
        `- **${paper.title}**${paper.authors ? ` — ${paper.authors}` : ""}${paper.venue ? `, ${paper.venue}` : ""}`,
      );
      if (paper.status) out.push(`  - ${line(paper.status)}`);
      if (paper.summary) out.push(`  - ${line(paper.summary)}`);
      if (paper.url) out.push(`  - ${paper.url_label ?? "Link"}: ${paper.url}`);
    }
    out.push("");
  }

  if (skills.length > 0) {
    out.push("## Skills");
    out.push("");
    for (const group of skills) {
      out.push(`- **${group.group}**: ${group.items.join(", ")}`);
    }
    out.push("");
  }

  if (socials.length > 0) {
    out.push("## Links");
    out.push("");
    out.push(`- [Portfolio](${SITE})`);
    if (profile.resume) out.push(`- [Résumé](${profile.resume})`);
    for (const social of socials) {
      out.push(`- [${social.label}](${social.url})`);
    }
    out.push("");
  }

  return out.join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
