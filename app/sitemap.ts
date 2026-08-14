import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/proyek", "/tentang", "/sertifikat", "/layanan", "/kontak", "/legal"].map((route) => ({
    url: `https://example.com${route}`,
    lastModified: new Date(),
  }));
}
