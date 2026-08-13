import Link from "next/link";
import { copy, type Locale } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";

export async function SiteFooter({ locale = "id" }: { locale?: Locale }) {
  const { profile } = await getPublicContent(locale);
  const t = copy[locale];
  const availability = locale === "en" ? "Available for selected projects" : profile.availability;
  const location = locale === "en" ? "Indonesia · available for collaboration" : profile.location;
  const socials = [["Instagram", profile.social.instagram], ["LinkedIn", profile.social.linkedin]].filter((item) => item[1]);
  return <footer className="site-footer"><div className="footer-top section-grid"><p className="eyebrow">{availability}</p><div><p className="footer-intro">{t.footer.idea}</p><Link className="footer-cta" href="/kontak">{t.footer.talk} <span aria-hidden="true">↗</span></Link></div></div><div className="footer-bottom section-grid"><div><p className="footer-name">{profile.name}</p><p className="muted">{profile.role}</p></div><div><p className="eyebrow">{t.navigation}</p><div className="footer-links"><Link href="/proyek">{t.nav[1]}</Link><Link href="/tentang">{t.nav[2]}</Link><Link href="/kontak">{t.nav[4]}</Link></div></div><div><p className="eyebrow">{t.footer.contact}</p><a href={`mailto:${profile.email}`}>{profile.email}</a><p className="muted">{location}</p>{socials.length ? <div className="social-links" aria-label={t.footer.social}>{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}<span aria-hidden="true">↗</span></a>)}</div> : null}</div></div><div className="footer-legal"><span>© 2026</span><Link href="/legal">{t.footer.privacy}</Link><span>Designed with intention.</span></div></footer>;
}
