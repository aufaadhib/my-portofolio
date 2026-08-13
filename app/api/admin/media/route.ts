import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/server/permissions";
import { requireDatabase } from "@/lib/server/db";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const owner = await requireOwner();
    if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Blob storage belum dikonfigurasi" }, { status: 503 });
    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") ?? "").trim();
    if (!(file instanceof File) || !allowed.has(file.type) || file.size > maxBytes || !alt) return NextResponse.json({ error: "File gambar atau alt text tidak valid" }, { status: 400 });
    const blob = await put(`portfolio/${crypto.randomUUID()}-${file.name}`, file, { access: "public" });
    const asset = await requireDatabase().mediaAsset.create({ data: { url: blob.url, pathname: blob.pathname, kind: "image", alt, mimeType: file.type, size: file.size, createdById: owner.id } });
    return NextResponse.json(asset, { status: 201 });
  } catch { return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 }); }
}
