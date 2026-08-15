import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/i18n";
import { getPublicContent } from "@/lib/server/content";
import { getLocale } from "@/lib/server/locale";

export const metadata: Metadata = {
  title: "Sertifikat",
  description: "Arsip sertifikat dan kredensial Farhan Aufa Adhib.",
};

export default async function CertificatesPage() {
  const locale = await getLocale();
  const { certificates } = await getPublicContent(locale);
  const t = copy[locale].certificates;
  return (
    <>
      <main className="page-shell interior-page certificates-page">
        <SectionHeading intro index={t.index} title={t.title} detail={t.detail} />
        <div className="certificate-archive" data-motion-stagger>
          {certificates.map((certificate) => (
            <a
              key={certificate.document}
              className="certificate-archive-card"
              href={certificate.document}
              target="_blank"
              rel="noreferrer"
              aria-label={`${certificate.title} — ${t.open}`}
              data-reveal
              data-motion-media
            >
              <Image
                src={certificate.image}
                alt={certificate.title}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
            </a>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
