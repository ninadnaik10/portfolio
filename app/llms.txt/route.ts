import { buildMarkdown } from "@/lib/markdown";

/**
 * Emits /llms.txt at build time from the same YAML the page renders, so the
 * two can never drift. `force-static` makes this a prerendered file rather
 * than a request-time handler.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildMarkdown(), {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
