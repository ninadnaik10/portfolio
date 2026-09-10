import {
  AmazonWebServicesDark,
  AmazonWebServicesLight,
  ApacheKafkaDark,
  ApacheKafkaLight,
  C,
  CPlusPlus,
  CSS,
  Docker,
  FastAPI,
  GoDark,
  GoLight,
  GraphQL,
  HTML5,
  Java,
  JavaScript,
  JWT,
  Kubernetes,
  Linux,
  ModelContextProtocolDark,
  ModelContextProtocolLight,
  MongoDBDark,
  MongoDBLight,
  MySQLDark,
  MySQLLight,
  NestJS,
  Nodejs,
  PostgreSQL,
  Python,
  ReactDark,
  ReactLight,
  Redis,
  TailwindCSS,
  TypeScript,
} from "@ridemountainpig/svgl-react";
import type { SVGProps } from "react";

type Logo = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

/**
 * svgl ships `Light`/`Dark` pairs for logos that would otherwise disappear
 * against one background — `Dark` is the variant *for* dark backgrounds (white
 * artwork), `Light` the one for light. Both are rendered and toggled with the
 * `dark:` variant, so the correct mark shows without any JS.
 *
 * Keyed by the display name used in content/portfolio.yaml, matched
 * case-insensitively. A skill with no entry here renders a monogram tile, so
 * adding a technology to the YAML never breaks the grid — it just arrives
 * without artwork until you add it below.
 */
const LOGOS: Record<string, { light: Logo; dark?: Logo }> = {
  "amazon web services": {
    light: AmazonWebServicesLight,
    dark: AmazonWebServicesDark,
  },
  aws: { light: AmazonWebServicesLight, dark: AmazonWebServicesDark },
  c: { light: C },
  "c++": { light: CPlusPlus },
  css: { light: CSS },
  docker: { light: Docker },
  fastapi: { light: FastAPI },
  go: { light: GoLight, dark: GoDark },
  graphql: { light: GraphQL },
  html: { light: HTML5 },
  java: { light: Java },
  javascript: { light: JavaScript },
  jwt: { light: JWT },
  kafka: { light: ApacheKafkaLight, dark: ApacheKafkaDark },
  kubernetes: { light: Kubernetes },
  linux: { light: Linux },
  mcp: { light: ModelContextProtocolLight, dark: ModelContextProtocolDark },
  mongodb: { light: MongoDBLight, dark: MongoDBDark },
  mysql: { light: MySQLLight, dark: MySQLDark },
  nestjs: { light: NestJS },
  "node.js": { light: Nodejs },
  postgresql: { light: PostgreSQL },
  python: { light: Python },
  "react.js": { light: ReactLight, dark: ReactDark },
  redis: { light: Redis },
  "tailwind css": { light: TailwindCSS },
  typescript: { light: TypeScript },
};

export function SkillIcon({ name }: { name: string }) {
  const entry = LOGOS[name.toLowerCase()];

  if (!entry) {
    return (
      <span className="border-border/80 text-muted rounded border border-dashed px-1 font-mono text-[10px] leading-none font-semibold tracking-tight">
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4)}
      </span>
    );
  }

  const { dark: DarkLogo, light: LightLogo } = entry;

  if (!DarkLogo) {
    return <LightLogo />;
  }

  return (
    <>
      <span className="contents dark:hidden">
        <LightLogo />
      </span>
      <span className="hidden dark:contents">
        <DarkLogo />
      </span>
    </>
  );
}
