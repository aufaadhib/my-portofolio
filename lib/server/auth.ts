import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET ?? "development-only-secret-change-me",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: process.env.NODE_ENV === "production" ? [process.env.BETTER_AUTH_URL].filter((value): value is string => Boolean(value)) : ["http://localhost:3000", process.env.BETTER_AUTH_URL].filter((value): value is string => Boolean(value)),
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12 },
  plugins: [nextCookies()],
});
