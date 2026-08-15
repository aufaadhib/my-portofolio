import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { DocumentKind, PrismaClient, RevisionStatus } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { fallbackCertificates } from "../lib/certificates";

neonConfig.webSocketConstructor = ws;

const englishTitles = [
  "Learn Basic AI",
  "Learn Basic Data Science",
  "Learn Basic Project Management",
  "Learn Basic Structured Query Language (SQL)",
  "Beginner Machine Learning",
  "Getting Started with Python Programming",
  "Python Fundamental for Data Science",
  "R Fundamental for Data Science",
  "Sertim BEM",
];

/** Adds the user-provided local certificates once so they can be managed from the CMS. */
async function seedCertificates() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !email) throw new Error("DATABASE_URL and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } });
    let created = 0;
    for (const certificate of fallbackCertificates) {
      const slug =
        certificate.image
          .split("/")
          .at(-1)
          ?.replace(/\.jpg$/, "") ?? `certificate-${certificate.sortOrder + 1}`;
      if (
        await prisma.contentDocument.findUnique({
          where: { kind_slug: { kind: DocumentKind.CERTIFICATE, slug } },
          select: { id: true },
        })
      )
        continue;
      await prisma.$transaction(async (tx) => {
        const document = await tx.contentDocument.create({
          data: { kind: DocumentKind.CERTIFICATE, slug },
        });
        const revision = await tx.contentRevision.create({
          data: {
            documentId: document.id,
            version: 1,
            status: RevisionStatus.PUBLISHED,
            payload: {
              content: {
                id: { title: certificate.title, issuer: "" },
                en: { title: englishTitles[certificate.sortOrder], issuer: "" },
              },
              year: "",
              imageMediaId: null,
              imageUrl: certificate.image,
              credentialUrl: certificate.document,
              sortOrder: certificate.sortOrder,
              visible: true,
            },
            createdById: owner.id,
            publishedAt: new Date(),
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: owner.id,
            action: "seed_certificates",
            entityType: "ContentRevision",
            entityId: revision.id,
            metadata: { kind: "CERTIFICATE", slug },
          },
        });
      });
      created++;
    }
    console.log(`${created} certificate document(s) created`);
  } finally {
    await prisma.$disconnect();
  }
}

seedCertificates().catch((error) => {
  console.error(error instanceof Error ? error.message : "Certificate seed failed");
  process.exitCode = 1;
});
