"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function AppearanceControls({
  locale,
  languageLabel,
  lightLabel,
  darkLabel,
}: {
  locale: Locale;
  languageLabel: string;
  lightLabel: string;
  darkLabel: string;
}) {
  const router = useRouter();

  function changeLanguage() {
    document.cookie = `portfolio-locale=${locale === "id" ? "en" : "id"};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  }

  return (
    <div className="appearance-controls">
      <button type="button" onClick={changeLanguage} aria-label={languageLabel}>
        {locale === "id" ? "EN" : "ID"}
      </button>
      <button type="button" onClick={toggleTheme} aria-label={`${lightLabel} / ${darkLabel}`}>
        <span aria-hidden="true">◐</span>
      </button>
    </div>
  );
}
