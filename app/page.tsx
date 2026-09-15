import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { OpenSource } from "@/components/open-source";
import { Research } from "@/components/research";
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
    research,
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

        <div className="space-y-16 sm:space-y-20">
          <Experience index="01" jobs={experience} />
          <Education degrees={education} index="02" />
          <OpenSource content={open_source} index="03" />
          <WorkGrid
            id="projects"
            index="04"
            items={projects}
            title="Projects"
          />
          <Research index="05" papers={research} />
          <Skills groups={skills} index="06" />
        </div>

        <SiteFooter footer={footer} profile={profile} socials={socials} />
      </main>
    </>
  );
}
