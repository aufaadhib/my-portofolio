"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminMediaLibrary({ assets }: { assets: { id: string; url: string; alt: string; pathname: string; size: number }[] }) {
  const router = useRouter(); const busyRef = useRef(false); const [busyAction, setBusyAction] = useState<"upload" | "delete" | null>(null); const [deletingId, setDeletingId] = useState<string | null>(null); const [message, setMessage] = useState(""); const busy = busyAction !== null;
  async function upload(form: FormData) {
    if (busyRef.current) return;
    busyRef.current = true; setBusyAction("upload"); setMessage("");
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await response.json();
      setMessage(response.ok ? "Media berhasil diunggah." : data.error ?? "Upload gagal.");
      if (response.ok) { (document.getElementById("media-upload") as HTMLFormElement)?.reset(); router.refresh(); }
    } catch { setMessage("Upload gagal. Periksa koneksi lalu coba lagi."); }
    finally { busyRef.current = false; setBusyAction(null); }
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void upload(new FormData(event.currentTarget));
  }
  async function remove(id: string, alt: string) {
    if (busyRef.current || !confirm(`Hapus media “${alt}” secara permanen?`)) return;
    busyRef.current = true; setBusyAction("delete"); setDeletingId(id); setMessage("");
    try {
      const response = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await response.json();
      setMessage(response.ok ? "Media berhasil dihapus." : data.error ?? "Media gagal dihapus.");
      if (response.ok) router.refresh();
    } catch { setMessage("Media gagal dihapus. Periksa koneksi lalu coba lagi."); }
    finally { busyRef.current = false; setBusyAction(null); setDeletingId(null); }
  }
  return <><form id="media-upload" className="admin-callout admin-editor" onSubmit={handleSubmit} aria-busy={busyAction === "upload"}><label>Gambar<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required disabled={busy} /></label><label>Alt text<input name="alt" required maxLength={240} disabled={busy} /></label><button className="button button-light" type="submit" disabled={busy}>{busyAction === "upload" ? <><span className="admin-spinner" aria-hidden="true" />Mengunggah…</> : "Upload media"}</button><p aria-live="polite">{message}</p></form><div className="admin-media-grid">{assets.map((asset) => <article key={asset.id}><Image src={asset.url} alt={asset.alt} width={480} height={360} unoptimized /><strong>{asset.alt}</strong><small>{asset.pathname}<br />{Math.ceil(asset.size / 1024)} KB</small><button className="admin-danger" type="button" disabled={busy} onClick={() => remove(asset.id, asset.alt)}>{deletingId === asset.id ? <><span className="admin-spinner" aria-hidden="true" />Menghapus…</> : "Hapus media"}</button></article>)}</div></>;
}
