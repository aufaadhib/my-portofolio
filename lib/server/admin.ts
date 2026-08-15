import { redirect } from "next/navigation";
import { requireOwner } from "./permissions";

export async function requireAdminPage() {
  try {
    return await requireOwner();
  } catch {
    redirect("/admin/login");
  }
}
