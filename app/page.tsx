import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { HomeMotion } from "@/components/home-motion";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";
import profileImage from "@/public/profile.jpeg";
import { CertificateSlider } from "@/components/certificate-slider";

export default async function Home() {
  const locale = await getLocale();
  const {
    certificates: allCertificates,
    projects,
    profile,
    services,
  } = await getPublicContent(locale);
  const selectedProjects = projects.filter((project) => project.featured !== false).slice(0, 3);
  const certificates = allCertificates.slice(0, 5);
  const t = copy[locale].home;
  const intro =
    locale === "en"
      ? "Full-Stack Web & Mobile Developer focused on building functional, responsive, and effortless digital experiences—from interface to backend."
      : profile.intro;
  const location = locale === "en" ? "Indonesia · available for collaboration" : profile.location;
  return (
    <HomeMotion>
      <main>
        <section className="hero page-shell" data-home-hero>
          <div className="hero-index" data-home-intro>
            {t.portfolio}
          </div>
          <div className="hero-copy" data-home-hero-copy>
            <p className="eyebrow" data-home-intro>
              {location}
            </p>
            <h1 data-home-intro>
              {profile.name}
              <em>,</em>
              <br />
              <span>{profile.role}</span>
            </h1>
            <p className="hero-lead" data-home-intro>
              {intro}
            </p>
            <div className="hero-actions" data-home-intro>
              <Link className="button button-light" href="/proyek">
                {t.viewWork} <span aria-hidden="true">↗︎</span>
              </Link>
              <Link className="button button-outline" href="/kontak">
                {t.start}
              </Link>
            </div>
          </div>
          <div className="hero-portrait" data-home-intro data-home-portrait>
            <Image
              src={profileImage}
              alt={locale === "en" ? "Portrait of Farhan Aufa Adhib" : "Potret Farhan Aufa Adhib"}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 38vw"
              data-home-portrait-media
            />
            <span aria-hidden="true">FA</span>
            <i aria-hidden="true" />
          </div>
          <div className="hero-rule" data-home-rule />
        </section>
        <section className="manifesto page-shell section-grid" data-home-section>
          <p className="eyebrow" data-home-reveal>
            {t.work}
          </p>
          <p className="manifesto-copy" data-home-reveal>
            {t.workCopy}
          </p>
        </section>
        <section className="projects-section page-shell" data-home-section>
          <SectionHeading
            index={t.selected}
            title={t.selectedTitle}
            detail={t.selectedDetail}
            homeMotion
          />
          <div className="project-grid">
            {selectedProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                readLabel={copy[locale].projects.read}
                homeMotion
              />
            ))}
          </div>
          <Link className="text-link all-projects" href="/proyek" data-home-reveal>
            {t.allProjects} <span aria-hidden="true">↗︎</span>
          </Link>
        </section>
        <section className="services-section page-shell" data-home-section>
          <SectionHeading index={t.ability} title={t.abilityTitle} homeMotion />
          <div className="service-list">
            {services.map((service) => (
              <article key={service.index} className="service-row" data-home-service>
                <span className="eyebrow">{service.index}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="about-tease page-shell section-grid" data-home-section>
          <div data-home-reveal>
            <p className="eyebrow">{t.about}</p>
            <h2>{t.aboutTitle}</h2>
          </div>
          <div className="about-tease-content">
            <div data-home-reveal>
              <p className="section-detail">{t.aboutDetail}</p>
              <Link className="text-link" href="/tentang">
                {t.knowMore} <span aria-hidden="true">↗︎</span>
              </Link>
            </div>
            <CertificateSlider certificates={certificates} locale={locale} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} homeMotion />
    </HomeMotion>
  );
}
