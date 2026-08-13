"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(formData: FormData) { setError(""); const response = await fetch("/api/auth/sign-in/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }) }); if (!response.ok) setError("Email atau password tidak valid."); else router.push("/admin"); }
  return <main className="admin-login"><p className="admin-kicker">PRIVATE CMS</p><h1>Masuk ke control room.</h1><form action={submit}><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /><button className="button button-light" type="submit">Masuk</button><p aria-live="polite">{error}</p></form></main>;
}
