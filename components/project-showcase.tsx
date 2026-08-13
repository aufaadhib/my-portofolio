"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/content";
const ProjectRotunda = dynamic(() => import("@/components/project-rotunda"), { ssr: false, loading: () => <div className="rotunda-loading">Menyiapkan ruang proyek…</div> });
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => { const media = matchMedia("(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"); const update = () => setEnhanced(media.matches && projects.length >= 3); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, [projects.length]);
  return <section className="project-showcase" aria-labelledby="project-showcase-title"><div className="showcase-heading"><div><p className="eyebrow">PROYEK PILIHAN</p><h2 id="project-showcase-title">Ruang karya</h2></div><p>{enhanced ? "Geser · Scroll · Panah kiri dan kanan" : "Geser untuk menjelajahi proyek"}</p></div>{enhanced ? <ProjectRotunda projects={projects} /> : <div className="project-slider" role="region" aria-label="Slider proyek">{projects.map((project) => <article key={project.slug} className={`project-slide accent-${project.accent}`}><Link href={`/proyek/${project.slug}`}><div className="project-slide-visual">{project.heroImage ? <Image src={project.heroImage.url} alt={project.heroImage.alt} fill sizes="84vw" /> : <span aria-hidden="true">{project.index}</span>}</div><p className="eyebrow">{project.category} · {project.year}</p><h3>{project.title}</h3><p>{project.summary}</p></Link></article>)}</div>}</section>;
}
