export const fallbackCertificates = [
  "Belajar Dasar AI",
  "Belajar Dasar Data Science",
  "Belajar Dasar Manajemen Proyek",
  "Belajar Dasar Structured Query Language (SQL)",
  "Belajar Machine Learning untuk Pemula",
  "Memulai Pemrograman dengan Python",
  "Python Fundamental for Data Science",
  "R Fundamental for Data Science",
  "Sertim BEM",
].map((title, sortOrder) => ({
  title,
  image: `/certificate/previews/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`,
  document: `/certificate/${encodeURIComponent(title)}.pdf`,
  sortOrder,
}));
