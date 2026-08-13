import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/proyek", "/tentang", "/layanan", "/kontak", "/legal"].map((route) => ({
    url: `https://example.com${route}`,
    lastModified: new Date(),
  }));
}
