import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/server/locale";
import profileImage from "@/public/profile.jpeg";

export default async function AboutPage() {
  const locale = await getLocale(); const t = copy[locale].about;
  return <><main className="page-shell interior-page about-page"><SectionHeading intro index={t.index} title={t.title} detail={t.detail} /><div className="about-portrait" data-reveal><Image src={profileImage} alt={locale === "en" ? "Portrait of Farhan Aufa Adhib" : "Potret Farhan Aufa Adhib"} fill sizes="(max-width: 800px) 100vw, 64vw" /></div><div className="about-layout"><div><p className="eyebrow">{t.approach}</p><h2>{t.heading}</h2></div><div className="prose"><p>{t.body}</p></div></div><div className="principles"><article data-reveal><span className="eyebrow">A.01</span><h3>{t.clarity}</h3><p>{t.clarityText}</p></article><article data-reveal><span className="eyebrow">A.02</span><h3>{t.detailTitle}</h3><p>{t.detailText}</p></article><article data-reveal><span className="eyebrow">A.03</span><h3>{t.tech}</h3><p>{t.techText}</p></article></div></main><SiteFooter locale={locale} /></>;
}
