import "server-only";
import { cache } from "react";
import { requireDatabase } from "./db";
import { cmsConfigured } from "./env";
import { projects as fallbackProjects, profile as fallbackProfile, services as fallbackServices } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { fallbackCertificates } from "@/lib/certificates";

export const getPublishedDocuments = cache(async (kind: "PROFILE" | "PROJECT" | "SERVICE" | "CERTIFICATE" | "SETTINGS") => {
  if (!cmsConfigured) return [];
  return requireDatabase().contentRevision.findMany({ where: { status: "PUBLISHED", document: { kind } }, include: { document: true }, orderBy: { createdAt: "asc" } });
});

export async function getPublicContent(locale: Locale = "id") {
  if (!cmsConfigured) return { profile: fallbackProfile, projects: fallbackProjects, services: fallbackServices, certificates: fallbackCertificates };
  try {
    const [profileRevision, projectRevisions, serviceRevisions, certificateRevisions] = await Promise.all([getPublishedDocuments("PROFILE"), getPublishedDocuments("PROJECT"), getPublishedDocuments("SERVICE"), getPublishedDocuments("CERTIFICATE")]);
    const rawProjects = projectRevisions.map((item) => item.payload as (typeof fallbackProjects)[number] & { heroMediaId?: string | null; content?: Record<Locale, { title: string; category: string; summary: string; role: string; body: { type: string; text: string }[] }> });
    const rawCertificates = certificateRevisions.map((item) => item.payload as { content: Record<Locale, { title: string; issuer: string }>; year: string; imageMediaId: string | null; credentialMediaId?: string | null; imageUrl: string; credentialUrl: string; sortOrder: number; visible: boolean });
    const mediaIds = [...rawProjects.flatMap((project) => project.heroMediaId ? [project.heroMediaId] : []), ...rawCertificates.flatMap((certificate) => [certificate.imageMediaId, certificate.credentialMediaId].filter((id): id is string => Boolean(id)))];
    const media = mediaIds.length ? await requireDatabase().mediaAsset.findMany({ where: { id: { in: mediaIds } }, select: { id: true, url: true, alt: true, width: true, height: true } }) : [];
    const mediaById = new Map(media.map((item) => [item.id, item]));
    const rawProfile = profileRevision[0]?.payload as (typeof fallbackProfile & { socialLinks?: { label: string; href: string }[] }) | undefined;
    const socialLinks = rawProfile?.socialLinks ?? [];
    return {
      profile: rawProfile ? { ...fallbackProfile, ...rawProfile, social: { instagram: socialLinks.find((link) => link.label.toLowerCase() === "instagram")?.href ?? fallbackProfile.social.instagram, linkedin: socialLinks.find((link) => link.label.toLowerCase() === "linkedin")?.href ?? fallbackProfile.social.linkedin } } : fallbackProfile,
      projects: rawProjects.length ? rawProjects.map((project, index) => { const asset = project.heroMediaId ? mediaById.get(project.heroMediaId) : undefined; const translation = project.content?.[locale] ?? project.content?.id; const firstBody = translation?.body.find((block) => block.type === "paragraph")?.text ?? ("body" in project && Array.isArray(project.body) ? project.body.find((block: { type?: string; text?: string }) => block.type === "paragraph")?.text : undefined); return { ...project, ...translation, index: project.index ?? String(index + 1).padStart(2, "0"), accent: project.accent ?? (["cyan", "amber", "lime"][index % 3]), description: firstBody ?? project.description ?? project.summary, heroImage: asset ? { url: asset.url, alt: asset.alt, width: asset.width ?? undefined, height: asset.height ?? undefined } : undefined }; }) : fallbackProjects,
      services: serviceRevisions.length ? serviceRevisions.map((item) => { const service = item.payload as (typeof fallbackServices)[number] & { content?: Record<Locale, { title: string; description: string; scope: string[]; deliverables: string[] }>; visible?: boolean; sortOrder?: number }; return { ...service, ...(service.content?.[locale] ?? service.content?.id) }; }).filter((service) => service.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) : fallbackServices,
      certificates: rawCertificates.length ? rawCertificates.filter((certificate) => certificate.visible).map((certificate) => { const translation = certificate.content[locale] ?? certificate.content.id; const image = certificate.imageMediaId ? mediaById.get(certificate.imageMediaId) : undefined; const credential = certificate.credentialMediaId ? mediaById.get(certificate.credentialMediaId) : undefined; return { title: translation.title, image: image?.url ?? certificate.imageUrl, document: credential?.url ?? (certificate.credentialUrl || image?.url || certificate.imageUrl), sortOrder: certificate.sortOrder }; }).sort((a, b) => a.sortOrder - b.sortOrder) : fallbackCertificates,
    };
  } catch { return { profile: fallbackProfile, projects: fallbackProjects, services: fallbackServices, certificates: fallbackCertificates }; }
}
