import { z } from "zod";

export const profilePayloadSchema = z.object({
  name: z.string().min(1).max(120), role: z.string().min(1).max(160), location: z.string().max(160),
  email: z.email(), intro: z.string().max(1200), availability: z.string().max(160),
  socialLinks: z.array(z.object({ label: z.string().min(1).max(40), href: z.url() })).max(12),
  portraitMediaId: z.string().nullable(), resumeMediaId: z.string().nullable(),
  seoTitle: z.string().max(160), seoDescription: z.string().max(320),
});

const projectTranslationSchema = z.object({
  title: z.string().min(1).max(120), category: z.string().max(120), summary: z.string().max(1000), role: z.string().max(240),
  body: z.array(z.object({ type: z.enum(["paragraph", "heading", "list", "quote", "image", "link"]), text: z.string().max(5000) })).max(100),
  seoTitle: z.string().max(160), seoDescription: z.string().max(320),
});

export const projectPayloadSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.object({ id: projectTranslationSchema, en: projectTranslationSchema }), year: z.string().max(20),
  stack: z.array(z.string().min(1).max(60)).max(20), featured: z.boolean(), sortOrder: z.number().int(),
  heroMediaId: z.string().nullable(), galleryMediaIds: z.array(z.string()).max(30),
  liveUrl: z.url().nullable(), repositoryUrl: z.url().nullable(),
});

const serviceTranslationSchema = z.object({ title: z.string().min(1).max(160), description: z.string().max(1000), scope: z.array(z.string().max(300)).max(30), deliverables: z.array(z.string().max(300)).max(30) });
export const servicePayloadSchema = z.object({ index: z.string().max(20), content: z.object({ id: serviceTranslationSchema, en: serviceTranslationSchema }), sortOrder: z.number().int(), visible: z.boolean() });
const resourceUrlSchema = z.string().max(2000).refine((value) => !value || value.startsWith("/certificate/") || URL.canParse(value) && new URL(value).protocol === "https:", "Gunakan URL HTTPS atau path /certificate/");
const certificateTranslationSchema = z.object({ title: z.string().min(1).max(200), issuer: z.string().max(160) });
export const certificatePayloadSchema = z.object({ content: z.object({ id: certificateTranslationSchema, en: certificateTranslationSchema }), year: z.string().max(20), imageMediaId: z.string().nullable(), credentialMediaId: z.string().nullable(), imageUrl: resourceUrlSchema, credentialUrl: resourceUrlSchema, sortOrder: z.number().int(), visible: z.boolean() }).refine((value) => value.imageMediaId || value.imageUrl, { message: "Pilih media atau isi path gambar" });
export const settingsPayloadSchema = z.object({ siteName: z.string().min(1).max(120), siteUrl: z.url(), defaultTitle: z.string().max(160), defaultDescription: z.string().max(320), ogImageMediaId: z.string().nullable(), copyrightText: z.string().max(160), analyticsEnabled: z.boolean() });

export const payloadSchemas = { PROFILE: profilePayloadSchema, PROJECT: projectPayloadSchema, SERVICE: servicePayloadSchema, CERTIFICATE: certificatePayloadSchema, SETTINGS: settingsPayloadSchema } as const;
export type CmsKind = keyof typeof payloadSchemas;
