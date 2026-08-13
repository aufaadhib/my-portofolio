import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

/** Returns the visitor's persisted public-site language. */
export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("portfolio-locale")?.value === "en" ? "en" : "id";
}

