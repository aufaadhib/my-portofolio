"use client";
import { createAuthClient } from "better-auth/react";
import { useState } from "react";

const authClient = createAuthClient({ basePath: "/api/auth" });

export function AdminLogout() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function logout() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message ?? "Logout gagal");
      window.location.replace("/admin/login");
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : "Logout gagal. Coba lagi.");
    }
  }
  return (
    <>
      {message ? (
        <p className="admin-logout-error" role="alert">
          {message}
        </p>
      ) : null}
      <button className="admin-logout" type="button" onClick={logout} disabled={busy}>
        {busy ? "Keluar…" : "Keluar"}
      </button>
    </>
  );
}
