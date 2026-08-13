"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppearanceControls } from "@/components/appearance-controls";
import type { Locale } from "@/lib/i18n";

const paths = ["/", "/proyek", "/tentang", "/layanan", "/kontak"] as const;

export function SiteHeader({ locale, labels }: { locale: Locale; labels: { nav: readonly string[]; navigation: string; menuOpen: string; menuClose: string; language: string; light: string; dark: string } }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!header.current) return;
    const element = header.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let previousY = window.scrollY;
    let hidden = false;

    /** Shows near the page top or while scrolling up, and hides while scrolling down. */
    const updateHeader = () => {
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      if (Math.abs(delta) < 6 && currentY >= 80) return;
      const shouldHide = !open && currentY > 120 && delta > 0;
      const shouldShow = open || currentY < 80 || delta < 0;
      if (shouldHide && !hidden) { hidden = true; gsap.to(element, { yPercent: -110, duration: reduce ? 0 : .42, ease: "power3.inOut", overwrite: "auto" }); }
      else if (shouldShow && hidden) { hidden = false; gsap.to(element, { yPercent: 0, duration: reduce ? 0 : .48, ease: "power3.out", overwrite: "auto" }); }
      previousY = currentY;
    };

    if (open) gsap.to(element, { yPercent: 0, duration: reduce ? 0 : .35, ease: "power3.out", overwrite: "auto" });
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => { window.removeEventListener("scroll", updateHeader); gsap.killTweensOf(element); };
  }, [open]);

  return <header ref={header} className="site-header"><Link className="wordmark" href="/" onClick={() => setOpen(false)}>Farhan Aufa Adhib<span aria-hidden="true">↗</span></Link><nav className="desktop-nav" aria-label={labels.navigation}>{paths.map((href, index) => <Link key={href} href={href}>{labels.nav[index]}</Link>)}</nav><AppearanceControls locale={locale} languageLabel={labels.language} lightLabel={labels.light} darkLabel={labels.dark} /><button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? labels.menuClose : labels.menuOpen} onClick={() => setOpen((value) => !value)}><span aria-hidden="true" /><span aria-hidden="true" /></button><nav id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label={labels.navigation} aria-hidden={!open}>{paths.map((href, index) => <Link key={href} href={href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}><span>0{index + 1}</span>{labels.nav[index]}</Link>)}</nav></header>;
}
