<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Direction

1. Bangun portofolio kreatif editorial dengan tipografi kuat, komposisi presisi, ruang lega, dan motion yang terukur.
2. Gunakan https://www.lucas-aufrere.com/ sebagai referensi kualitas visual dan interaksi, bukan sebagai template untuk disalin.
3. Ciptakan identitas, susunan, copy, dan elemen hero yang khas milik pengguna. Jangan menyalin aset, kode, copy, atau komposisi referensi secara identik.
4. Hindari tampilan template SaaS, bento generik, gradient berlebihan, glassmorphism, dan kumpulan kartu rounded yang tidak memiliki alasan desain.
5. Pertahankan satu elemen visual khas sebagai pusat identitas; elemen lain harus tenang dan mendukung isi.

## Project Stack

1. Gunakan Next.js 16 App Router dan TypeScript strict.
2. Gunakan npm sebagai satu-satunya package manager dan pertahankan `package-lock.json`.
3. Gunakan Tailwind CSS v4 sebagai fondasi styling dan bangun komponen antarmuka internal sesuai kebutuhan proyek.
4. Gunakan GSAP, `@gsap/react`, ScrollTrigger, dan Lenis untuk motion yang memang membutuhkan JavaScript.
5. Jangan menambahkan Framer Motion, library carousel, atau library ikon. Three.js hanya digunakan untuk rotunda `/proyek` yang telah disetujui; CMS internal menggunakan Better Auth, Prisma/PostgreSQL Neon, dan Vercel Blob.
6. Utamakan kemampuan native browser, React, Next.js, CSS, dan SVG sebelum menambah dependency.

## Content Rules

1. Jika membutuhkan teks, foto, data pribadi, riwayat kerja, keahlian, layanan, proyek, screenshot, tautan, testimonial, kontak, CV, atau konten lain, minta langsung kepada pengguna.
2. Jangan mengarang placeholder yang terlihat sebagai fakta, mengambil konten milik orang lain, atau mencari konten pengguna di internet tanpa permintaan dan persetujuan eksplisit.
3. Jangan menerbitkan data pribadi, alamat, nomor telepon, email, atau dokumen pengguna sebelum pengguna menyetujui konten tersebut.
4. Gunakan Bahasa Indonesia untuk teks antarmuka kecuali pengguna meminta bahasa lain atau situs bilingual.
5. Jika konten faktual belum tersedia, minta langsung kepada pengguna; jangan mencari atau mengarangnya di internet.

## CMS Rules

1. CMS berada di repository Next.js yang sama dan hanya dapat diakses satu owner melalui Better Auth email/password.
2. Gunakan PostgreSQL Neon melalui Prisma; secret hanya dari environment variables dan schema berubah melalui migration.
3. Konten mengikuti alur draft, preview owner-only, lalu publish. Draft dan archived revision tidak boleh muncul di situs publik.
4. Publikasi memvalidasi payload, mencatat audit log, mengarsipkan revision published sebelumnya, dan melakukan revalidation terbatas.
5. Media disimpan di Vercel Blob melalui route owner-only dengan validasi MIME dan ukuran; token tidak pernah dikirim ke client.

## Visual and Responsive Rules

1. Semua halaman harus mobile-first dan dirancang serta diperiksa pada lebar 375px, 768px, 1024px, dan 1440px.
2. Jangan sekadar mengecilkan layout desktop. Susun ulang hierarchy, navigation, ukuran tipe, spacing, media, dan motion untuk mobile dan tablet.
3. Gunakan design tokens global untuk warna, spacing, typography, border, easing, dan container; hindari nilai acak yang berulang di komponen.
4. Gunakan `next/font` untuk font lokal atau provider yang didukung. Hindari CSS `@import` font eksternal.
5. Gunakan fluid typography dan spacing dengan `clamp()` jika sesuai, sambil menjaga keterbacaan dan hierarchy.
6. Gunakan komponen internal proyek yang reusable bila pola benar-benar berulang, tetapi jangan membuat abstraksi atau UI kit spekulatif.
7. Gunakan SVG buatan sendiri untuk ikon sederhana. Jangan gunakan emoji sebagai ikon antarmuka.
8. Pastikan tidak ada horizontal overflow, teks terlalu kecil, kontrol gepeng, atau layout yang hanya berfungsi saat hover.

## Motion Rules

1. Gunakan CSS atau Tailwind untuk hover dan transisi sederhana; gunakan GSAP untuk timeline, stagger, page transition, SVG, dan scroll choreography.
2. Gunakan `useGSAP()` dari `@gsap/react` dalam Client Component, scope selector ke container, dan pastikan semua animation context dibersihkan saat unmount.
3. Gunakan ScrollTrigger hanya untuk motion yang memperjelas urutan, fokus, atau hubungan antarbagian. Jangan menambahkan animasi dekoratif ke setiap elemen.
4. Gunakan Lenis hanya sebagai progressive enhancement. Anchor link, keyboard navigation, native scrolling, dan halaman tanpa JavaScript harus tetap berfungsi.
5. Sinkronkan Lenis dengan ScrollTrigger jika keduanya aktif dan hentikan Lenis ketika komponen/provider dibersihkan.
6. Gunakan `gsap.matchMedia()` untuk perbedaan motion antar-breakpoint dan `prefers-reduced-motion`.
7. Saat reduced motion aktif, hapus smooth scrolling, parallax, pinning, dan gerakan besar; konten harus langsung terlihat dan tetap lengkap.
8. Utamakan `transform` dan `opacity` atau `autoAlpha`. Hindari menganimasikan `width`, `height`, `top`, atau `left` jika transform dapat menghasilkan efek yang sama.
9. Jangan menyembunyikan konten penting sampai JavaScript selesai. Sediakan keadaan awal dan fallback tanpa JavaScript yang dapat dibaca.
10. Gunakan intro loader sekali per tab dan transisi route publik singkat; selalu sediakan timeout keselamatan dan reduced-motion path agar akses konten tidak tertahan.
11. Rotunda Three.js wajib lazy-loaded, hanya aktif pada desktop fine-pointer, berhenti saat tidak terlihat, dan memiliki fallback HTML/scroll-snap lengkap.

## Next.js Architecture

1. Gunakan Server Component sebagai default. Tambahkan `"use client"` hanya untuk state, event handler, browser API, GSAP, Lenis, atau interaktivitas client-side.
2. Jaga batas Client Component sekecil mungkin dan kirim hanya data serializable dari Server Component.
3. Baca panduan Next.js versi terpasang di `node_modules/next/dist/docs/` sebelum menggunakan API, metadata convention, caching, image, font, atau route behavior.
4. Portofolio publik dan konten statis harus diprerender bila memungkinkan. Jangan menambahkan backend, database, authentication, atau dynamic rendering tanpa kebutuhan produk.
5. Gunakan struktur semantik dan pisahkan data konten dari presentasi agar proyek mudah diperbarui tanpa CMS.

## Images and Performance

1. Gunakan `next/image` dengan dimensi atau aspect ratio yang dicadangkan untuk mencegah layout shift.
2. Prioritaskan hanya gambar LCP yang benar-benar terlihat pada render awal; lazy-load gambar proyek dan media di bawah fold.
3. Gunakan AVIF atau WebP bila sesuai, `sizes` yang akurat, dan resolusi secukupnya. Jangan mengirim aset desktop besar ke mobile tanpa kebutuhan.
4. Lazy-load hanya komponen atau library berat yang tidak diperlukan pada render awal. Jangan lazy-load navigation, hero copy, CTA utama, atau konten above-the-fold.
5. Hindari layout thrashing pada scroll handler, animasi tanpa cleanup, dan penggunaan `will-change` permanen secara berlebihan.
6. Targetkan skor Lighthouse minimal 95 untuk Performance, Accessibility, Best Practices, dan SEO pada production build, tanpa mengorbankan kegunaan nyata demi skor.
7. Verifikasi Core Web Vitals, layout shift, hydration mismatch, dan motion jank menggunakan production build dan throttling yang relevan.

## Accessibility

1. Sediakan skip link, landmark semantik, hierarchy heading yang benar, keyboard navigation, dan focus state yang jelas.
2. Pertahankan rasio kontras minimal 4.5:1 untuk teks biasa dan jangan mengandalkan warna saja untuk menyampaikan informasi.
3. Semua kontrol interaktif harus memiliki accessible name dan area sentuh minimal 44x44px.
4. Slider proyek harus dapat digunakan dengan keyboard, memiliki kontrol prev/next berlabel, status posisi yang dapat dipahami, dan tidak bergantung pada drag.
5. Berikan alt text yang menjelaskan tujuan gambar; gunakan alt kosong untuk gambar dekoratif.
6. Jangan menjadikan hover, pointer presisi, autoplay, atau animasi sebagai satu-satunya cara mengakses konten.
7. Jangan menonaktifkan zoom browser dan hormati safe area pada perangkat mobile.

## SEO and Metadata

1. Gunakan Next.js Metadata API untuk title, description, canonical, Open Graph, dan Twitter card yang sesuai pada setiap halaman.
2. Sediakan `sitemap.ts`, `robots.ts`, favicon, manifest bila dibutuhkan, dan gambar Open Graph yang menggunakan identitas pengguna sendiri.
3. Tambahkan JSON-LD `Person` dan data proyek hanya dari informasi yang telah diberikan serta disetujui pengguna.
4. Jangan menambahkan klaim, skill, pengalaman, klien, statistik, alamat, atau profil sosial yang belum dikonfirmasi pengguna.
5. Gunakan struktur URL dan internal link yang jelas untuk beranda, proyek, tentang, dan kontak jika halaman tersebut memang memiliki konten cukup.

## Code Quality and Verification

1. Gunakan bahasa Inggris untuk nama file, variable, type, class, method, dan function.
2. Sebelum membuat komponen, hook, helper, atau dependency baru, periksa implementasi yang sudah ada dan gunakan solusi paling sederhana yang memenuhi kebutuhan.
3. Dokumentasikan function baru yang memiliki behavior, input, output, atau side effect yang tidak langsung terlihat; jangan menambah komentar untuk kode trivial.
4. Pastikan UI tetap berfungsi tanpa motion, dengan keyboard, dan pada mobile, tablet, serta desktop.
5. Jalankan `npm run lint`, `npx tsc --noEmit`, `npm run build`, dan test relevan untuk perubahan major. Untuk perubahan dokumentasi atau dependency kecil, lakukan verifikasi terarah yang proporsional.
