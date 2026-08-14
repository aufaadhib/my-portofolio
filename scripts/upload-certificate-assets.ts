import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { fallbackCertificates } from "../lib/certificates";

neonConfig.webSocketConstructor = ws;

/** Uploads certificate images and PDFs, records both assets, then publishes Blob-backed revisions. */
async function uploadCertificateAssets() {
  const connectionString = process.env.DATABASE_URL;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !token || !email) throw new Error("DATABASE_URL, BLOB_READ_WRITE_TOKEN, and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    let updated = 0;
    for (const certificate of fallbackCertificates) {
      const slug = path.basename(certificate.image, ".jpg");
      const imageBody = await readFile(path.join(process.cwd(), "public", certificate.image));
      const pdfBody = await readFile(path.join(process.cwd(), "public", decodeURIComponent(certificate.document)));
      const [imageBlob, pdfBlob] = await Promise.all([
        put(`portfolio/certificates/${slug}.jpg`, imageBody, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "image/jpeg", token }),
        put(`portfolio/certificates/${slug}.pdf`, pdfBody, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/pdf", token }),
      ]);
      const [imageAsset, pdfAsset] = await Promise.all([
        prisma.mediaAsset.upsert({ where: { pathname: imageBlob.pathname }, update: { url: imageBlob.url, alt: certificate.title, mimeType: "image/jpeg", size: imageBody.byteLength }, create: { url: imageBlob.url, pathname: imageBlob.pathname, kind: "image", alt: certificate.title, mimeType: "image/jpeg", size: imageBody.byteLength, createdById: owner.id } }),
        prisma.mediaAsset.upsert({ where: { pathname: pdfBlob.pathname }, update: { url: pdfBlob.url, alt: `${certificate.title} PDF`, mimeType: "application/pdf", size: pdfBody.byteLength }, create: { url: pdfBlob.url, pathname: pdfBlob.pathname, kind: "document", alt: `${certificate.title} PDF`, mimeType: "application/pdf", size: pdfBody.byteLength, createdById: owner.id } }),
      ]);
      const document = await prisma.contentDocument.findUniqueOrThrow({ where: { kind_slug: { kind: "CERTIFICATE", slug } } });
      const latest = await prisma.contentRevision.findFirstOrThrow({ where: { documentId: document.id }, orderBy: { version: "desc" } });
      const current = latest.payload as Record<string, unknown>;
      if (current.imageMediaId === imageAsset.id && current.credentialMediaId === pdfAsset.id) continue;
      await prisma.$transaction(async (tx) => {
        await tx.contentRevision.updateMany({ where: { documentId: document.id, status: "PUBLISHED" }, data: { status: "ARCHIVED" } });
        const revision = await tx.contentRevision.create({ data: { documentId: document.id, version: latest.version + 1, status: "PUBLISHED", payload: { ...current, imageMediaId: imageAsset.id, credentialMediaId: pdfAsset.id, imageUrl: "", credentialUrl: pdfBlob.url }, createdById: owner.id, publishedAt: new Date() } });
        await tx.auditLog.create({ data: { actorId: owner.id, action: "upload_certificate_assets", entityType: "ContentRevision", entityId: revision.id, metadata: { kind: "CERTIFICATE", slug, imagePathname: imageBlob.pathname, pdfPathname: pdfBlob.pathname } } });
      });
      updated++;
    }
    console.log(`${updated} certificate(s) updated with Blob assets`);
  } finally { await prisma.$disconnect(); }
}

uploadCertificateAssets().catch((error) => { console.error(error instanceof Error ? error.message : "Certificate upload failed"); process.exitCode = 1; });
