import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

/** Migrates the approved Astore project into the bilingual CMS payload format. */
async function migrateProjectsBilingual() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !email) throw new Error("DATABASE_URL and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    const document = await prisma.contentDocument.findUniqueOrThrow({
      where: { kind_slug: { kind: "PROJECT", slug: "astore-premium" } },
    });
    const latest = await prisma.contentRevision.findFirstOrThrow({
      where: { documentId: document.id },
      orderBy: { version: "desc" },
      select: { version: true, payload: true },
    });
    const current = latest.payload as Record<string, unknown>;
    if (current.content)
      return { documentId: document.id, version: latest.version, unchanged: true };
    const payload = projectPayloadSchema.parse({
      slug: "astore-premium",
      year: "2024",
      stack: ["Next.js", "React", "Tailwind CSS"],
      featured: true,
      sortOrder: 0,
      heroMediaId: null,
      galleryMediaIds: [],
      liveUrl: "https://yuksappstore.com",
      repositoryUrl: null,
      content: {
        id: {
          title: "Astore Premium",
          category: "Pengembangan Website E-commerce",
          role: "Pengembang Web Full-Stack",
          summary:
            "Platform e-commerce produk digital dengan katalog berbasis database, variasi harga, pencarian, autentikasi, dan alat verifikasi layanan dalam pengalaman yang responsif.",
          body: [
            {
              type: "paragraph",
              text: "Astore Premium merupakan platform e-commerce produk digital yang menghadirkan katalog akun dan layanan premium dalam satu pengalaman belanja. Saya menangani pengembangan full-stack, mulai dari antarmuka responsif, pengelolaan katalog dan variasi produk berbasis database, hingga fitur pendukung yang membantu pelanggan menemukan produk, memilih paket, dan melanjutkan pembelian dengan lebih mudah.",
            },
          ],
          seoTitle: "Astore Premium - E-commerce Produk Digital",
          seoDescription:
            "Pengembangan full-stack platform e-commerce produk digital dengan katalog berbasis database, variasi harga, autentikasi, dan alat verifikasi layanan.",
        },
        en: {
          title: "Astore Premium",
          category: "E-commerce Website Development",
          role: "Full-Stack Web Developer",
          summary:
            "A responsive digital-product e-commerce platform featuring a database-driven catalog, pricing variations, search, authentication, and service verification tools.",
          body: [
            {
              type: "paragraph",
              text: "Astore Premium is a digital-product e-commerce platform that brings premium accounts and services into one shopping experience. I handled the full-stack development, from the responsive interface and database-driven product and package management to supporting features that help customers discover products, select a package, and continue their purchase with ease.",
            },
          ],
          seoTitle: "Astore Premium - Digital Product E-commerce",
          seoDescription:
            "Full-stack development of a digital-product e-commerce platform with a database-driven catalog, pricing variations, authentication, and verification tools.",
        },
      },
    });
    return await prisma.$transaction(async (tx) => {
      await tx.contentRevision.updateMany({
        where: { documentId: document.id, status: "PUBLISHED" },
        data: { status: "ARCHIVED" },
      });
      const revision = await tx.contentRevision.create({
        data: {
          documentId: document.id,
          version: latest.version + 1,
          status: "PUBLISHED",
          payload,
          createdById: owner.id,
          publishedAt: new Date(),
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: owner.id,
          action: "migrate_project_bilingual",
          entityType: "ContentRevision",
          entityId: revision.id,
          metadata: { kind: "PROJECT", slug: "astore-premium" },
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

migrateProjectsBilingual()
  .then((result) => console.log(JSON.stringify(result)))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
