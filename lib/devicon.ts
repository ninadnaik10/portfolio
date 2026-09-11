import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ICONS_DIR = join(process.cwd(), "node_modules", "devicon", "icons");

/**
 * Strip the artwork's own colours so it inherits `currentColor`, and drop the
 * intrinsic size so CSS controls it. `fill="none"` is preserved — on line and
 * plain variants it is structural, not a colour.
 */
function toCurrentColor(svg: string): string {
  return (
    svg
      .replace(/\sfill="(?!none")[^"]*"/g, ' fill="currentColor"')
      .replace(/\sstroke="(?!none")[^"]*"/g, ' stroke="currentColor"')
      // Several `plain` variants carry no fill attributes at all and rely on
      // the SVG default of black. Replacing existing fills therefore does
      // nothing for them, leaving black artwork invisible on a dark
      // background — so set the inherited default on the root as well.
      .replace(/<svg\b/, '<svg fill="currentColor"')
  );
}

/**
 * Reads a Devicon SVG off disk at build time.
 *
 * Used only for the handful of marks svgl either lacks (gRPC, OAuth) or ships
 * in a shape that fights the grid (svgl's Go is an 85px-wide wordmark; this is
 * a square gopher). Everything else comes from svgl — see skill-icon.tsx.
 */
export function deviconSvg(
  slug: string,
  variant: string,
  { monochrome = false }: { monochrome?: boolean } = {},
): string | null {
  const file = join(ICONS_DIR, slug, `${slug}-${variant}.svg`);
  if (!existsSync(file)) {
    console.warn(`[devicon] missing ${slug}-${variant}.svg`);
    return null;
  }

  const svg = readFileSync(file, "utf8")
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace(/<svg\b/, '<svg aria-hidden="true" focusable="false"')
    .trim();

  return monochrome ? toCurrentColor(svg) : svg;
}
