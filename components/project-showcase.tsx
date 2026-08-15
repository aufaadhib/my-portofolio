"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/content";
import { copy, type Locale } from "@/lib/i18n";

const ProjectRotunda = dynamic(() => import("@/components/project-rotunda"), {
  ssr: false,
  loading: () => <div className="rotunda-loading">Loading project space…</div>,
});

export function ProjectShowcase({
  projects,
  locale = "id",
}: {
  projects: Project[];
  locale?: Locale;
}) {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnhanced(media.matches && projects.length >= 3);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [projects.length]);
  const t = copy[locale].projects;
  return (
    <section
      className="project-showcase"
      aria-labelledby="project-showcase-title"
      data-motion-stagger
    >
      <div className="showcase-heading" data-reveal>
        <div>
          <p className="eyebrow">{t.selected}</p>
          <h2 id="project-showcase-title">{t.space}</h2>
        </div>
        <p>
          {enhanced
            ? locale === "en"
              ? "Drag · Left & right arrows"
              : "Geser · Panah kiri & kanan"
            : t.drag}
        </p>
      </div>
      <div className="showcase-stage" data-reveal>
        {enhanced ? (
          <ProjectRotunda projects={projects} locale={locale} />
        ) : (
          <div
            className="project-slider"
            role="region"
            aria-label={locale === "en" ? "Project slider" : "Slider proyek"}
          >
            {projects.map((project) => (
              <article key={project.slug} className={`project-slide accent-${project.accent}`}>
                <Link href={`/proyek/${project.slug}`}>
                  <div className="project-slide-visual">
                    {project.heroImage ? (
                      <Image
                        src={project.heroImage.url}
                        alt={project.heroImage.alt}
                        fill
                        sizes="84vw"
                      />
                    ) : (
                      <span aria-hidden="true">{project.index}</span>
                    )}
                  </div>
                  <p className="eyebrow">
                    {project.category} · {project.year}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
