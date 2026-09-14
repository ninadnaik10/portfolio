import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Markdown content negotiation.
 *
 * A request for `/` carrying `Accept: text/markdown` is rewritten to the
 * prerendered markdown route; everything else gets the HTML page unchanged.
 * Both responses carry `Vary: Accept` so shared caches keep the two
 * representations apart.
 *
 * `includes` rather than a wildcard match on purpose: browsers send
 * `text/html,...,*​/*` and must keep getting HTML.
 *
 * The `Vary: Accept` below is best-effort on the HTML branch: Next rewrites
 * `Vary` on static responses for its RSC routing and discards whatever
 * middleware set, so only the markdown response carries it reliably. That is
 * acceptable here because middleware runs on every request to `/`, so the
 * negotiation itself never depends on a cache honouring Vary.
 */
export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";

  if (accept.includes("text/markdown")) {
    return NextResponse.rewrite(new URL("/index.md", request.url));
  }

  const response = NextResponse.next();
  response.headers.append("vary", "Accept");
  return response;
}

export const config = {
  matcher: "/",
};
