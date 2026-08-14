import Image from "next/image";
import Link from "next/link";
import { CertificateSlider } from "@/components/certificate-slider";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/server/locale";
import { getPublicContent } from "@/lib/server/content";
import profileImage from "@/public/profile.jpeg";

export default async function AboutPage() {
  const locale = await getLocale(); const [{ certificates }, t] = [await getPublicContent(locale), copy[locale].about];
  return <><main className="page-shell interior-page about-page"><SectionHeading intro index={t.index} title={t.title} detail={t.detail} /><div className="about-portrait" data-reveal data-motion-media><Image src={profileImage} alt={locale === "en" ? "Portrait of Farhan Aufa Adhib" : "Potret Farhan Aufa Adhib"} fill sizes="(max-width: 800px) 100vw, 64vw" /></div><div className="about-layout" data-reveal><div><p className="eyebrow">{t.approach}</p><h2>{t.heading}</h2></div><div className="prose"><p>{t.body}</p></div></div><section className="about-certificates" aria-labelledby="about-certificates-title"><div className="about-certificates-heading" data-reveal><p className="eyebrow">06 / {locale === "en" ? "CREDENTIALS" : "KREDENSIAL"}</p><div><h2 id="about-certificates-title">{t.certificateTitle}</h2><p>{t.certificateDetail}</p></div></div><CertificateSlider certificates={certificates.slice(0, 6)} locale={locale} homeMotion={false} /><Link className="text-link certificate-all-link" href="/sertifikat">{t.allCertificates} <span aria-hidden="true">↗</span></Link></section><div className="principles" data-motion-stagger><article data-reveal><span className="eyebrow">A.01</span><h3>{t.clarity}</h3><p>{t.clarityText}</p></article><article data-reveal><span className="eyebrow">A.02</span><h3>{t.detailTitle}</h3><p>{t.detailText}</p></article><article data-reveal><span className="eyebrow">A.03</span><h3>{t.tech}</h3><p>{t.techText}</p></article></div></main><SiteFooter locale={locale} /></>;
}
