"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { archiveDocument, publishDraft, saveDraft } from "@/lib/server/cms-actions";
import type { z } from "zod";
import type { projectPayloadSchema } from "@/lib/validation/cms";

type Payload = z.infer<typeof projectPayloadSchema>;
type Props = {
  media?: { id: string; alt: string; pathname: string }[];
  documentId?: string;
  initial?: Payload;
  latestRevisionId?: string;
  latestStatus?: string;
};

export default function ProjectEditor({
  media = [],
  documentId = "",
  initial,
  latestRevisionId,
  latestStatus,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const readPayload = (form: FormData): Payload => {
    const localized = (locale: "id" | "en") => ({
      title: String(form.get(`${locale}Title`)),
      category: String(form.get(`${locale}Category`)),
      summary: String(form.get(`${locale}Summary`)),
      role: String(form.get(`${locale}Role`)),
      body: [{ type: "paragraph" as const, text: String(form.get(`${locale}Body`)) }],
      seoTitle: String(form.get(`${locale}SeoTitle`)),
      seoDescription: String(form.get(`${locale}SeoDescription`)),
    });
    return {
      slug: String(form.get("slug")),
      content: { id: localized("id"), en: localized("en") },
      year: String(form.get("year")),
      stack: String(form.get("stack"))
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      featured: form.get("featured") === "on",
      sortOrder: Number(form.get("sortOrder") || 0),
      heroMediaId: String(form.get("heroMediaId") || "") || null,
      galleryMediaIds: [],
      liveUrl: String(form.get("liveUrl") || "") || null,
      repositoryUrl: String(form.get("repositoryUrl") || "") || null,
    };
  };
  async function submit(form: FormData) {
    setBusy(true);
    setError("");
    try {
      const payload = readPayload(form);
      const result = await saveDraft("PROJECT", documentId || null, payload.slug, payload);
      if (form.get("intent") === "publish")
        await publishDraft(result.documentId, result.revisionId, "PROJECT", payload);
      router.push(`/admin/projects/${result.documentId}`);
      router.refresh();
    } catch {
      setError("Gagal menyimpan. Pastikan semua input dan URL valid.");
    } finally {
      setBusy(false);
    }
  }
  async function archive() {
    if (!documentId || !confirm("Arsipkan proyek ini dari situs publik?")) return;
    setBusy(true);
    await archiveDocument(documentId);
    router.push("/admin/projects");
    router.refresh();
  }
  return (
    <form className="admin-callout admin-editor" action={submit}>
      <div className="admin-form-grid">
        <label>
          Slug
          <input
            name="slug"
            defaultValue={initial?.slug}
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          />
        </label>
        <label>
          Tahun
          <input name="year" defaultValue={initial?.year} />
        </label>
        <label>
          Stack
          <input
            name="stack"
            defaultValue={initial?.stack.join(", ")}
            placeholder="Next.js, TypeScript"
          />
        </label>
        <label>
          Urutan
          <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </label>
        <label>
          Live URL
          <input name="liveUrl" type="url" defaultValue={initial?.liveUrl ?? ""} />
        </label>
        <label>
          Repository URL
          <input name="repositoryUrl" type="url" defaultValue={initial?.repositoryUrl ?? ""} />
        </label>
      </div>
      <label>
        Hero media
        <select name="heroMediaId" defaultValue={initial?.heroMediaId ?? ""}>
          <option value="">Fallback grafis internal</option>
          {media.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.alt} · {asset.pathname}
            </option>
          ))}
        </select>
        <small className="admin-meta">Standar gambar proyek: 1920 × 1080 px (16:9).</small>
      </label>
      {(["id", "en"] as const).map((locale) => {
        const value = initial?.content[locale];
        return (
          <fieldset key={locale}>
            <legend>{locale === "id" ? "Bahasa Indonesia" : "English"}</legend>
            <label>
              Judul
              <input name={`${locale}Title`} defaultValue={value?.title} required />
            </label>
            <label>
              Kategori
              <input name={`${locale}Category`} defaultValue={value?.category} required />
            </label>
            <label>
              Peran
              <input name={`${locale}Role`} defaultValue={value?.role} required />
            </label>
            <label>
              Ringkasan
              <textarea name={`${locale}Summary`} defaultValue={value?.summary} required />
            </label>
            <label>
              Cerita
              <textarea name={`${locale}Body`} defaultValue={value?.body[0]?.text} required />
            </label>
            <label>
              SEO title
              <input name={`${locale}SeoTitle`} defaultValue={value?.seoTitle} required />
            </label>
            <label>
              SEO description
              <textarea
                name={`${locale}SeoDescription`}
                defaultValue={value?.seoDescription}
                required
              />
            </label>
          </fieldset>
        );
      })}
      <label className="admin-check">
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Featured
      </label>
      <div className="admin-actions">
        <button className="button button-outline" name="intent" value="draft" disabled={busy}>
          Simpan draft
        </button>
        <button className="button button-light" name="intent" value="publish" disabled={busy}>
          {busy ? "Memproses…" : "Simpan & terbitkan"}
        </button>
        {documentId ? (
          <button className="admin-danger" type="button" onClick={archive} disabled={busy}>
            Arsipkan
          </button>
        ) : null}
      </div>
      {latestRevisionId ? (
        <p className="admin-meta">
          Revisi terakhir: {latestStatus} · {latestRevisionId}
        </p>
      ) : null}
      <p aria-live="polite">{error}</p>
    </form>
  );
}
