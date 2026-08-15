import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectEditor from "@/components/admin-project-editor";
import { requireAdminPage } from "@/lib/server/admin";
import { requireDatabase } from "@/lib/server/db";
import { projectPayloadSchema } from "@/lib/validation/cms";

export default async function ProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const db = requireDatabase();
  const [item, media] = await Promise.all([
    db.contentDocument.findUnique({
      where: { id },
      include: { revisions: { orderBy: { version: "desc" }, take: 10 } },
    }),
    db.mediaAsset.findMany({
      select: { id: true, alt: true, pathname: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  if (!item || item.kind !== "PROJECT") notFound();
  const latest = item.revisions[0];
  const parsed = latest ? projectPayloadSchema.safeParse(latest.payload) : null;
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-kicker">CONTENT / PROJECT</p>
          <h2>{item.slug}</h2>
        </div>
        <Link href={`/proyek/${item.slug}`} target="_blank">
          Preview publik ↗︎
        </Link>
      </div>
      {parsed?.success ? (
        <ProjectEditor
          media={media}
          documentId={item.id}
          initial={parsed.data}
          latestRevisionId={latest.id}
          latestStatus={latest.status}
        />
      ) : (
        <p className="admin-callout">
          Payload lama tidak kompatibel. Jalankan migrasi bilingual terlebih dahulu.
        </p>
      )}
      <section className="admin-history">
        <h3>Riwayat revisi</h3>
        {item.revisions.map((revision) => (
          <div key={revision.id}>
            <span>v{revision.version}</span>
            <span>{revision.status}</span>
            <time>{revision.updatedAt.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</time>
          </div>
        ))}
      </section>
    </>
  );
}
