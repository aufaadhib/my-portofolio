import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { PublicExperience } from "@/components/public-experience";
import "./globals.css";

const manrope = Manrope({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: { default: "Nama Anda — Creative developer", template: "%s · Nama Anda" },
  description: "Portofolio personal yang sedang menunggu cerita dan karya Anda.",
  robots: { index: true, follow: true },
  openGraph: { type: "website", title: "Nama Anda — Creative developer", description: "Portofolio personal yang sedang menunggu cerita dan karya Anda." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={`${manrope.variable} ${plexMono.variable}`} data-scroll-behavior="smooth"><body><PublicExperience>{children}</PublicExperience></body></html>;
}
