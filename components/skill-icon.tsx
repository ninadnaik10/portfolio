/**
 * Skill marks are CSS masks over files in /public/icons, not inline SVG.
 *
 * react-icons ships monochrome single-path shapes. Inlining the 27 of them
 * costs ~51KB of markup, doubled by the RSC payload, on a page whose readable
 * text is under 6KB. As a mask the file carries only the shape and the colour
 * comes from CSS — so one file works in both themes, which an <img> could not
 * do without baking a variant per theme.
 *
 * Regenerate the files with: node scripts/build-icons.mjs
 */

/** Display name -> icon basename. A name absent here renders a monogram. */
const ICONS: Record<string, string> = {
  aws: "aws",
  c: "c",
  "c++": "cpp",
  css: "css",
  docker: "docker",
  fastapi: "fastapi",
  go: "go",
  graphql: "graphql",
  html: "html",
  java: "java",
  javascript: "javascript",
  jwt: "jwt",
  kafka: "kafka",
  kubernetes: "kubernetes",
  linux: "linux",
  mcp: "mcp",
  mongodb: "mongodb",
  mysql: "mysql",
  nestjs: "nestjs",
  "node.js": "nodejs",
  "oauth2.0": "oauth",
  postgresql: "postgresql",
  python: "python",
  "react.js": "react",
  redis: "redis",
  "tailwind css": "tailwind",
  typescript: "typescript",
};

export function SkillIcon({ name }: { name: string }) {
  const icon = ICONS[name.toLowerCase()];

  if (!icon) {
    return (
      <span className="border-border/80 text-muted rounded border border-dashed px-1 font-mono text-[10px] leading-none font-semibold tracking-tight">
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4)}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="skill-mark"
      style={{ maskImage: `url(/icons/${icon}.svg)`, WebkitMaskImage: `url(/icons/${icon}.svg)` }}
    />
  );
}
