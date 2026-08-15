"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(formData: FormData) {
    setError("");
    const response = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
    });

    if (!response.ok) {
      setError("Email atau password tidak valid.");
      return;
    }

    const sessionResponse = await fetch("/api/auth/get-session", {
      credentials: "include",
      cache: "no-store",
    });
    const session = (await sessionResponse.json()) as { user?: unknown } | null;

    if (!sessionResponse.ok || !session?.user) {
      setError(
        "Login berhasil, tetapi session tidak tersimpan. Periksa konfigurasi auth production.",
      );
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login">
      <p className="admin-kicker">PRIVATE CMS</p>
      <h1>Masuk ke control room.</h1>
      <form action={submit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <button className="button button-light" type="submit">
          Masuk
        </button>
        <p aria-live="polite">{error}</p>
      </form>
    </main>
  );
}
