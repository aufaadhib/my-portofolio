import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { isDeepStrictEqual } from "node:util";
import { projectPayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const payload = projectPayloadSchema.parse({
  slug: "reelmark-film-tracker",
  year: "2026",
  stack: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "Supabase",
    "PostgreSQL",
    "TMDB API",
    "Browser Extension",
    "PWA",
  ],
  featured: true,
  sortOrder: 5,
  heroMediaId: null,
  galleryMediaIds: [],
  liveUrl: "https://reelmark.afana.id",
  repositoryUrl: "https://github.com/aufaadhib/film-tracker",
  content: {
    id: {
      title: "Reelmark",
      category: "Aplikasi Pelacak Film dan Serial",
      role: "Pengembang Web Full-Stack",
      summary:
        "Aplikasi responsif untuk mencatat film dan episode yang sudah ditonton secara manual maupun otomatis melalui browser extension.",
      body: [
        {
          type: "paragraph",
          text: "Reelmark adalah aplikasi pelacak film dan serial berbasis Next.js yang menyatukan pencarian katalog TMDB, watchlist, riwayat tontonan, serta status episode dalam satu dashboard responsif. Pengguna dapat masuk melalui Supabase, mencatat tontonan secara manual, atau memakai browser extension Manifest V3 untuk menyinkronkan progres dari Netflix, Disney+, Prime Video, dan Max. Reelmark juga mendukung pengaturan ambang selesai dan instalasi sebagai PWA.",
        },
        {
          type: "paragraph",
          text: "Saya juga membangun browser extension Manifest V3 untuk Chrome dan Edge yang mendeteksi progres tontonan di Netflix, Disney+, Prime Video, dan Max. Extension dipasangkan ke akun melalui alur autentikasi terbatas, menyimpan antrean lokal, lalu menyinkronkan tontonan ke dashboard dengan pemetaan katalog dan penanganan episode yang belum cocok.",
        },
      ],
      seoTitle: "Reelmark - Aplikasi Pelacak Film dan Serial",
      seoDescription:
        "Pengembangan full-stack Reelmark, aplikasi pelacak film dan serial dengan TMDB, Supabase, PWA, dan browser extension untuk sinkronisasi progres tontonan.",
    },
    en: {
      title: "Reelmark",
      category: "Film and Series Tracking App",
      role: "Full-Stack Web Developer",
      summary:
        "A responsive app for logging watched films and episodes manually or automatically through a browser extension.",
      body: [
        {
          type: "paragraph",
          text: "Reelmark is a Next.js film and series tracker that brings TMDB catalog search, a watchlist, viewing history, and episode status into one responsive dashboard. Users can sign in through Supabase, log watches manually, or use a Manifest V3 browser extension to sync progress from Netflix, Disney+, Prime Video, and Max. Reelmark also supports an adjustable completion threshold and PWA installation.",
        },
        {
          type: "paragraph",
          text: "I also built a Manifest V3 browser extension for Chrome and Edge that detects viewing progress on Netflix, Disney+, Prime Video, and Max. The extension pairs with an account through a restricted authentication flow, keeps a local queue, and then syncs viewing activity to the dashboard with catalog mapping and unmatched-episode handling.",
        },
      ],
      seoTitle: "Reelmark - Film and Series Tracking App",
      seoDescription:
        "Full-stack development of Reelmark, a film and series tracker with TMDB, Supabase, PWA support, and a browser extension for viewing-progress sync.",
    },
  },
});

/** Publishes an idempotent CMS revision for the Reelmark film-tracker project. */
async function publishReelmarkProject() {
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
            source: "local:React-Next/film-tracker",
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

publishReelmarkProject()
  .then((result) => console.log(JSON.stringify(result)))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
