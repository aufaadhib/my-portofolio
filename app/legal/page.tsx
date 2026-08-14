import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/server/locale";

export default async function LegalPage() {
  const locale = await getLocale();
  const t = locale === "en" ? { index: "— INFORMATION", title: "Privacy & legal", lead: "This page will be completed once the domain, analytics, contact flow, and public data are agreed.", heading: "What needs to be defined", body: "The site operator, collected data, retention period, third-party services, and how visitors can request data deletion." } : { index: "— INFORMASI", title: "Privasi & legal", lead: "Halaman ini akan diisi setelah domain, analytics, jalur kontak, dan data publik disepakati.", heading: "Yang perlu ditentukan", body: "Siapa pengelola situs, data apa yang dikumpulkan, berapa lama disimpan, layanan pihak ketiga apa yang digunakan, dan bagaimana pengunjung dapat meminta penghapusan data." };
  return <><main className="page-shell interior-page legal-page"><div className="text-reveal"><p className="eyebrow" data-page-intro>{t.index}</p></div><div className="text-reveal"><h1 data-page-intro>{t.title}</h1></div><div className="text-reveal"><p className="detail-lead" data-page-intro>{t.lead}</p></div><div className="prose" data-reveal><h2>{t.heading}</h2><p>{t.body}</p></div></main><SiteFooter locale={locale} /></>;
}
