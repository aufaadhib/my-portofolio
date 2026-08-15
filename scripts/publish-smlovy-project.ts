import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { isDeepStrictEqual } from "node:util";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const payload = projectPayloadSchema.parse({
  slug: "smlovy-rent",
  year: "2026",
  stack: ["Next.js", "React", "Tailwind CSS", "Vercel"],
  featured: true,
  sortOrder: 3,
  heroMediaId: null,
  galleryMediaIds: [],
  liveUrl: "https://smlovy.vercel.app/",
  repositoryUrl: null,
  content: {
    id: {
      title: "SMLovy Rent",
      category: "Pengembangan Website Rental",
      role: "Pengembang Web Full-Stack",
      summary:
        "Website rental PlayStation di Banyuwangi yang memudahkan pelanggan memilih unit PS3, PS4, atau PS5, memahami harga harian, dan menghubungi admin melalui WhatsApp.",
      body: [
        {
          type: "paragraph",
          text: "SMLovy Rent adalah landing page rental PlayStation yang dirancang untuk membuat proses memilih sesi bermain terasa lebih sederhana. Halaman ini menampilkan keunggulan layanan, pilihan unit PlayStation 3, PlayStation 4, dan PlayStation 5 beserta harga per hari, alur sewa tiga langkah mulai dari memilih unit hingga konfirmasi detail, serta CTA WhatsApp untuk melanjutkan percakapan dengan admin. Struktur responsifnya menjaga informasi utama tetap mudah ditemukan di perangkat mobile maupun desktop.",
        },
      ],
      seoTitle: "SMLovy Rent - Website Rental PlayStation Banyuwangi",
      seoDescription:
        "Pengembangan website rental PlayStation SMLovy di Banyuwangi dengan katalog unit PS3, PS4, PS5, informasi harga harian, alur sewa, dan CTA WhatsApp.",
    },
    en: {
      title: "SMLovy Rent",
      category: "Rental Website Development",
      role: "Full-Stack Web Developer",
      summary:
        "A Banyuwangi-based PlayStation rental website that helps customers choose PS3, PS4, or PS5 units, understand daily pricing, and contact the admin through WhatsApp.",
      body: [
        {
          type: "paragraph",
          text: "SMLovy Rent is a PlayStation rental landing page designed to make choosing the next gaming session feel simpler. It presents the service benefits, PlayStation 3, PlayStation 4, and PlayStation 5 rental units with daily pricing, a three-step rental flow from choosing a unit to confirming the details, and WhatsApp CTAs for continuing the conversation with the admin. Its responsive structure keeps the essential information easy to find on both mobile and desktop.",
        },
      ],
      seoTitle: "SMLovy Rent - PlayStation Rental Website in Banyuwangi",
      seoDescription:
        "Development of SMLovy's PlayStation rental website in Banyuwangi with PS3, PS4, and PS5 units, daily pricing, rental steps, and WhatsApp CTAs.",
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
          metadata: { kind: "PROJECT", slug: payload.slug, source: "https://smlovy.vercel.app/" },
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
