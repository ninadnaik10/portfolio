/**
 * Renders every skill icon to a standalone file in public/icons/.
 *
 * The icons used to be inlined into the page. That put ~118KB of path data
 * into the HTML (and again into the RSC payload) for a page whose actual text
 * is under 6KB — which anything reading the page as text has to wade through.
 * As files they are fetched only by browsers, and cached.
 *
 * Run with: node scripts/build-icons.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as svgl from "@ridemountainpig/svgl-react";

const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

// name -> svgl export, or [lightExport, darkExport] for theme pairs
const SVGL = {
  aws: ["AmazonWebServicesLight", "AmazonWebServicesDark"],
  c: ["C"],
  cpp: ["CPlusPlus"],
  css: ["CSS"],
  docker: ["Docker"],
  fastapi: ["FastAPI"],
  graphql: ["GraphQL"],
  html: ["HTML5"],
  java: ["Java"],
  javascript: ["JavaScript"],
  jwt: ["JWT"],
  kafka: ["ApacheKafkaLight", "ApacheKafkaDark"],
  kubernetes: ["Kubernetes"],
  linux: ["Linux"],
  mcp: ["ModelContextProtocolLight", "ModelContextProtocolDark"],
  mongodb: ["MongoDBLight", "MongoDBDark"],
  mysql: ["MySQLLight", "MySQLDark"],
  nestjs: ["NestJS"],
  nodejs: ["Nodejs"],
  postgresql: ["PostgreSQL"],
  python: ["Python"],
  react: ["ReactLight", "ReactDark"],
  redis: ["Redis"],
  tailwind: ["TailwindCSS"],
  typescript: ["TypeScript"],
};

// Devicon marks svgl lacks, or ships in a shape that fights the grid.
// `ink` bakes a colour per theme: an external <img> cannot inherit currentColor.
const DEVICON = {
  go: { slug: "go", variant: "original" },
  grpc: { slug: "grpc", variant: "plain", ink: ["#1b1b1f", "#e6e6e9"] },
  oauth: { slug: "oauth", variant: "plain", ink: ["#1b1b1f", "#e6e6e9"] },
};

const tidy = (svg) =>
  svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(width|height)="[^"]*"/g, "")
    .trim();

let written = 0;
const write = (name, svg) => {
  writeFileSync(join(OUT, `${name}.svg`), tidy(svg));
  written += 1;
};

for (const [name, exports_] of Object.entries(SVGL)) {
  const [light, dark] = exports_;
  write(dark ? `${name}-light` : name, renderToStaticMarkup(React.createElement(svgl[light])));
  if (dark) write(`${name}-dark`, renderToStaticMarkup(React.createElement(svgl[dark])));
}

for (const [name, { slug, variant, ink }] of Object.entries(DEVICON)) {
  const file = join("node_modules/devicon/icons", slug, `${slug}-${variant}.svg`);
  const raw = readFileSync(file, "utf8");
  if (!ink) {
    write(name, raw);
    continue;
  }
  const [lightInk, darkInk] = ink;
  // these variants carry no fill attributes and rely on the SVG default of
  // black, so the colour has to be set on the root
  const paint = (colour) =>
    raw
      .replace(/\sfill="(?!none")[^"]*"/g, ` fill="${colour}"`)
      .replace(/<svg\b/, `<svg fill="${colour}"`);
  write(`${name}-light`, paint(lightInk));
  write(`${name}-dark`, paint(darkInk));
}

console.log(`wrote ${written} icons to ${OUT}/`);
