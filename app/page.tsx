import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";
import profileImage from "@/public/profile.jpeg";

export default async function Home() {
  const locale = await getLocale();
  const { projects, profile, services } = await getPublicContent(locale);
  const t = copy[locale].home;
  const intro = locale === "en" ? "Full-Stack Web & Mobile Developer focused on building functional, responsive, and effortless digital experiences—from interface to backend." : profile.intro;
  const location = locale === "en" ? "Indonesia · available for collaboration" : profile.location;
  const displayedServices = locale === "en" ? [
    { index: "S.01", title: "Modern web applications", description: "Building responsive and fast websites and web applications connected to real business and user needs." },
    { index: "S.02", title: "Mobile applications", description: "Developing functional and effortless mobile experiences for Android and iOS needs." },
    { index: "S.03", title: "Backend and integrations", description: "Handling APIs, databases, authentication, and service integrations so products work seamlessly from front to back." },
  ] : services;
  return <><main><section className="hero page-shell"><div className="hero-index" data-page-intro>{t.portfolio}</div><div className="hero-copy"><p className="eyebrow" data-page-intro>{location}</p><h1 data-page-intro>{profile.name}<em>,</em><br /><span>{profile.role}</span></h1><p className="hero-lead" data-page-intro>{intro}</p><div className="hero-actions" data-intro><Link className="button button-light" href="/proyek">{t.viewWork} <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/kontak">{t.start}</Link></div></div><div className="hero-portrait" data-page-intro><Image src={profileImage} alt={locale === "en" ? "Portrait of Farhan Aufa Adhib" : "Potret Farhan Aufa Adhib"} fill priority sizes="(max-width: 800px) 100vw, 38vw" /><span aria-hidden="true">FA</span><i aria-hidden="true" /></div><div className="hero-rule" data-rule /></section><section className="manifesto page-shell section-grid" data-reveal><p className="eyebrow">{t.work}</p><p className="manifesto-copy">{t.workCopy}</p></section><section className="projects-section page-shell"><SectionHeading index={t.selected} title={t.selectedTitle} detail={t.selectedDetail} /><div className="project-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} readLabel={copy[locale].projects.read} />)}</div><Link className="text-link all-projects" href="/proyek">{t.allProjects} <span aria-hidden="true">↗</span></Link></section><section className="services-section page-shell"><SectionHeading index={t.ability} title={t.abilityTitle} /><div className="service-list">{displayedServices.map((service) => <article key={service.index} className="service-row" data-reveal><span className="eyebrow">{service.index}</span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div></section><section className="about-tease page-shell section-grid" data-reveal><div><p className="eyebrow">{t.about}</p><h2>{t.aboutTitle}</h2></div><div><p className="section-detail">{t.aboutDetail}</p><Link className="text-link" href="/tentang">{t.knowMore} <span aria-hidden="true">↗</span></Link></div></section></main><SiteFooter locale={locale} /></>;
}
