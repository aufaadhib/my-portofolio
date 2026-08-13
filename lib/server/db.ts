import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder";
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaNeon({ connectionString: databaseUrl }) });
if (prisma && process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export function requireDatabase() { if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for CMS operations"); return prisma; }
