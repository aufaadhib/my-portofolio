import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";

export default async function ContactPage() {
  const [locale, { profile }] = await Promise.all([getLocale(), getPublicContent()]);
  const t = copy[locale].contact;
  return (
    <>
      <main className="page-shell interior-page contact-page">
        <SectionHeading intro index={t.index} title={t.title} detail={t.detail} />
        <div className="contact-layout" data-reveal>
          <div className="contact-card">
            <p className="eyebrow">Email</p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="muted">
              {locale === "en" ? "Indonesia · available for collaboration" : profile.location}
            </p>
          </div>
          <ContactForm recipient={profile.email} labels={t} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
