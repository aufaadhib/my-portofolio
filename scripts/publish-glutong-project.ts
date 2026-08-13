import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { isDeepStrictEqual } from "node:util";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const payload = projectPayloadSchema.parse({
  slug: "glutong-pos", year: "2026", featured: true, sortOrder: 1,
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Prisma 7", "PostgreSQL", "Better Auth", "Vercel Blob"],
  heroMediaId: null, galleryMediaIds: [], liveUrl: "https://glutong.vercel.app/pos", repositoryUrl: null,
  content: {
    id: {
      title: "Glutong POS", category: "Aplikasi Point of Sale", role: "Pengembang Web Full-Stack",
      summary: "Platform POS multi-outlet untuk operasional kafe dan restoran, menghubungkan transaksi kasir, pesanan dapur, katalog, laporan, shift, dan manajemen tenaga kerja dalam satu sistem responsif.",
      body: [{ type: "paragraph", text: "Glutong POS merupakan platform operasional kafe dan restoran yang dirancang untuk melayani kebutuhan kasir, manajer, dan pemilik. Saya mengembangkan sistem full-stack yang mencakup katalog serta harga per outlet, transaksi dan open order, antrean dapur, pembayaran, shift kas, laporan operasional, pengaturan struk, dan rekonsiliasi platform delivery. Sistem juga dilengkapi kontrol akses berbasis peran serta modul absensi wajah dan lokasi, roster staf, dan audit perubahan untuk menjaga alur kerja tetap terkontrol." }],
      seoTitle: "Glutong POS - Platform Operasional Kafe dan Restoran", seoDescription: "Pengembangan full-stack aplikasi POS multi-outlet dengan transaksi kasir, kitchen ticket, laporan, shift, katalog, dan manajemen tenaga kerja.",
    },
    en: {
      title: "Glutong POS", category: "Point of Sale Application", role: "Full-Stack Web Developer",
      summary: "A multi-outlet POS platform for cafés and restaurants, connecting checkout, kitchen orders, catalogs, reporting, shifts, and workforce operations in one responsive system.",
      body: [{ type: "paragraph", text: "Glutong POS is an operations platform built for café and restaurant cashiers, managers, and owners. I developed the full-stack system covering outlet-specific catalogs and pricing, transactions and open orders, kitchen queues, payments, cash shifts, operational reports, receipt settings, and delivery-platform reconciliation. The system also includes role-based access control, face-and-location attendance, staff rosters, and audit trails to keep daily operations controlled and traceable." }],
      seoTitle: "Glutong POS - Café and Restaurant Operations Platform", seoDescription: "Full-stack development of a multi-outlet POS application with checkout, kitchen tickets, reporting, shifts, catalogs, and workforce management.",
    },
  },
});

/** Publishes an idempotent CMS revision for the approved Glutong POS project. */
async function publishGlutongProject() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !email) throw new Error("DATABASE_URL and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    return await prisma.$transaction(async (tx) => {
      let document = await tx.contentDocument.findUnique({ where: { kind_slug: { kind: "PROJECT", slug: payload.slug } } });
      if (!document) document = await tx.contentDocument.create({ data: { kind: "PROJECT", slug: payload.slug } });
      const latest = await tx.contentRevision.findFirst({ where: { documentId: document.id }, orderBy: { version: "desc" }, select: { version: true, payload: true } });
      if (latest && isDeepStrictEqual(latest.payload, payload)) return { documentId: document.id, version: latest.version, unchanged: true };
      await tx.contentRevision.updateMany({ where: { documentId: document.id, status: "PUBLISHED" }, data: { status: "ARCHIVED" } });
      const revision = await tx.contentRevision.create({ data: { documentId: document.id, version: (latest?.version ?? 0) + 1, status: "PUBLISHED", payload, createdById: owner.id, publishedAt: new Date() } });
      await tx.auditLog.create({ data: { actorId: owner.id, action: "publish_project", entityType: "ContentRevision", entityId: revision.id, metadata: { kind: "PROJECT", slug: payload.slug } } });
      return { documentId: document.id, revisionId: revision.id, version: revision.version, unchanged: false };
    });
  } finally { await prisma.$disconnect(); }
}

publishGlutongProject().then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error); process.exitCode = 1; });
