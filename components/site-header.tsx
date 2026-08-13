"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigation = [
  ["Beranda", "/"],
  ["Proyek", "/proyek"],
  ["Tentang", "/tentang"],
  ["Layanan", "/layanan"],
  ["Kontak", "/kontak"],
] as const;

export function SiteHeader() {
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

      if (shouldHide && !hidden) {
        hidden = true;
        gsap.to(element, { yPercent: -110, duration: reduce ? 0 : .42, ease: "power3.inOut", overwrite: "auto" });
      } else if (shouldShow && hidden) {
        hidden = false;
        gsap.to(element, { yPercent: 0, duration: reduce ? 0 : .48, ease: "power3.out", overwrite: "auto" });
      }

      previousY = currentY;
    };

    if (open) gsap.to(element, { yPercent: 0, duration: reduce ? 0 : .35, ease: "power3.out", overwrite: "auto" });
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
      gsap.killTweensOf(element);
    };
  }, [open]);

  return (
    <header ref={header} className="site-header">
      <Link className="wordmark" href="/" onClick={() => setOpen(false)}>
        Nama Anda<span aria-hidden="true">↗</span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">
        {navigation.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav
        id="mobile-navigation"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label="Navigasi mobile"
        aria-hidden={!open}
      >
        {navigation.map(([label, href], index) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <span>0{index + 1}</span>{label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
