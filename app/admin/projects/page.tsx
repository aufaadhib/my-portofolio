import Link from "next/link";
import { cmsConfigured } from "@/lib/server/env";
import { prisma } from "@/lib/server/db";
import { requireOwner } from "@/lib/server/permissions";
import { redirect } from "next/navigation";

export default async function AdminProjectsPage() { try { await requireOwner(); } catch { redirect("/admin/login"); } const items = cmsConfigured ? await prisma.contentDocument.findMany({ where: { kind: "PROJECT" }, include: { revisions: { orderBy: { version: "desc" }, take: 2 } }, orderBy: { updatedAt: "desc" } }) : []; return <><div className="admin-heading"><div><p className="admin-kicker">CONTENT / PROJECTS</p><h2>Proyek</h2></div><Link className="button button-light" href="/admin/projects/new">Tambah proyek</Link></div><div className="admin-table">{items.length ? items.map((item) => <Link key={item.id} href={`/admin/projects/${item.id}`}><span>{item.slug}</span><span>{item.revisions[0]?.status ?? "DRAFT"}</span></Link>) : <p className="admin-empty">Belum ada proyek CMS. Konten placeholder publik tetap berasal dari fallback lokal sampai draft diterbitkan.</p>}</div></>; }
