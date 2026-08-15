"use client";
import { useState } from "react";

export function AdminLogout() {
  const [busy, setBusy] = useState(false);
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth/sign-out", { method: "POST", credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error("Logout gagal");
      window.location.replace("/admin/login");
    } catch { setBusy(false); }
  }
  return <button className="admin-logout" type="button" onClick={logout} disabled={busy}>{busy ? "Keluar…" : "Keluar"}</button>;
}
