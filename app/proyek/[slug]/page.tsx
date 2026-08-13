import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";

export async function generateStaticParams() { const { projects } = await getPublicContent(); return projects.map(({ slug }) => ({ slug })); }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const { projects } = await getPublicContent(locale);
  const project = projects.find((item) => item.slug === slug); if (!project) notFound();
  const t = locale === "en" ? { back: "Back to projects", role: "Role", story: "Project story", note: "This case study is waiting for your original material." } : { back: "Kembali ke proyek", role: "Peran", story: "Cerita proyek", note: "Case study ini menunggu materi asli Anda." };
  return <><main className={`project-detail page-shell accent-${project.accent}`}><Link className="back-link" href="/proyek">← {t.back}</Link><div className="text-reveal"><p className="eyebrow" data-page-intro>{project.index} / {project.category}</p></div><div className="text-reveal"><h1 data-page-intro>{project.title}</h1></div><div className="text-reveal"><p className="detail-lead" data-page-intro>{project.summary}</p></div><div className="detail-visual" aria-hidden="true"><span>{project.index}</span><i /></div><div className="detail-grid"><div><p className="eyebrow">{t.role}</p><p>{project.role}</p></div><div><p className="eyebrow">Stack</p><p>{project.stack.join(" · ")}</p></div><div className="detail-story"><p className="eyebrow">{t.story}</p><p>{project.description}</p><p className="placeholder-note">{t.note}</p></div></div></main><SiteFooter locale={locale} /></>;
}
