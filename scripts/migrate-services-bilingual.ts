import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { servicePayloadSchema } from "../lib/validation/cms";

neonConfig.webSocketConstructor = ws;

const translations = {
  "service-1": {
    en: {
      title: "Modern web applications",
      description:
        "Building responsive, high-performing websites and web applications aligned with real business and user needs.",
      scope: [],
      deliverables: [],
    },
  },
  "service-2": {
    en: {
      title: "Mobile applications",
      description:
        "Developing functional and intuitive mobile experiences for Android and iOS requirements.",
      scope: [],
      deliverables: [],
    },
  },
  "service-3": {
    en: {
      title: "Backend and integrations",
      description:
        "Handling APIs, databases, authentication, and service integrations so products work seamlessly from front to back.",
      scope: [],
      deliverables: [],
    },
  },
  "quality-assurance": {
    en: {
      title: "Quality Assurance",
      description:
        "Ensuring web and mobile applications remain stable, consistent, and aligned with requirements through structured testing before release.",
      scope: [
        "Functional and user-flow testing",
        "Responsive and device compatibility testing",
        "Regression testing after application changes",
        "Risk, inconsistency, and edge-case identification",
      ],
      deliverables: [
        "Test scenarios and checklists",
        "Defect reports with reproducible steps",
        "Issue prioritization based on impact",
        "Fix verification and testing summary",
      ],
    },
  },
} as const;

/** Migrates all published services to the bilingual payload structure. */
async function migrateServicesBilingual() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !email) throw new Error("DATABASE_URL and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    const documents = await prisma.contentDocument.findMany({
      where: { kind: "SERVICE", slug: { in: Object.keys(translations) } },
      include: { revisions: { orderBy: { version: "desc" }, take: 1 } },
    });
    let migrated = 0;
    for (const document of documents) {
      const latest = document.revisions[0];
      if (!latest || !document.slug || !(document.slug in translations)) continue;
      const current = latest.payload as {
        index: string;
        title?: string;
        description?: string;
        scope?: string[];
        deliverables?: string[];
        content?: unknown;
        sortOrder: number;
        visible: boolean;
      };
      if (current.content) continue;
      const english = translations[document.slug as keyof typeof translations].en;
      const payload = servicePayloadSchema.parse({
        index: current.index,
        content: {
          id: {
            title: current.title,
            description: current.description,
            scope: current.scope ?? [],
            deliverables: current.deliverables ?? [],
          },
          en: english,
        },
        sortOrder: current.sortOrder,
        visible: current.visible,
      });
      await prisma.$transaction(async (tx) => {
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
            action: "migrate_service_bilingual",
            entityType: "ContentRevision",
            entityId: revision.id,
            metadata: { kind: "SERVICE", slug: document.slug },
          },
        });
      });
      migrated++;
    }
    return { migrated };
  } finally {
    await prisma.$disconnect();
  }
}

migrateServicesBilingual()
  .then((result) => console.log(JSON.stringify(result)))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
