import Link from "next/link";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell"><aside className="admin-sidebar"><p className="admin-kicker">CMS / OWNER</p><h1>Control room</h1><nav><Link href="/admin">Ringkasan</Link><Link href="/admin/profile">Profil</Link><Link href="/admin/projects">Proyek</Link><Link href="/admin/services">Layanan</Link><Link href="/admin/settings">Settings</Link><Link href="/admin/media">Media</Link></nav></aside><main className="admin-main">{children}</main></div>;
}
