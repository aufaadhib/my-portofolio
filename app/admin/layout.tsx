import Link from "next/link";
import { AdminLogout } from "@/components/admin-logout";
import { AdminThemeToggle } from "@/components/admin-theme-toggle";
import { requireOwner } from "@/lib/server/permissions";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let owner = null;
  try {
    owner = await requireOwner();
  } catch {}
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-kicker">CMS / OWNER</p>
        <h1>Control room</h1>
        <nav>
          <Link href="/admin">Ringkasan</Link>
          <Link href="/admin/profile">Profil</Link>
          <Link href="/admin/projects">Proyek</Link>
          <Link href="/admin/services">Layanan</Link>
          <Link href="/admin/certificates">Sertifikat</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/admin/media">Media</Link>
          <Link href="/" target="_blank">
            Lihat situs ↗︎
          </Link>
        </nav>
        <div className="admin-sidebar-actions">
          <AdminThemeToggle />
          {owner ? <AdminLogout /> : null}
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
