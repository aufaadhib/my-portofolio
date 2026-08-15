import { AdminDocumentEditor } from "@/components/admin-document-editor";
import { requireAdminPage } from "@/lib/server/admin";
import { requireDatabase } from "@/lib/server/db";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const db = requireDatabase();
  const [document, media] = await Promise.all([
    db.contentDocument.findUnique({
      where: { kind_slug: { kind: "SETTINGS", slug: "main" } },
      include: { revisions: { orderBy: { version: "desc" }, take: 1 } },
    }),
    db.mediaAsset.findMany({ select: { id: true, alt: true }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <>
      <p className="admin-kicker">SYSTEM / SETTINGS</p>
      <h2>Site settings</h2>
      <p className="admin-lead">
        Kelola domain, metadata, OG image, copyright, dan status analytics.
      </p>
      <AdminDocumentEditor
        kind="SETTINGS"
        slug="main"
        documentId={document?.id}
        initial={document?.revisions[0]?.payload as Record<string, unknown> | undefined}
        media={media}
      />
    </>
  );
}
