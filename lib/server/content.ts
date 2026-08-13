import "server-only";
import { cache } from "react";
import { requireDatabase } from "./db";
import { cmsConfigured } from "./env";
import { projects as fallbackProjects, profile as fallbackProfile, services as fallbackServices } from "@/lib/content";

export const getPublishedDocuments = cache(async (kind: "PROFILE" | "PROJECT" | "SERVICE" | "SETTINGS") => {
  if (!cmsConfigured) return [];
  return requireDatabase().contentRevision.findMany({ where: { status: "PUBLISHED", document: { kind } }, include: { document: true }, orderBy: { createdAt: "asc" } });
});

export async function getPublicContent() {
  if (!cmsConfigured) return { profile: fallbackProfile, projects: fallbackProjects, services: fallbackServices };
  try {
    const [profileRevision, projectRevisions, serviceRevisions] = await Promise.all([getPublishedDocuments("PROFILE"), getPublishedDocuments("PROJECT"), getPublishedDocuments("SERVICE")]);
    const rawProjects = projectRevisions.map((item) => item.payload as (typeof fallbackProjects)[number] & { heroMediaId?: string | null });
    const mediaIds = rawProjects.flatMap((project) => project.heroMediaId ? [project.heroMediaId] : []);
    const media = mediaIds.length ? await requireDatabase().mediaAsset.findMany({ where: { id: { in: mediaIds } }, select: { id: true, url: true, alt: true, width: true, height: true } }) : [];
    const mediaById = new Map(media.map((item) => [item.id, item]));
    return {
      profile: (profileRevision[0]?.payload as typeof fallbackProfile) ?? fallbackProfile,
      projects: rawProjects.length ? rawProjects.map((project, index) => { const asset = project.heroMediaId ? mediaById.get(project.heroMediaId) : undefined; const firstBody = "body" in project && Array.isArray(project.body) ? project.body.find((block: { type?: string; text?: string }) => block.type === "paragraph")?.text : undefined; return { ...project, index: project.index ?? String(index + 1).padStart(2, "0"), accent: project.accent ?? (["cyan", "amber", "lime"][index % 3]), description: project.description ?? firstBody ?? project.summary, heroImage: asset ? { url: asset.url, alt: asset.alt, width: asset.width ?? undefined, height: asset.height ?? undefined } : undefined }; }) : fallbackProjects,
      services: serviceRevisions.length ? serviceRevisions.map((item) => item.payload as (typeof fallbackServices)[number]) : fallbackServices,
    };
  } catch { return { profile: fallbackProfile, projects: fallbackProjects, services: fallbackServices }; }
}
