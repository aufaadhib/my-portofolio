import Link from "next/link";
import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { getPublicContent } from "@/lib/server/content";
import profileImage from "@/public/profile.jpeg";

export default async function Home() {
  const { projects, profile, services } = await getPublicContent();
  return <>
    <main>
      <section className="hero page-shell">
        <div className="hero-index" data-page-intro>01 / PORTOFOLIO</div>
        <div className="hero-copy">
          <p className="eyebrow" data-page-intro>{profile.location}</p>
          <h1 data-page-intro>{profile.name}<em>,</em><br /><span>{profile.role}</span></h1>
          <p className="hero-lead" data-page-intro>{profile.intro}</p>
          <div className="hero-actions" data-intro><Link className="button button-light" href="/proyek">Lihat karya <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/kontak">Mulai percakapan</Link></div>
        </div>
        <div className="hero-portrait" data-page-intro><Image src={profileImage} alt="Portrait pemilik portofolio" fill priority sizes="(max-width: 800px) 170px, 34vw" /><span aria-hidden="true">FA</span><i aria-hidden="true" /></div>
        <div className="hero-rule" data-rule />
      </section>

      <section className="manifesto page-shell section-grid" data-reveal><p className="eyebrow">02 / CARA KERJA</p><p className="manifesto-copy">Saya percaya detail kecil menentukan cara sebuah halaman diingat. Struktur yang jelas, tipografi yang berani, dan motion yang punya alasan—semuanya bekerja untuk membuat ide terasa lebih dekat.</p></section>

      <section className="projects-section page-shell"><SectionHeading index="03 / PILIHAN" title="Karya terpilih" detail="Beberapa ruang untuk menampilkan proyek, eksperimen, dan cara berpikir Anda. Konten faktualnya siap diganti kapan pun." /><div className="project-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div><Link className="text-link all-projects" href="/proyek">Lihat semua proyek <span aria-hidden="true">↗</span></Link></section>

      <section className="services-section page-shell"><SectionHeading index="04 / KEMAMPUAN" title="Yang bisa dibangun" /><div className="service-list">{services.map((service) => <article key={service.index} className="service-row" data-reveal><span className="eyebrow">{service.index}</span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div></section>

      <section className="about-tease page-shell section-grid" data-reveal><div><p className="eyebrow">05 / TENTANG</p><h2>Membangun produk digital secara menyeluruh.</h2></div><div><p className="section-detail">Saya mengembangkan aplikasi web dan mobile dari antarmuka hingga backend, dengan fokus pada fungsi, responsivitas, dan pengalaman yang nyaman digunakan.</p><Link className="text-link" href="/tentang">Kenali lebih dekat <span aria-hidden="true">↗</span></Link></div></section>
    </main>
    <SiteFooter />
  </>;
}
