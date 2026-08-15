import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/server/permissions";
import { requireDatabase } from "@/lib/server/db";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const owner = await requireOwner();
    if (!process.env.BLOB_READ_WRITE_TOKEN)
      return NextResponse.json({ error: "Blob storage belum dikonfigurasi" }, { status: 503 });
    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") ?? "").trim();
    if (!(file instanceof File) || !allowed.has(file.type) || file.size > maxBytes || !alt)
      return NextResponse.json({ error: "File gambar atau alt text tidak valid" }, { status: 400 });
    const blob = await put(`portfolio/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
    });
    const asset = await requireDatabase().mediaAsset.create({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        kind: "image",
        alt,
        mimeType: file.type,
        size: file.size,
        createdById: owner.id,
      },
    });
    return NextResponse.json(asset, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const owner = await requireOwner();
    if (!process.env.BLOB_READ_WRITE_TOKEN)
      return NextResponse.json({ error: "Blob storage belum dikonfigurasi" }, { status: 503 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID media tidak valid" }, { status: 400 });
    const db = requireDatabase();
    const asset = await db.mediaAsset.findUnique({
      where: { id },
      select: { id: true, url: true, pathname: true },
    });
    if (!asset) return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 });
    const activeRevisions = await db.contentRevision.findMany({
      where: { status: { in: ["DRAFT", "PUBLISHED"] } },
      select: { payload: true, document: { select: { kind: true, slug: true } } },
    });
    const usedBy = activeRevisions
      .filter((revision) => JSON.stringify(revision.payload).includes(`"${id}"`))
      .map(
        (revision) =>
          `${revision.document.kind.toLowerCase()} ${revision.document.slug ?? "utama"}`,
      );
    if (usedBy.length)
      return NextResponse.json(
        {
          error: `Media masih digunakan oleh ${usedBy.join(", ")}. Lepaskan dari konten lalu simpan terlebih dahulu.`,
        },
        { status: 409 },
      );
    await db.$transaction(async (tx) => {
      await tx.mediaAsset.delete({ where: { id } });
      await tx.auditLog.create({
        data: {
          actorId: owner.id,
          action: "delete_media",
          entityType: "MediaAsset",
          entityId: id,
          metadata: { pathname: asset.pathname },
        },
      });
    });
    await del(asset.url);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Media deletion failed", error);
    return NextResponse.json({ error: "Media gagal dihapus" }, { status: 500 });
  }
}
