import Link from "next/link";
import { cmsConfigured } from "@/lib/server/env";
import { prisma } from "@/lib/server/db";
import { requireOwner } from "@/lib/server/permissions";
import { redirect } from "next/navigation";

export default async function AdminPage() { try { await requireOwner(); } catch { redirect("/admin/login"); } const counts = cmsConfigured ? await Promise.all([prisma.contentDocument.count(), prisma.contentRevision.count({ where: { status: "DRAFT" } }), prisma.mediaAsset.count()]) : [0, 0, 0]; return <><p className="admin-kicker">DASHBOARD</p><h2>Content overview</h2><p className="admin-lead">Kelola konten yang sudah disetujui tanpa mengubah struktur visual situs.</p><div className="admin-stats"><div><span>Dokumen</span><strong>{counts[0]}</strong></div><div><span>Draft</span><strong>{counts[1]}</strong></div><div><span>Media</span><strong>{counts[2]}</strong></div></div><div className="admin-callout"><strong>{cmsConfigured ? "CMS terhubung." : "CMS belum terhubung."}</strong><p>{cmsConfigured ? "Gunakan menu di samping untuk mengelola konten." : "Tambahkan DATABASE_URL dan BETTER_AUTH_SECRET untuk mengaktifkan database."}</p><Link href="/admin/projects">Kelola proyek →</Link></div></>; }
