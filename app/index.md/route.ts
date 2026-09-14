import { buildMarkdown, estimateTokens } from "@/lib/markdown";

/**
 * The markdown representation of `/`, served to clients that ask for it via
 * `Accept: text/markdown`. middleware.ts rewrites `/` here; the path is also
 * directly fetchable.
 *
 * Prerendered, so negotiation costs a header check rather than a render.
 */
export const dynamic = "force-static";

export function GET() {
  const markdown = buildMarkdown();

  return new Response(markdown, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "text/markdown; charset=utf-8",
      // Advertised as a hint for agents budgeting context.
      "x-markdown-tokens": String(estimateTokens(markdown)),
      // Without this, a CDN would cache whichever representation it saw first
      // and hand it to every subsequent client regardless of what they asked
      // for — browsers included.
      vary: "Accept",
    },
  });
}
