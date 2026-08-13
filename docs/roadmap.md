# Roadmap Portofolio Kreatif

Terakhir diperbarui: 13 Agustus 2026

## Tujuan Produk

Membangun portofolio pribadi yang terasa seperti objek editorial digital: tipografi menjadi pembawa karakter utama, proyek menjadi bukti kemampuan, dan motion membantu ritme baca tanpa menghambat akses. Situs Lucas Aufrère digunakan sebagai tolok ukur kualitas visual dan interaksi, bukan sebagai template yang disalin.

Versi pertama harus:

- menjelaskan siapa pemilik portofolio dan fokus profesionalnya dalam satu viewport;
- menampilkan proyek nyata beserta peran, masalah, proses, dan hasilnya;
- bekerja baik pada mobile, tablet, dan desktop;
- tetap lengkap tanpa smooth scrolling, animasi, atau WebGL;
- cepat, aksesibel, mudah ditemukan, dan mudah diperbarui melalui CMS internal owner-only;
- menggunakan konten dan aset yang diberikan atau disetujui pengguna.

## Ringkasan Audit Referensi

### Cakupan audit

Sitemap resmi berisi 6 route publik:

| Route | Fungsi | Struktur utama |
| --- | --- | --- |
| `/` | Beranda dan ringkasan positioning | Hero, filosofi, pendekatan, proyek pilihan, layanan, kolaborasi, CTA |
| `/projets` | Katalog proyek | Rotunda WebGL dan fallback daftar 6 proyek |
| `/services` | Penawaran jasa | 4 layanan, ruang lingkup, tarif/waktu, deliverables, FAQ |
| `/a-propos` | Profil profesional | Pendekatan, perjalanan, kolaborasi, kompetensi |
| `/contact` | Konversi dan kualifikasi prospek | Kontak, form 5 field, jenis proyek, proses kerja |
| `/mentions-legales` | Informasi legal | Saat diaudit masih berupa halaman ringkas/placeholder |

Tidak ada detail proyek terpisah di sitemap. Proyek eksternal dibuka langsung dari katalog.

### Sistem visual

- Palet hampir monokrom: latar hitam, teks putih, garis tipis, aksen warna terbatas.
- Display type berukuran ekstrem dipadukan dengan body sans dan label monospaced.
- Desktop memakai grid editorial dua kolom; mobile mengubahnya menjadi alur vertikal.
- Sudut elemen cenderung tegas, bukan kumpulan kartu rounded.
- Header sangat minimal dan footer CTA dipakai sebagai penutup bersama.
- Hero desktop memiliki portrait terpotong menjadi tile; portrait dihilangkan pada mobile agar hierarchy tetap bersih.
- Penomoran dan label dipakai untuk mengomunikasikan struktur halaman, bukan sekadar dekorasi.

### Sistem motion dan teknologi

- GSAP dan ScrollTrigger dipakai untuk reveal, stagger, timeline, dan scroll choreography.
- Lenis dipakai sebagai smooth-scroll provider bersama.
- Ada transition provider antarhalaman.
- Halaman proyek memakai Three.js/WebGL untuk rotunda interaktif.
- Daftar proyek HTML tetap tersedia sebagai fallback yang dapat dibaca dan diindeks.
- Gambar memakai Next Image, ukuran responsif, preload untuk media awal, dan lazy loading untuk media berikutnya.

### SEO dan struktur

- Setiap route memiliki title, description, canonical, Open Graph, dan Twitter metadata yang unik.
- Tersedia `robots.txt`, `sitemap.xml`, manifest, favicon, dan JSON-LD.
- Beranda memakai structured data `Person`; katalog proyek menambahkan structured data proyek.
- Semua route memiliki skip link, `<main id="main">`, heading hierarchy, dan active navigation state.

### Temuan runtime terukur

- Keenam route mengembalikan HTTP 200 ketika diaudit.
- Pada viewport 390×844, keenam route tidak menghasilkan horizontal document overflow.
- Navigasi desktop diganti tombol menu pada mobile.
- Tombol menu referensi terukur sekitar 28×28 px, lebih kecil dari target sentuh 44×44 px yang akan digunakan proyek kita.
- Banyak link footer mobile terukur sekitar 25 px tinggi; proyek kita harus menyediakan hit area yang lebih besar.
- Form kontak memakai label yang terhubung dan autocomplete yang sesuai, tetapi tidak ditemukan live region untuk status async.
- Route umum memuat sekitar 0,78–0,82 MB JavaScript decoded pada audit headless; route proyek mencapai sekitar 1,74 MB JavaScript decoded karena pengalaman WebGL. Nilai transfer network tidak dijadikan acuan karena cache lokal memengaruhi pengukuran.
- Render headless halaman proyek tidak selesai stabil ketika canvas WebGL aktif. Ini memperkuat keputusan untuk tidak menjadikan WebGL sebagai fondasi v1.
- Halaman legal referensi belum lengkap dan tidak boleh dijadikan standar legal untuk proyek kita.

### Pola yang akan diadopsi

- Hierarchy editorial, tipografi besar, whitespace, dan garis struktural.
- Satu signature moment pada hero.
- Header minimal, footer CTA, dan route dengan tujuan yang jelas.
- Motion terorkestrasi pada beberapa momen penting.
- Progressive enhancement: konten HTML lebih dahulu, pengalaman kaya kemudian.
- Metadata unik, structured data, dan gambar responsif.

### Pola yang tidak akan disalin

- Nama, copy, foto, proyek, palette exact, komposisi exact, dan animasi tile yang identik.
- Rotunda WebGL sebagai navigasi proyek utama.
- Target sentuh kecil.
- Halaman legal placeholder.
- Loader atau page transition yang menunda konten.
- Klaim performa, pengalaman, klien, atau statistik yang belum dapat dibuktikan.

## Arsitektur Informasi yang Direkomendasikan

### Route v1

| Route | Status | Tujuan |
| --- | --- | --- |
| `/` | Wajib | Positioning, hero, proyek pilihan, kompetensi, profil singkat, CTA |
| `/proyek` | Wajib | Daftar seluruh proyek dengan filter ringan bila memang diperlukan |
| `/proyek/[slug]` | Wajib jika materi cukup | Case study individual untuk konteks, proses, kontribusi, dan hasil |
| `/tentang` | Wajib | Cerita profesional, cara kerja, fokus, dan tools yang benar-benar dikuasai |
| `/kontak` | Wajib | Email, profil sosial, ketersediaan, dan jalur memulai percakapan |
| `/layanan` | Kondisional | Hanya dibuat bila pengguna memang menawarkan layanan yang cukup jelas |
| `/privasi` | Kondisional | Wajib bila memakai analytics atau mengumpulkan data melalui form |

Nama route final dapat diubah bila situs diputuskan bilingual. Keputusan bahasa harus dibuat sebelum metadata dan URL diproduksi.

### Struktur beranda v1

1. Header minimal.
2. Hero dengan positioning dan signature visual milik pengguna.
3. Pernyataan pendek tentang cara berpikir atau prinsip kerja.
4. Proyek pilihan, maksimal 3–4 proyek.
5. Kompetensi atau layanan yang benar-benar didukung bukti.
6. Profil singkat dengan tautan ke halaman Tentang.
7. CTA kontak dan footer.

Testimonial, logo klien, penghargaan, statistik, dan status ketersediaan hanya ditampilkan jika datanya diberikan dan disetujui pengguna.

## Keputusan Teknis

### Dependency v1

Dependency saat ini sudah cukup:

- Next.js 16, React 19, dan TypeScript strict;
- Tailwind CSS v4;
- GSAP dan ScrollTrigger;
- `@gsap/react`;
- Lenis.

Tidak ada dependency baru yang dibutuhkan sebelum implementasi dimulai.

### Dependency yang ditahan

- Three.js/WebGL: hanya untuk eksperimen fase lanjut setelah v1 lulus performa dan aksesibilitas.
- Library carousel: gunakan CSS scroll snap dan kontrol React lebih dahulu.
- Library ikon: gunakan SVG internal untuk ikon sederhana.
- CMS internal: Better Auth + Prisma/PostgreSQL Neon + Vercel Blob untuk draft, preview, publish, dan media.
- Analytics: tunggu pilihan pengguna dan kebijakan privasi.
- Layanan form/email: tunggu keputusan apakah kontak langsung sudah cukup atau form benar-benar dibutuhkan.

### Model konten

Gunakan data TypeScript lokal, bukan menulis copy langsung di banyak komponen. Model awal:

- `SiteProfile`: identitas, positioning, lokasi umum, availability, kontak, sosial;
- `Project`: slug, judul, tahun, status, peran, ringkasan, masalah, proses, kontribusi, hasil, stack, link, media;
- `Capability`: nama, penjelasan, bukti/proyek terkait;
- `Experience`: periode, organisasi, peran, deskripsi yang disetujui;
- `ContactOption`: label, nilai, href, visibility.

Data kosong harus menyebabkan section tidak dirender, bukan memunculkan placeholder palsu.

## Roadmap Implementasi

### M0 — Intake konten dan keputusan produk

Status: menunggu input pengguna.

Pekerjaan:

- tetapkan nama publik, gelar/positioning, bahasa, audiens utama, dan tujuan situs;
- kumpulkan identitas visual yang sudah ada;
- kumpulkan seluruh proyek dan pilih 3–4 proyek unggulan;
- tentukan apakah halaman Layanan, form kontak, analytics, CV download, dan bilingual diperlukan;
- konfirmasi domain dan target deployment;
- tandai data yang boleh atau tidak boleh dipublikasikan.

Acceptance criteria:

- tidak ada fakta profesional yang masih diasumsikan;
- minimal 3 proyek memiliki materi cukup untuk ditampilkan;
- satu tujuan konversi utama dipilih;
- bahasa dan route map v1 disetujui.

### M1 — Art direction dan design system

Status: setelah M0.

Pekerjaan:

- buat 2 arah hero berbasis konten pengguna, bukan variasi template;
- pilih satu signature element yang berbeda dari portrait tile referensi;
- tetapkan palette 4–6 token, pasangan font, type scale, spacing scale, grid, border, dan motion language;
- buat wireframe mobile, tablet, dan desktop untuk route utama;
- uji heading terpanjang dan konten proyek terpanjang sejak tahap desain.

Acceptance criteria:

- arah terpilih memiliki alasan yang terkait dengan identitas pengguna;
- tidak menyerupai komposisi referensi secara identik;
- prototype 375, 768, 1024, dan 1440 px tidak overflow;
- contrast dan focus style sudah ditentukan.

### M2 — Foundation aplikasi

Status: setelah M1.

Pekerjaan:

- ganti template `create-next-app`;
- buat design tokens global dan font melalui `next/font`;
- buat data content typed;
- buat skip link, container/grid primitives, header, mobile navigation, footer, dan shared CTA;
- siapkan metadata base, robots, sitemap, manifest/icon, serta struktur Open Graph;
- buat error state dan `not-found` yang konsisten.

Acceptance criteria:

- shell bekerja dengan keyboard dan pembaca layar;
- tombol menu dan semua kontrol memiliki hit area minimal 44×44 px;
- Server Component tetap menjadi default;
- halaman tetap dapat dibaca tanpa JavaScript.

### M3 — Motion foundation

Status: setelah shell stabil.

Pekerjaan:

- registrasikan GSAP/ScrollTrigger hanya di Client Component yang memerlukannya;
- buat provider Lenis yang opsional dan tersinkron dengan ScrollTrigger;
- gunakan `useGSAP()` dengan scoped context dan cleanup;
- tetapkan entrance timeline tunggal untuk hero dan pola reveal section yang hemat;
- buat reduced-motion path yang menampilkan konten langsung, menonaktifkan Lenis, pinning, parallax, dan gerakan besar;
- tunda page transition sampai navigasi native dan fokus sudah benar.

Acceptance criteria:

- tidak ada animasi yang menyembunyikan konten bila JavaScript gagal;
- tidak ada animation leak setelah perpindahan route;
- scrolling, anchor, back/forward, keyboard, dan touch tetap native-feeling;
- hanya transform dan opacity/autoAlpha yang dipakai untuk motion utama.

### M4 — Beranda

Status: setelah M2 dan M3.

Pekerjaan:

- implementasikan hero dan signature visual;
- implementasikan positioning, prinsip kerja, proyek pilihan, kompetensi, profil singkat, CTA, dan footer;
- optimalkan gambar LCP dan media proyek;
- berikan urutan konten yang tetap kuat pada mobile tanpa portrait atau efek desktop.

Acceptance criteria:

- positioning terbaca dalam satu viewport;
- CTA utama jelas dan spesifik;
- mobile bukan hasil penyusutan layout desktop;
- hero tidak menunda first content paint;
- tidak ada layout shift dari font atau gambar.

### M5 — Katalog dan case study proyek

Status: setelah materi proyek siap.

Pekerjaan:

- buat katalog proyek HTML yang dapat diindeks;
- gunakan grid/list atau horizontal scroll snap dengan tombol prev/next, bukan canvas;
- buat case study individual bila tersedia materi cukup;
- tampilkan peran, konteks, kontribusi, proses, teknologi, dan hasil tanpa klaim yang tidak terverifikasi;
- gunakan media responsif dengan alt text dan caption yang tepat;
- tambahkan structured data proyek yang valid.

Acceptance criteria:

- setiap proyek dapat dibuka dengan link biasa dan deep link;
- navigasi proyek bekerja dengan keyboard, touch, dan tanpa drag;
- proyek tetap dapat dibaca saat motion dimatikan;
- tidak ada media proyek pihak lain tanpa izin penggunaan.

### M6 — Tentang dan Layanan

Status: Tentang wajib; Layanan menunggu keputusan M0.

Pekerjaan:

- buat halaman Tentang dari cerita, pengalaman, dan cara kerja pengguna;
- kaitkan kompetensi dengan proyek sebagai bukti;
- bila Layanan diperlukan, jelaskan scope, output, proses, dan batasan secara konkret;
- tambahkan FAQ hanya untuk pertanyaan nyata, bukan filler SEO.

Acceptance criteria:

- halaman tidak menjadi daftar skill tanpa konteks;
- semua pengalaman dan klaim telah dikonfirmasi;
- setiap layanan memiliki CTA dan ekspektasi langkah berikutnya yang jelas.

### M7 — Kontak dan privasi

Status: setelah jalur kontak dipilih.

Pekerjaan v1 yang direkomendasikan:

- tampilkan email langsung dan profil sosial yang disetujui;
- tampilkan ketersediaan dan jenis percakapan yang diharapkan;
- gunakan form hanya jika pengguna membutuhkan intake terstruktur;
- bila ada form, gunakan validasi server, honeypot/rate limit, status `aria-live`, error inline, dan kebijakan privasi;
- jangan simpan submission ke database tanpa kebutuhan eksplisit.

Acceptance criteria:

- pengguna dapat menghubungi pemilik situs meskipun JavaScript mati;
- status kirim, error, dan sukses dapat dibaca screen reader;
- data yang dikumpulkan minimal dan memiliki tujuan jelas;
- tidak ada secret atau endpoint privileged di Client Component.

### M8 — SEO, social preview, dan observability

Status: setelah konten final.

Pekerjaan:

- metadata unik per route;
- canonical, Open Graph, Twitter card, sitemap, robots, dan favicon;
- JSON-LD `Person` dan `CreativeWork`/`SoftwareApplication` sesuai jenis proyek;
- custom 404 dan redirect jika route berubah;
- analytics hanya setelah tool dan privacy disclosure disetujui.

Acceptance criteria:

- preview sosial memakai aset pengguna sendiri;
- structured data lolos validator;
- sitemap hanya memuat route final yang dapat diakses;
- tidak ada metadata placeholder `Create Next App`.

### M9 — Quality gate dan deployment

Status: sebelum publikasi.

Pekerjaan:

- jalankan lint, typecheck, production build, dan test relevan;
- audit keyboard, screen reader basics, reduced motion, no-JS fallback, dan target sentuh;
- uji 375, 768, 1024, dan 1440 px serta perangkat sentuh;
- uji jaringan lambat dan CPU throttling;
- ukur Core Web Vitals dan Lighthouse;
- cek link eksternal, metadata, sitemap, robots, form, analytics, dan privacy page;
- buat preview deployment untuk persetujuan sebelum production.

Acceptance criteria:

- `npm run lint`, `npx tsc --noEmit`, dan `npm run build` lulus;
- target Lighthouse minimal 95 pada Performance, Accessibility, Best Practices, dan SEO untuk route utama;
- tidak ada horizontal overflow, hydration mismatch, animation jank utama, atau broken link;
- seluruh konten publik telah disetujui pengguna.

### M10 — Eksperimen visual lanjutan

Status: opsional, setelah v1 stabil.

Kandidat:

- eksperimen WebGL/Three.js untuk route proyek;
- transisi halaman yang lebih sinematik;
- cursor treatment desktop;
- mode bahasa kedua;
- CMS bila frekuensi pembaruan membuktikan kebutuhan.

Syarat masuk:

- v1 sudah memenuhi target performa dan aksesibilitas;
- pengalaman baru memiliki fallback HTML lengkap;
- dependency dan kompleksitas tambahan disetujui pengguna;
- eksperimen memberi nilai yang lebih besar daripada biaya bundle dan maintenance.

## Paket Konten yang Perlu Diminta

### Identitas

- nama publik;
- gelar/role utama;
- lokasi yang boleh ditampilkan;
- bahasa situs;
- foto portrait atau alternatif visual hero;
- logo/monogram bila ada;
- CV dan izin download bila ada.

### Positioning

- audiens utama;
- jenis pekerjaan yang dicari;
- satu kalimat positioning;
- prinsip atau cara kerja;
- status ketersediaan;
- CTA utama.

### Setiap proyek

- nama dan tahun;
- status proyek: client, personal, academic, open source, atau internal;
- masalah dan tujuan;
- peran serta kontribusi pribadi;
- proses dan keputusan penting;
- teknologi yang benar-benar dipakai;
- hasil terukur bila tersedia;
- link live/repository;
- 3–8 screenshot atau media dengan izin penggunaan;
- informasi yang tidak boleh dipublikasikan.

### Kontak dan sosial

- email publik;
- GitHub, LinkedIn, dan profil lain yang ingin ditampilkan;
- domain;
- jalur kontak pilihan: email langsung atau form;
- kebijakan penyimpanan data bila form digunakan.

## Risiko dan Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Desain terlalu mirip referensi | Kunci signature element, palette, copy, dan komposisi berdasarkan identitas pengguna sebelum coding |
| Motion berlebihan | Batasi motion ke hero, section reveal penting, dan transisi bermakna |
| WebGL membebani v1 | Gunakan katalog HTML/native terlebih dahulu; WebGL hanya enhancement fase M10 |
| Konten belum siap | Gunakan content gate M0; jangan membuat fakta atau proyek palsu |
| Mobile hanya versi desktop kecil | Desain tiap breakpoint dan acceptance test 375/768/1024/1440 px |
| Form menjadi sumber spam/data liability | Mulai dari email langsung; tambahkan form hanya dengan validasi, proteksi, dan privasi |
| Bundle membesar | Audit per-route bundle dan lazy-load enhancement berat |
| SEO berisi klaim tidak valid | Generate metadata dan JSON-LD hanya dari data pengguna yang disetujui |

## Definition of Done v1

Portofolio v1 selesai ketika:

- route wajib tersedia dengan konten nyata;
- desain memiliki identitas sendiri dan tidak terlihat seperti clone;
- semua halaman responsif pada breakpoint target;
- keyboard, touch, reduced motion, dan no-JS fallback bekerja;
- proyek dapat dibaca dan diakses tanpa canvas;
- metadata, sitemap, robots, OG, dan JSON-LD valid;
- lint, typecheck, build, dan audit produksi lulus;
- tidak ada konten pribadi atau klaim yang belum disetujui;
- preview deployment telah ditinjau pengguna.

## Sumber Audit

- Referensi utama: https://www.lucas-aufrere.com/
- Sitemap: https://www.lucas-aufrere.com/sitemap.xml
- Robots: https://www.lucas-aufrere.com/robots.txt
- Web Interface Guidelines: https://github.com/vercel-labs/web-interface-guidelines
- GSAP React guidance: https://gsap.com/resources/React/
- Lenis: https://github.com/darkroomengineering/lenis
