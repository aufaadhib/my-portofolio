import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { PublicExperience } from "@/components/public-experience";
import { getLocale } from "@/lib/server/locale";
import "./globals.css";

const manrope = Manrope({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = { metadataBase: new URL("https://example.com"), title: { default: "Farhan Aufa Adhib — Full-Stack Developer", template: "%s · Farhan Aufa Adhib" }, description: "Full-Stack Web & Mobile Developer.", robots: { index: true, follow: true }, openGraph: { type: "website", title: "Farhan Aufa Adhib — Full-Stack Developer", description: "Full-Stack Web & Mobile Developer." } };

const themeScript = `document.documentElement.classList.add('js');try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')||((matchMedia('(prefers-color-scheme:light)').matches)?'light':'dark')}catch(e){}`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return <html lang={locale} className={`${manrope.variable} ${plexMono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><PublicExperience locale={locale}>{children}</PublicExperience></body></html>;
}
