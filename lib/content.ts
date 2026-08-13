export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  role: string;
  stack: string[];
  accent: string;
  description: string;
  heroImage?: { url: string; alt: string; width?: number; height?: number };
};

export const profile = {
  name: "Farhan Aufa Adhib",
  role: "Full-Stack Web & Mobile Developer",
  location: "Indonesia · tersedia untuk kolaborasi",
  email: "faufaadhib@gmail.com",
  intro:
    "Full-Stack Web & Mobile Developer yang berfokus membangun pengalaman digital yang fungsional, responsif, dan nyaman digunakanâ€”dari antarmuka hingga backend.",
  availability: "Tersedia untuk proyek terpilih",
};

export const projects: Project[] = [
  {
    slug: "proyek-pertama",
    index: "01",
    title: "Proyek pertama",
    category: "Case study · konten Anda diperlukan",
    year: "Tahun",
    summary: "Tambahkan satu kalimat yang menjelaskan masalah dan hasil proyek ini.",
    role: "Peran Anda dalam proyek",
    stack: ["Next.js", "TypeScript", "GSAP"],
    accent: "cyan",
    description:
      "Ganti bagian ini dengan konteks, keputusan desain, kontribusi teknis, dan hasil yang boleh dipublikasikan.",
  },
  {
    slug: "proyek-kedua",
    index: "02",
    title: "Proyek kedua",
    category: "Eksplorasi · konten Anda diperlukan",
    year: "Tahun",
    summary: "Gunakan proyek ini untuk menunjukkan cara Anda memecahkan masalah yang berbeda.",
    role: "Peran Anda dalam proyek",
    stack: ["React", "Design system", "Motion"],
    accent: "amber",
    description:
      "Tambahkan proses, batasan, dan hal yang paling ingin Anda tunjukkan dari karya ini.",
  },
  {
    slug: "proyek-ketiga",
    index: "03",
    title: "Proyek ketiga",
    category: "Build · konten Anda diperlukan",
    year: "Tahun",
    summary: "Pilih karya yang memperlihatkan kualitas, rasa ingin tahu, atau kedalaman teknis Anda.",
    role: "Peran Anda dalam proyek",
    stack: ["Web", "UX", "Performance"],
    accent: "lime",
    description:
      "Isi dengan cerita proyek yang spesifik. Jangan menambahkan klaim yang belum Anda konfirmasi.",
  },
];

export const services = [
  {
    index: "S.01",
    title: "Website yang terasa milik sendiri",
    description: "Bangun halaman yang punya ritme, struktur, dan detail visual yang konsisten dengan identitas Anda.",
  },
  {
    index: "S.02",
    title: "Front-end yang rapi",
    description: "Komponen, layout responsif, dan implementasi yang mudah dipahami serta dirawat.",
  },
  {
    index: "S.03",
    title: "Motion yang punya alasan",
    description: "Animasi terukur untuk mengarahkan perhatian, memperjelas transisi, dan membuat pengalaman terasa hidup.",
  },
];
