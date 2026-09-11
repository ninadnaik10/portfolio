import Image from "next/image";

/**
 * Logo slot for an experience, programme, project or contribution. Renders
 * only when the YAML entry declares a `logo:`.
 *
 * Deliberately next/image rather than HeroUI's `Avatar.Image`: Avatar
 * resolves the image client-side after a load check, so the <img> is absent
 * from the prerendered HTML and every visit flashes initials before the logo
 * appears. The loader has already confirmed the file exists in public/, which
 * is what Avatar's runtime check would have been for — so the src is safe to
 * render server-side, and a missing file never reaches this component with a
 * src at all.
 */
export function LogoAvatar({
  alt,
  fallback,
  size = "md",
  src,
}: {
  alt: string;
  fallback?: string;
  size?: "sm" | "md";
  src?: string;
}) {
  if (!fallback) return null;

  const px = size === "sm" ? 36 : 48;
  // object-contain, not cover: square brand marks fill the frame exactly,
  // while a wider wordmark letterboxes instead of being cropped.
  const box = `${size === "sm" ? "size-9" : "size-12"} border-border/70 bg-background flex shrink-0 items-center justify-center overflow-hidden rounded-lg border`;

  if (!src) {
    return (
      <span aria-hidden className={`${box} text-muted font-mono text-xs font-semibold`}>
        {fallback}
      </span>
    );
  }

  return (
    <span className={box}>
      <Image
        alt={`${alt} logo`}
        className="size-full object-contain"
        height={px}
        src={src}
        width={px}
      />
    </span>
  );
}
