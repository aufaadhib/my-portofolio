import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { isDeepStrictEqual } from "node:util";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const payload = projectPayloadSchema.parse({
  slug: "rsud-blambangan",
  year: "2026",
  stack: ["Laravel", "PHP", "Livewire", "Vite", "JavaScript", "Laravel Echo", "Flux UI"],
  featured: true,
  sortOrder: 2,
  heroMediaId: null,
  galleryMediaIds: [],
  liveUrl: "https://rsudblambangan.id",
  repositoryUrl: null,
  content: {
    id: {
      title: "Portal RSUD Blambangan",
      category: "Pengembangan Website Rumah Sakit",
      role: "Pengembang Web Full-Stack",
      summary:
        "Portal layanan publik rumah sakit yang menyatukan profil, jadwal dokter, ketersediaan kamar, layanan medis, artikel kesehatan, dan pendaftaran eksekutif dalam satu pengalaman digital.",
      body: [
        {
          type: "paragraph",
          text: "Portal RSUD Blambangan dirancang untuk membantu pasien dan keluarga menemukan informasi layanan rumah sakit secara lebih mudah. Platform ini mencakup profil dan sejarah rumah sakit, jadwal dokter dengan filter poliklinik dan hari, ketersediaan kamar dengan kapasitas serta status okupansi, layanan rawat inap, rawat jalan, IGD, MCU, layanan unggulan, artikel kesehatan, galeri, pengaduan, tarif, alur persyaratan, dan pendaftaran eksekutif. Antarmukanya mendukung Bahasa Indonesia dan English, sementara data interaktif diperbarui melalui komponen aplikasi berbasis Laravel dan Livewire.",
        },
      ],
      seoTitle: "Portal RSUD Blambangan - Website Layanan Rumah Sakit",
      seoDescription:
        "Pengembangan portal layanan publik RSUD Blambangan dengan jadwal dokter, ketersediaan kamar, layanan medis, artikel kesehatan, dan pendaftaran eksekutif.",
    },
    en: {
      title: "RSUD Blambangan Portal",
      category: "Hospital Website Development",
      role: "Full-Stack Web Developer",
      summary:
        "A public hospital portal bringing together hospital information, doctor schedules, bed availability, medical services, health articles, and executive registration in one digital experience.",
      body: [
        {
          type: "paragraph",
          text: "The RSUD Blambangan portal helps patients and families find essential hospital information more easily. The platform includes the hospital profile and history, doctor schedules with clinic and day filters, bed availability with capacity and occupancy status, inpatient, outpatient, emergency, and medical check-up services, specialist services, health articles, galleries, complaints, tariffs, requirements, and executive registration. Its interface supports Indonesian and English, while interactive data is updated through a Laravel and Livewire application stack.",
        },
      ],
      seoTitle: "RSUD Blambangan Portal - Hospital Services Website",
      seoDescription:
        "Full-stack development of the RSUD Blambangan public hospital portal with doctor schedules, bed availability, medical services, health articles, and executive registration.",
    },
  },
});

async function publishProject() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !email) throw new Error("DATABASE_URL and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    return await prisma.$transaction(async (tx) => {
      let document = await tx.contentDocument.findUnique({
        where: { kind_slug: { kind: "PROJECT", slug: payload.slug } },
      });
      if (!document)
        document = await tx.contentDocument.create({
          data: { kind: "PROJECT", slug: payload.slug },
        });
      const latest = await tx.contentRevision.findFirst({
        where: { documentId: document.id },
        orderBy: { version: "desc" },
        select: { version: true, payload: true },
      });
      if (latest && isDeepStrictEqual(latest.payload, payload))
        return { documentId: document.id, version: latest.version, unchanged: true };
      await tx.contentRevision.updateMany({
        where: { documentId: document.id, status: "PUBLISHED" },
        data: { status: "ARCHIVED" },
      });
      const revision = await tx.contentRevision.create({
        data: {
          documentId: document.id,
          version: (latest?.version ?? 0) + 1,
          status: "PUBLISHED",
          payload,
          createdById: owner.id,
          publishedAt: new Date(),
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: owner.id,
          action: "publish_project",
          entityType: "ContentRevision",
          entityId: revision.id,
          metadata: { kind: "PROJECT", slug: payload.slug, source: "https://rsudblambangan.id" },
        },
      });
      return {
        documentId: document.id,
        revisionId: revision.id,
        version: revision.version,
        unchanged: false,
      };
    });
  } finally {
    await prisma.$disconnect();
  }
}

publishProject()
  .then((result) => console.log(JSON.stringify(result)))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
