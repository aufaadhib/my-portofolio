import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { isDeepStrictEqual } from "node:util";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const payload = projectPayloadSchema.parse({
  slug: "afana-company-profile",
  year: "2026",
  stack: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "Prisma 7",
    "PostgreSQL",
    "Better Auth",
    "Vercel Blob",
    "Resend",
    "Cloudflare Turnstile",
    "Swiper",
  ],
  featured: true,
  sortOrder: 4,
  heroMediaId: null,
  galleryMediaIds: [],
  liveUrl: null,
  repositoryUrl: "https://github.com/aufaadhib/company-profile",
  content: {
    id: {
      title: "Afana Company Profile",
      category: "Pengembangan Website Korporat dan CMS",
      role: "Pengembang Web Full-Stack",
      summary:
        "Website korporat bilingual Afana dengan pengalaman editorial responsif, CMS Media internal, pengelolaan kontak, dan alur publikasi berbasis peran.",
      body: [
        {
          type: "paragraph",
          text: "Afana Company Profile adalah website korporat bilingual berbasis Next.js yang menyajikan beranda, profil perusahaan, Media & Informasi, Sustainability, dan Contact melalui route Indonesia dan Inggris. Saya mengembangkan antarmuka editorial responsif, carousel yang dapat diakses dengan keyboard, metadata locale-aware, serta struktur navigasi yang mempertahankan halaman aktif ketika bahasa diganti.",
        },
        {
          type: "paragraph",
          text: "Di sisi pengelolaan, proyek ini memiliki CMS Media internal dengan Better Auth, peran Admin dan Editor, revision immutable, review dan publish, preview, audit log, serta upload Vercel Blob. Contact Control menyimpan pesan di PostgreSQL melalui Prisma, memverifikasi Cloudflare Turnstile, menerapkan rate limit berbasis HMAC, mengirim notifikasi melalui Resend, dan menyediakan inbox serta pengaturan kanal publik bagi Admin.",
        },
      ],
      seoTitle: "Afana Company Profile - Website Korporat dan CMS Bilingual",
      seoDescription:
        "Pengembangan full-stack website korporat bilingual Afana dengan CMS Media, Contact Control, autentikasi berbasis peran, PostgreSQL, dan integrasi email.",
    },
    en: {
      title: "Afana Company Profile",
      category: "Corporate Website and CMS Development",
      role: "Full-Stack Web Developer",
      summary:
        "Afana's bilingual corporate website with a responsive editorial experience, an internal Media CMS, contact management, and role-based publishing workflows.",
      body: [
        {
          type: "paragraph",
          text: "Afana Company Profile is a bilingual Next.js corporate website presenting the homepage, company profile, Media & Information, Sustainability, and Contact through dedicated Indonesian and English routes. I developed its responsive editorial interface, keyboard-accessible carousels, locale-aware metadata, and navigation structure that preserves the active page when switching languages.",
        },
        {
          type: "paragraph",
          text: "For content operations, the project includes an internal Media CMS with Better Auth, Admin and Editor roles, immutable revisions, review and publishing flows, previews, audit logs, and Vercel Blob uploads. Contact Control stores messages in PostgreSQL through Prisma, verifies Cloudflare Turnstile, applies HMAC-based rate limiting, sends Resend notifications, and provides an Admin inbox with public-channel settings.",
        },
      ],
      seoTitle: "Afana Company Profile - Bilingual Corporate Website and CMS",
      seoDescription:
        "Full-stack development of Afana's bilingual corporate website with a Media CMS, Contact Control, role-based authentication, PostgreSQL, and email integration.",
    },
  },
});

/** Publishes an idempotent CMS revision for the Afana company-profile project. */
async function publishAfanaCompanyProfile() {
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
      if (!document) {
        document = await tx.contentDocument.create({
          data: { kind: "PROJECT", slug: payload.slug },
        });
      }

      const latest = await tx.contentRevision.findFirst({
        where: { documentId: document.id },
        orderBy: { version: "desc" },
        select: { version: true, payload: true },
      });
      if (latest && isDeepStrictEqual(latest.payload, payload)) {
        return { documentId: document.id, version: latest.version, unchanged: true };
      }

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
            source: "local:React-Next/company-profile",
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

publishAfanaCompanyProfile()
  .then((result) => console.log(JSON.stringify(result)))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
