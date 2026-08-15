import { ProjectCard } from "@/components/project-card";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";

export default async function ProjectsPage() {
  const locale = await getLocale();
  const { projects } = await getPublicContent(locale);
  const t = copy[locale].projects;
  return (
    <>
      <main className="page-shell interior-page projects-page">
        <SectionHeading intro index={t.index} title={t.title} detail={t.detail} />
        <ProjectShowcase projects={projects} locale={locale} />
        <section className="project-archive" aria-labelledby="project-archive-title">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">{t.archive}</p>
            <h2 id="project-archive-title">{t.all}</h2>
          </div>
          <div className="project-grid project-grid-large">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} readLabel={t.read} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
