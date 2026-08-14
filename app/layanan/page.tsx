import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";

export default async function ServicesPage() {
  const locale = await getLocale(); const { services } = await getPublicContent(locale); const t = copy[locale].services;
  return <><main className="page-shell interior-page"><SectionHeading intro index={t.index} title={t.title} detail={t.detail} /><div className="service-list service-list-page">{services.map((service) => <article key={service.index} className="service-row" data-reveal><span className="eyebrow">{service.index}</span><h2>{service.title}</h2><p>{service.description}</p><span className="placeholder-note">{t.note}</span></article>)}</div></main><SiteFooter locale={locale} /></>;
}
