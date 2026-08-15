import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { DocumentKind, PrismaClient, RevisionStatus } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { profile, services } from "../lib/content";

neonConfig.webSocketConstructor = ws;

/** Seeds only user-approved profile and service content when CMS documents are absent. */
async function seedApprovedContent() {
  const connectionString = process.env.DATABASE_URL;
  const ownerEmail = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  if (!connectionString || !ownerEmail)
    throw new Error("DATABASE_URL and CMS_OWNER_EMAIL are required");
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });
    const seeds = [
      {
        kind: DocumentKind.PROFILE,
        slug: "main",
        payload: {
          name: profile.name,
          role: profile.role,
          location: profile.location,
          email: profile.email,
          intro: profile.intro,
          availability: profile.availability,
          socialLinks: [
            { label: "Instagram", href: profile.social.instagram },
            { label: "LinkedIn", href: profile.social.linkedin },
          ],
          portraitMediaId: null,
          resumeMediaId: null,
          seoTitle: `${profile.name} — ${profile.role}`,
          seoDescription: profile.intro,
        },
      },
      ...services.map((service, sortOrder) => ({
        kind: DocumentKind.SERVICE,
        slug: `service-${sortOrder + 1}`,
        payload: { ...service, scope: [], deliverables: [], sortOrder, visible: true },
      })),
    ];
    let created = 0;
    for (const seed of seeds) {
      if (
        await prisma.contentDocument.findUnique({
          where: { kind_slug: { kind: seed.kind, slug: seed.slug } },
          select: { id: true },
        })
      )
        continue;
      await prisma.$transaction(async (tx) => {
        const document = await tx.contentDocument.create({
          data: { kind: seed.kind, slug: seed.slug },
        });
        const revision = await tx.contentRevision.create({
          data: {
            documentId: document.id,
            version: 1,
            status: RevisionStatus.PUBLISHED,
            payload: seed.payload,
            createdById: owner.id,
            publishedAt: new Date(),
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: owner.id,
            action: "seed_approved_content",
            entityType: "ContentRevision",
            entityId: revision.id,
            metadata: { kind: seed.kind },
          },
        });
      });
      created++;
    }
    return `${created} approved content document(s) created`;
  } finally {
    await prisma.$disconnect();
  }
}

seedApprovedContent()
  .then(console.log)
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Content seed failed");
    process.exitCode = 1;
  });
