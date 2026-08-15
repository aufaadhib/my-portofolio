import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function requireOwner() {
  const session = await auth.api.getSession({ headers: await headers() });
  const ownerEmail = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  if (!ownerEmail || !session?.user || sessionEmail !== ownerEmail) throw new Error("Unauthorized");
  return session.user;
}
