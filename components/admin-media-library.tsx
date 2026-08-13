"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminMediaLibrary({ assets }: { assets: { id: string; url: string; alt: string; pathname: string; size: number }[] }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function upload(form: FormData) { setBusy(true); setMessage(""); const response = await fetch("/api/admin/media", { method: "POST", body: form }); const data = await response.json(); setMessage(response.ok ? "Media berhasil diunggah." : data.error ?? "Upload gagal."); setBusy(false); if (response.ok) { (document.getElementById("media-upload") as HTMLFormElement)?.reset(); router.refresh(); } }
  async function remove(id: string, alt: string) { if (!confirm(`Hapus media “${alt}” secara permanen?`)) return; setBusy(true); setMessage(""); const response = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: "DELETE" }); const data = await response.json(); setMessage(response.ok ? "Media berhasil dihapus." : data.error ?? "Media gagal dihapus."); setBusy(false); if (response.ok) router.refresh(); }
  return <><form id="media-upload" className="admin-callout admin-editor" action={upload}><label>Gambar<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></label><label>Alt text<input name="alt" required maxLength={240} /></label><button className="button button-light" disabled={busy}>{busy ? "Mengunggah…" : "Upload media"}</button><p aria-live="polite">{message}</p></form><div className="admin-media-grid">{assets.map((asset) => <article key={asset.id}><Image src={asset.url} alt={asset.alt} width={480} height={360} unoptimized /><strong>{asset.alt}</strong><small>{asset.pathname}<br />{Math.ceil(asset.size / 1024)} KB</small><button className="admin-danger" type="button" disabled={busy} onClick={() => remove(asset.id, asset.alt)}>Hapus media</button></article>)}</div></>;
}
