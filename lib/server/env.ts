import "server-only";

export const cmsConfigured = Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
