import "dotenv/config";
import { hashPassword } from "@better-auth/utils/password";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

/** Creates the single CMS owner when it does not exist; never overwrites credentials. */
async function bootstrapOwner() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.CMS_OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.CMS_OWNER_PASSWORD;
  if (!connectionString || !email || !password) throw new Error("DATABASE_URL, CMS_OWNER_EMAIL, and CMS_OWNER_PASSWORD are required");
  if (password.length < 12) throw new Error("CMS_OWNER_PASSWORD must contain at least 12 characters");

  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  try {
    if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) return "Owner already exists";
    const userId = crypto.randomUUID();
    await prisma.$transaction([
      prisma.user.create({ data: { id: userId, name: "Farhan Aufa Adhib", email, emailVerified: true, role: "owner" } }),
      prisma.account.create({ data: { id: crypto.randomUUID(), accountId: userId, providerId: "credential", userId, password: await hashPassword(password) } }),
    ]);
    return "Owner created";
  } finally {
    await prisma.$disconnect();
  }
}

bootstrapOwner().then(console.log).catch((error) => { console.error(error instanceof Error ? error.message : "Owner bootstrap failed"); process.exitCode = 1; });
