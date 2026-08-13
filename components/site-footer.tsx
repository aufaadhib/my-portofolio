import Link from "next/link";
import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top section-grid">
        <p className="eyebrow">{profile.availability}</p>
        <div>
          <p className="footer-intro">Punya ide, brief, atau sekadar ingin bertukar pikiran?</p>
          <Link className="footer-cta" href="/kontak">Mari bicara <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="footer-bottom section-grid">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="muted">{profile.role}</p>
        </div>
        <div>
          <p className="eyebrow">Navigasi</p>
          <div className="footer-links">
            <Link href="/proyek">Proyek</Link>
            <Link href="/tentang">Tentang</Link>
            <Link href="/kontak">Kontak</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Kontak</p>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <p className="muted">{profile.location}</p>
        </div>
      </div>
      <div className="footer-legal"><span>© 2026</span><Link href="/legal">Privasi & legal</Link><span>Designed with intention.</span></div>
    </footer>
  );
}
