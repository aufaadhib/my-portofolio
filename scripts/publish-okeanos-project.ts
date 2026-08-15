import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { isDeepStrictEqual } from "node:util";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const payload = projectPayloadSchema.parse({
  slug: "okeanos-landingpage",
  year: "2026",
  stack: ["React", "Vite", "Tailwind CSS", "Responsive Design"],
  featured: true,
  sortOrder: 2,
  heroMediaId: null,
  galleryMediaIds: [],
  liveUrl: null,
  repositoryUrl: "https://github.com/aufaadhib/okeanos-landingpage",
  content: {
    id: {
      title: "Okeanos Landing Page",
      category: "Pengembangan Landing Page Korporat",
      role: "Frontend Developer",
      summary:
        "Landing page korporat responsif untuk memperkenalkan Okeanos, layanan, divisi, portofolio, berita, dan materi video dalam satu pengalaman digital.",
      body: [
        {
          type: "paragraph",
          text: "Okeanos Landing Page adalah website korporat berbasis React dan Vite yang menyusun informasi Okeanos ke dalam bagian profil, layanan, ekosistem divisi, portofolio, berita, dan video. Saya membangun struktur antarmuka responsif dengan Tailwind CSS, navigasi antarbagian, halaman detail portofolio dan berita, serta dukungan media visual untuk membantu pengunjung memahami layanan dan aktivitas Okeanos.",
        },
      ],
      seoTitle: "Okeanos Landing Page - Website Korporat React",
      seoDescription:
        "Landing page korporat Okeanos berbasis React dan Vite dengan informasi layanan, divisi, portofolio, berita, dan video yang responsif.",
    },
    en: {
      title: "Okeanos Landing Page",
      category: "Corporate Landing Page Development",
      role: "Frontend Developer",
      summary:
        "A responsive corporate landing page introducing Okeanos, its services, divisions, portfolio, news, and video content in one digital experience.",
      body: [
        {
          type: "paragraph",
          text: "Okeanos Landing Page is a React and Vite corporate website that organizes Okeanos content into profile, services, ecosystem divisions, portfolio, news, and video sections. I built the responsive interface structure with Tailwind CSS, section navigation, portfolio and news detail views, and visual media support to help visitors understand Okeanos services and activities.",
        },
      ],
      seoTitle: "Okeanos Landing Page - React Corporate Website",
      seoDescription:
        "A responsive React and Vite corporate landing page for Okeanos featuring services, divisions, portfolio, news, and video content.",
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
          metadata: {
            kind: "PROJECT",
            slug: payload.slug,
            source: "local:React-Standart/okeanos-landingpage",
          },
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
