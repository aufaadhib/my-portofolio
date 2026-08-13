import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { getPublicContent } from "@/lib/server/content";

export default async function ServicesPage() {
  const { services } = await getPublicContent();
  return <><main className="page-shell interior-page"><SectionHeading intro index="04 / LAYANAN" title="Cara berkolaborasi" detail="Pilih, ubah, atau hapus bagian ini berdasarkan layanan yang benar-benar ingin Anda tawarkan." /><div className="service-list service-list-page">{services.map((service) => <article key={service.index} className="service-row" data-reveal><span className="eyebrow">{service.index}</span><h2>{service.title}</h2><p>{service.description}</p><span className="placeholder-note">Scope, deliverables, dan proses akan diisi dari brief Anda.</span></article>)}</div></main><SiteFooter /></>;
}
