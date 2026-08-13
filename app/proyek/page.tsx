import { ProjectCard } from "@/components/project-card";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { getPublicContent } from "@/lib/server/content";

export default async function ProjectsPage() {
  const { projects } = await getPublicContent();
  return <><main className="page-shell interior-page projects-page"><SectionHeading intro index="02 / ARSIP" title="Semua proyek" detail="Kumpulan karya yang menjelaskan cara Anda berpikir, membangun, dan menyelesaikan masalah." /><ProjectShowcase projects={projects} /><section className="project-archive" aria-labelledby="project-archive-title"><div className="section-heading" data-reveal><p className="eyebrow">ARSIP LENGKAP</p><h2 id="project-archive-title">Semua karya</h2></div><div className="project-grid project-grid-large">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></section></main><SiteFooter /></>;
}
