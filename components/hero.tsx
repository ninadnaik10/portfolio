import { Avatar, Card } from "@heroui/react";

import { ResumeButton } from "@/components/resume-button";
import { SocialLinks } from "@/components/social-links";
import type { Content } from "@/lib/content";

export function Hero({
  about,
  profile,
  socials,
}: {
  about: string[];
  profile: Content["profile"];
  socials: Content["socials"];
}) {
  return (
    <section
      className="section-block scroll-mt-32 pt-16 pb-20 sm:pt-24 xl:scroll-mt-24"
      id="about"
    >
      <div className="flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-between md:gap-14">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">
            {profile.role}
            {profile.location ? (
              <>
                <span className="text-separator mx-2">/</span>
                {profile.location}
              </>
            ) : null}
          </p>

          <h1 className="mt-5 text-5xl leading-[0.95] font-extrabold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          {profile.tagline ? (
            <p className="text-muted mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
              {profile.tagline}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            {profile.resume ? (
              <ResumeButton href={profile.resume} size="lg" />
            ) : null}
            <SocialLinks className="-ml-1.5" socials={socials} />
          </div>
        </div>

        {/* Bold framed portrait: a hard accent slab sits behind the photo. */}
        <div className="relative shrink-0">
          <div
            aria-hidden
            className="bg-accent absolute inset-0 translate-x-3 translate-y-3 rounded-xl"
          />
          {profile.photo ? (
            /* A plain <img>: next/image would re-encode to WebP/AVIF and drop
               the HDR gain map, and HeroUI's Avatar.Image only resolves the
               source after a client-side load check, keeping it out of the
               prerendered HTML. The loader already verified the file exists. */
            // eslint-disable-next-line @next/next/no-img-element -- see above
            <img
              alt={profile.name}
              className="border-border bg-surface relative size-36 rounded-xl border object-cover sm:size-44"
              height={640}
              src={profile.photo}
              width={640}
            />
          ) : (
            <Avatar className="border-border bg-surface relative size-36 rounded-xl border sm:size-44">
              <Avatar.Fallback className="rounded-xl text-3xl font-extrabold tracking-tight">
                {profile.initials ?? profile.name.slice(0, 2).toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
          )}
        </div>
      </div>

      {about.length > 0 ? (
        <Card className="mt-16 max-w-2xl">
          <Card.Content>
            {about.map((paragraph) => (
              <p
                className="text-muted mt-4 text-base leading-relaxed first:mt-0 sm:text-lg"
                key={paragraph.slice(0, 40)}
              >
                {paragraph}
              </p>
            ))}
          </Card.Content>
        </Card>
      ) : null}
    </section>
  );
}
