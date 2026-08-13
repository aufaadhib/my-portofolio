import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card accent-${project.accent}`} data-reveal>
      <Link href={`/proyek/${project.slug}`} className="project-card-link">
        <div className="project-visual">{project.heroImage ? <Image src={project.heroImage.url} alt={project.heroImage.alt} fill sizes="(max-width: 800px) 100vw, 33vw" /> : <><span>{project.index}</span><i /></>}</div>
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <span className="text-link">Baca case study <span aria-hidden="true">↗</span></span>
      </Link>
    </article>
  );
}
