import { Separator } from "@heroui/react";

import { SocialLinks } from "@/components/social-links";
import type { Content } from "@/lib/content";

export function SiteFooter({
  footer,
  profile,
  socials,
}: {
  footer: Content["footer"];
  profile: Content["profile"];
  socials: Content["socials"];
}) {
  return (
    <footer className="mt-24 pb-16">
      <Separator />
      <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl font-black tracking-tight">Get in touch</p>
          {profile.email ? (
            <a
              className="text-muted hover:text-foreground mt-2 inline-block font-mono text-sm underline decoration-1 underline-offset-4 transition-colors"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          ) : null}
          <SocialLinks className="mt-6 -ml-1.5" size="sm" socials={socials} />
        </div>

        <div className="text-muted text-xs sm:text-right">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          {footer?.note ? <p className="mt-1.5 max-w-xs">{footer.note}</p> : null}
        </div>
      </div>
    </footer>
  );
}
