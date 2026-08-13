import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";

export default async function ContactPage() {
  const [locale, { profile }] = await Promise.all([getLocale(), getPublicContent()]); const t = copy[locale].contact;
  return <><main className="page-shell interior-page contact-page"><SectionHeading intro index={t.index} title={t.title} detail={t.detail} /><div className="contact-layout"><div className="contact-card"><p className="eyebrow">Email</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><p className="muted">{locale === "en" ? "Indonesia · available for collaboration" : profile.location}</p></div><form className="contact-form"><label htmlFor="name">{t.name}<span>*</span></label><input id="name" name="name" autoComplete="name" placeholder={t.namePlaceholder} required /><label htmlFor="email">Email<span>*</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com…" required /><label htmlFor="message">{t.message}<span>*</span></label><textarea id="message" name="message" rows={6} placeholder={t.messagePlaceholder} required /><button className="button button-light" type="button">{t.send} <span aria-hidden="true">↗</span></button><p className="placeholder-note" aria-live="polite">{t.pending}</p></form></div></main><SiteFooter locale={locale} /></>;
}
