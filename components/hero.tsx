import { Avatar } from "@heroui/react";

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
    <section className="scroll-mt-32 pt-16 pb-20 sm:pt-24 xl:scroll-mt-24" id="about">
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

          <h1 className="mt-5 text-5xl leading-[0.95] font-black tracking-tighter text-balance sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          <p className="text-muted mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
            {profile.tagline}
          </p>

          <SocialLinks className="mt-8 -ml-1.5" socials={socials} />
        </div>

        {/* Bold framed portrait: a hard accent slab sits behind the photo. */}
        <div className="relative shrink-0">
          <div
            aria-hidden
            className="bg-accent absolute inset-0 translate-x-3 translate-y-3 rounded-xl"
          />
          <Avatar className="border-border bg-surface relative size-36 rounded-xl border sm:size-44">
            <Avatar.Image
              alt={`${profile.name}`}
              className="object-cover"
              src={profile.photo}
            />
            <Avatar.Fallback className="rounded-xl text-3xl font-black tracking-tight">
              {profile.initials ?? profile.name.slice(0, 2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar>
        </div>
      </div>

      {about.length > 0 ? (
        <div className="border-border/70 mt-16 max-w-2xl border-l-2 pl-6">
          {about.map((paragraph) => (
            <p
              className="text-muted mt-4 text-base leading-relaxed first:mt-0 sm:text-lg"
              key={paragraph.slice(0, 40)}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
