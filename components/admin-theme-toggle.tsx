"use client";

export function AdminThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  }
  return (
    <button
      className="admin-theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Ganti tema dashboard"
    >
      <span aria-hidden="true">◐</span>
      <span>Ganti tema</span>
    </button>
  );
}
