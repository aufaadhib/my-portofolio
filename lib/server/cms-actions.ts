"use server";

import { revalidatePath } from "next/cache";
import { requireDatabase } from "./db";
import { requireOwner } from "./permissions";
import { payloadSchemas, type CmsKind } from "@/lib/validation/cms";

export async function saveDraft(kind: CmsKind, documentId: string | null, slug: string | null, payload: unknown) {
  const owner = await requireOwner();
  const parsed = payloadSchemas[kind].parse(payload);
  const db = requireDatabase();
  return db.$transaction(async (tx) => {
    const document = documentId
      ? await tx.contentDocument.update({ where: { id: documentId }, data: { slug } })
      : await tx.contentDocument.create({ data: { kind, slug } });
    const latest = await tx.contentRevision.findFirst({ where: { documentId: document.id }, orderBy: { version: "desc" } });
    const revision = await tx.contentRevision.create({ data: { documentId: document.id, version: (latest?.version ?? 0) + 1, payload: parsed, createdById: owner.id } });
    await tx.auditLog.create({ data: { actorId: owner.id, action: "save_draft", entityType: "ContentRevision", entityId: revision.id, metadata: { kind } } });
    return { documentId: document.id, revisionId: revision.id };
  });
}

export async function publishDraft(documentId: string, revisionId: string, kind: CmsKind, payload: unknown) {
  const owner = await requireOwner();
  const parsed = payloadSchemas[kind].parse(payload);
  const db = requireDatabase();
  await db.$transaction(async (tx) => {
    await tx.contentRevision.updateMany({ where: { documentId, status: "PUBLISHED" }, data: { status: "ARCHIVED" } });
    await tx.contentRevision.update({ where: { id: revisionId, documentId, status: "DRAFT" }, data: { status: "PUBLISHED", payload: parsed, publishedAt: new Date() } });
    await tx.auditLog.create({ data: { actorId: owner.id, action: "publish", entityType: "ContentRevision", entityId: revisionId, metadata: { kind } } });
  });
  revalidatePath("/"); revalidatePath("/proyek"); revalidatePath("/layanan"); revalidatePath("/tentang"); revalidatePath("/kontak"); revalidatePath("/sitemap.xml");
}

export async function archiveDocument(documentId: string) {
  const owner = await requireOwner();
  const db = requireDatabase();
  await db.$transaction(async (tx) => {
    await tx.contentRevision.updateMany({ where: { documentId, status: { in: ["DRAFT", "PUBLISHED"] } }, data: { status: "ARCHIVED" } });
    await tx.auditLog.create({ data: { actorId: owner.id, action: "archive", entityType: "ContentDocument", entityId: documentId } });
  });
  revalidatePath("/"); revalidatePath("/proyek"); revalidatePath("/layanan"); revalidatePath("/sitemap.xml");
}
