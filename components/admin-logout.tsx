"use client";
import { useRouter } from "next/navigation";

export function AdminLogout() { const router = useRouter(); async function logout() { await fetch("/api/auth/sign-out", { method: "POST" }); router.push("/admin/login"); router.refresh(); } return <button className="admin-logout" type="button" onClick={logout}>Keluar</button>; }
