import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function requireOwner() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.email !== process.env.CMS_OWNER_EMAIL) throw new Error("Unauthorized");
  return session.user;
}
