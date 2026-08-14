import Link from "next/link";
import { AdminDocumentEditor } from "@/components/admin-document-editor";
import { requireAdminPage } from "@/lib/server/admin";
import { requireDatabase } from "@/lib/server/db";

export default async function AdminCertificatesPage({ searchParams }: { searchParams: Promise<{ edit?: string; new?: string }> }) {
  await requireAdminPage();
  const db = requireDatabase();
  const params = await searchParams;
  const [items, media] = await Promise.all([
    db.contentDocument.findMany({ where: { kind: "CERTIFICATE" }, include: { revisions: { orderBy: { version: "desc" }, take: 1 } }, orderBy: { createdAt: "asc" } }),
    db.mediaAsset.findMany({ where: { kind: "image" }, select: { id: true, alt: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const selected = params.edit ? items.find((item) => item.id === params.edit) : undefined;
  return <><div className="admin-heading"><div><p className="admin-kicker">CONTENT / CERTIFICATES</p><h2>Sertifikat</h2></div><Link className="button button-light" href="/admin/certificates?new=1">Tambah sertifikat</Link></div><div className="admin-table">{items.map((item) => <Link key={item.id} href={`/admin/certificates?edit=${item.id}`}><span>{(item.revisions[0]?.payload as { content?: { id?: { title?: string } } })?.content?.id?.title ?? item.slug}</span><span>{item.revisions[0]?.status}</span></Link>)}</div>{selected || params.new ? <AdminDocumentEditor kind="CERTIFICATE" slug={selected?.slug ?? `certificate-${items.length + 1}`} documentId={selected?.id} initial={selected?.revisions[0]?.payload as Record<string, unknown> | undefined} media={media} /> : <p className="admin-empty">{items.length ? "Pilih sertifikat untuk diedit." : "Belum ada sertifikat di database. Tambahkan sertifikat pertama melalui editor."}</p>}</>;
}
