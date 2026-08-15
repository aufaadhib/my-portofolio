import "server-only";
import { revalidatePath } from "next/cache";
import { requireDatabase } from "./db";
import { requireOwner } from "./permissions";
import { payloadSchemas, type CmsKind } from "@/lib/validation/cms";

export async function publishRevision(
  documentId: string,
  revisionId: string,
  kind: CmsKind,
  payload: unknown,
) {
  const owner = await requireOwner();
  const parsed = payloadSchemas[kind].parse(payload);
  await requireDatabase().$transaction(async (tx) => {
    await tx.contentRevision.updateMany({
      where: { documentId, status: "PUBLISHED" },
      data: { status: "ARCHIVED" },
    });
    await tx.contentRevision.update({
      where: { id: revisionId, documentId, status: "DRAFT" },
      data: { status: "PUBLISHED", payload: parsed, publishedAt: new Date() },
    });
    await tx.auditLog.create({
      data: {
        actorId: owner.id,
        action: "publish",
        entityType: "ContentRevision",
        entityId: revisionId,
        metadata: { kind },
      },
    });
  });
  revalidatePath("/");
  revalidatePath("/proyek");
  revalidatePath("/tentang");
  revalidatePath("/layanan");
  revalidatePath("/kontak");
  revalidatePath("/sitemap.xml");
}
