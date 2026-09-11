/**
 * Skill icons are referenced as files in /public/icons, not inlined.
 *
 * Inlining put ~118KB of path data into a page whose readable text is under
 * 6KB — and the App Router's RSC payload duplicates the markup, so every byte
 * of SVG was paid for twice. Anything consuming the page as text (crawlers,
 * agents, `curl`) had to wade through it. As <img> files they are fetched by
 * browsers only, and cached.
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
  grpc: "grpc",
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

/**
 * Icons that ship a file per theme. Either the artwork would disappear against
 * one background (svgl's Light/Dark pairs), or it is a monochrome mark whose
 * ink had to be baked in — an external <img> cannot inherit `currentColor`.
 */
const THEMED = new Set([
  "aws",
  "grpc",
  "kafka",
  "mcp",
  "mongodb",
  "mysql",
  "oauth",
  "react",
]);

export function SkillIcon({ name }: { name: string }) {
  const icon = ICONS[name.toLowerCase()];

  if (!icon) {
    return (
      <span className="border-border/80 text-muted rounded border border-dashed px-1 font-mono text-[10px] leading-none font-semibold tracking-tight">
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4)}
      </span>
    );
  }

  // Decorative: each tile already carries the name as text underneath.
  const common = "size-full object-contain";

  if (!THEMED.has(icon)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- see file header
      <img alt="" aria-hidden className={common} src={`/icons/${icon}.svg`} />
    );
  }

  return (
    <>
      {/* eslint-disable @next/next/no-img-element -- see file header */}
      <img
        alt=""
        aria-hidden
        className={`${common} dark:hidden`}
        src={`/icons/${icon}-light.svg`}
      />
      <img
        alt=""
        aria-hidden
        className={`hidden ${common} dark:block`}
        src={`/icons/${icon}-dark.svg`}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </>
  );
}
