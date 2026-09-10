import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { OpenSource } from "@/components/open-source";
import { Recognition } from "@/components/recognition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";
import { WorkGrid } from "@/components/work-grid";
import { getContent } from "@/lib/content";

export default function Page() {
  const {
    about,
    education,
    experience,
    footer,
    open_source,
    profile,
    projects,
    recognition,
    roles,
    skills,
    socials,
  } = getContent();

  return (
    <>
      <SiteHeader profile={profile} />
      <main
        className="mx-auto w-full max-w-5xl flex-1 px-6"
        id="top"
        tabIndex={-1}
      >
        <Hero about={about} profile={profile} socials={socials} />

        <div className="space-y-24">
          <Experience index="01" jobs={experience} />
          <OpenSource content={open_source} index="02" />
          <WorkGrid
            id="projects"
            index="03"
            items={projects}
            title="Projects"
          />
          <Skills groups={skills} index="04" />
          <Education degrees={education} index="05" roles={roles} />
          <Recognition awards={recognition} index="06" />
        </div>

        <SiteFooter footer={footer} profile={profile} socials={socials} />
      </main>
    </>
  );
}
