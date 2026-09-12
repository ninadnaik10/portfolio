/**
 * Renders every skill icon to a standalone file in public/icons/.
 *
 * Shapes come from react-icons, which bundles Simple Icons (brand marks),
 * Font Awesome and Lucide. They are written to disk rather than inlined:
 * inlining these 27 marks costs ~51KB of markup, and the App Router's RSC
 * payload duplicates it, so it would put ~100KB into a page whose readable
 * text is under 6KB.
 *
 * The files are used as CSS masks, not <img>, so a single monochrome file
 * takes its colour from the theme — see `.skill-mark` in globals.css.
 *
 * Run with: node scripts/build-icons.mjs
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as fa6 from "react-icons/fa6";
import * as si from "react-icons/si";

const OUT = "public/icons";
// Wipe first: a renamed or dropped icon would otherwise leave a stale file
// behind that nothing references.
rmSync(OUT, { force: true, recursive: true });
mkdirSync(OUT, { recursive: true });

/** icon basename -> react-icons component. gRPC has no mark in any set. */
const ICONS = {
  aws: fa6.FaAws,
  c: si.SiC,
  cpp: si.SiCplusplus,
  css: si.SiCss,
  docker: si.SiDocker,
  fastapi: si.SiFastapi,
  go: si.SiGo,
  graphql: si.SiGraphql,
  html: si.SiHtml5,
  java: fa6.FaJava,
  javascript: si.SiJavascript,
  jwt: si.SiJsonwebtokens,
  kafka: si.SiApachekafka,
  kubernetes: si.SiKubernetes,
  linux: si.SiLinux,
  mcp: si.SiModelcontextprotocol,
  mongodb: si.SiMongodb,
  mysql: si.SiMysql,
  nestjs: si.SiNestjs,
  nodejs: si.SiNodedotjs,
  oauth: si.SiAuth0,
  postgresql: si.SiPostgresql,
  python: si.SiPython,
  react: si.SiReact,
  redis: si.SiRedis,
  tailwind: si.SiTailwindcss,
  typescript: si.SiTypescript,
};

let written = 0;
for (const [name, Component] of Object.entries(ICONS)) {
  if (!Component) {
    console.warn(`[icons] no component for ${name} — skipped`);
    continue;
  }
  // A mask only reads the alpha channel, so the fill colour is irrelevant;
  // what matters is that the shapes are opaque.
  const svg = renderToStaticMarkup(React.createElement(Component))
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace(/fill="currentColor"/g, 'fill="#000"');
  writeFileSync(join(OUT, `${name}.svg`), svg);
  written += 1;
}

/**
 * Marks react-icons has no equivalent for live in assets/icons/. They are
 * copied through the same flattening as the generated ones — a mask reads only
 * the alpha channel, so gradients and brand colours are collapsed to a plain
 * silhouette. Kept out of public/ because this script wipes that directory.
 */
const CUSTOM = "assets/icons";
for (const file of readdirSync(CUSTOM).filter((f) => f.endsWith(".svg"))) {
  const svg = readFileSync(join(CUSTOM, file), "utf8")
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace(/fill="(?!none")[^"]*"/g, 'fill="#000"');
  writeFileSync(join(OUT, file), svg);
  written += 1;
}

console.log(`wrote ${written} icons to ${OUT}/`);
