import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ project, readLabel = "Lihat proyek", homeMotion = false }: { project: Project; readLabel?: string; homeMotion?: boolean }) {
  return <article className={`project-card accent-${project.accent}`} data-reveal={homeMotion ? undefined : true} data-home-card={homeMotion ? true : undefined}>
    <Link href={`/proyek/${project.slug}`} className="project-card-link">
      <div className={`project-visual${project.heroImage ? " has-image" : ""}`} data-home-image={homeMotion ? true : undefined} data-motion-media={homeMotion ? undefined : true}>{project.heroImage ? <Image src={project.heroImage.url} alt={project.heroImage.alt} fill sizes="(max-width: 800px) 100vw, 33vw" /> : <><span>{project.index}</span><i /></>}</div>
      <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.summary}</p><span className="text-link">{readLabel} <span aria-hidden="true">↗</span></span>
    </Link>
  </article>;
}
