export type Locale = "id" | "en";

export const copy = {
  id: {
    nav: ["Beranda", "Proyek", "Tentang", "Layanan", "Kontak"],
    navigation: "Navigasi", menuOpen: "Buka menu", menuClose: "Tutup menu", skip: "Lewati ke konten", loading: "Memuat halaman",
    light: "Mode terang", dark: "Mode gelap", language: "Ganti bahasa",
    home: {
      portfolio: "01 / PORTOFOLIO", work: "02 / CARA KERJA", workCopy: "Saya percaya detail kecil menentukan cara sebuah halaman diingat. Struktur yang jelas, tipografi yang berani, dan motion yang punya alasan—semuanya bekerja untuk membuat ide terasa lebih dekat.",
      viewWork: "Lihat karya", start: "Mulai percakapan", selected: "03 / PILIHAN", selectedTitle: "Karya terpilih", selectedDetail: "Beberapa ruang untuk menampilkan proyek, eksperimen, dan cara berpikir Anda. Konten faktualnya siap diganti kapan pun.", allProjects: "Lihat semua proyek",
      ability: "04 / KEMAMPUAN", abilityTitle: "Yang bisa dibangun", about: "05 / TENTANG", aboutTitle: "Membangun produk digital secara menyeluruh.", aboutDetail: "Saya mengembangkan aplikasi web dan mobile dari antarmuka hingga backend, dengan fokus pada fungsi, responsivitas, dan pengalaman yang nyaman digunakan.", knowMore: "Kenali lebih dekat",
    },
    footer: { idea: "Punya ide, brief, atau sekadar ingin bertukar pikiran?", talk: "Mari bicara", contact: "Kontak", privacy: "Privasi & legal", social: "Media sosial" },
    projects: { index: "02 / ARSIP", title: "Semua proyek", detail: "Kumpulan karya yang menjelaskan cara Anda berpikir, membangun, dan menyelesaikan masalah.", selected: "PROYEK PILIHAN", space: "Ruang karya", drag: "Geser untuk menjelajahi proyek", archive: "ARSIP LENGKAP", all: "Semua karya", read: "Baca case study" },
    about: { index: "03 / PROFIL", title: "Tentang Saya", detail: "Perjalanan, prinsip, dan cara saya membangun produk digital.", approach: "Pendekatan", heading: "Bangun dari konteks, bukan dari template.", body: "Saya mengembangkan aplikasi web dan mobile dari antarmuka hingga backend, dengan fokus pada fungsi, responsivitas, dan pengalaman yang nyaman digunakan.", clarity: "Jelas sebelum ramai", clarityText: "Struktur dan hierarki harus bekerja sebelum motion ditambahkan.", detailTitle: "Detail yang terasa", detailText: "Rasa visual tumbuh dari keputusan kecil yang konsisten.", tech: "Teknologi sebagai alat", techText: "Tools dipilih untuk melayani ide dan pengalaman.", certificateTitle: "Sertifikat & kredensial", certificateDetail: "Pembelajaran dan kompetensi yang mendukung cara saya membangun produk digital.", allCertificates: "Lihat semua sertifikat" },
    certificates: { index: "06 / KREDENSIAL", title: "Semua sertifikat", detail: "Arsip pembelajaran dan kompetensi yang telah saya selesaikan.", open: "Buka sertifikat" },
    services: { index: "04 / LAYANAN", title: "Cara berkolaborasi", detail: "Layanan pengembangan web dan mobile yang dapat disesuaikan dengan kebutuhan produk Anda.", note: "Cakupan, hasil akhir, dan proses disepakati bersama melalui brief." },
    contact: { index: "05 / KONTAK", title: "Mari mulai percakapan", detail: "Ceritakan ide atau kebutuhan produk Anda melalui email atau formulir berikut.", name: "Nama", namePlaceholder: "Nama Anda…", message: "Ceritakan singkat", messagePlaceholder: "Apa yang ingin Anda bangun?…", send: "Kirim via email", pending: "Tombol ini akan membuka aplikasi email Anda dengan pesan yang sudah disiapkan." },
  },
  en: {
    nav: ["Home", "Projects", "About", "Services", "Contact"],
    navigation: "Navigation", menuOpen: "Open menu", menuClose: "Close menu", skip: "Skip to content", loading: "Loading page",
    light: "Light mode", dark: "Dark mode", language: "Change language",
    home: {
      portfolio: "01 / PORTFOLIO", work: "02 / APPROACH", workCopy: "I believe small details shape how a page is remembered. Clear structure, bold typography, and purposeful motion work together to bring ideas closer.",
      viewWork: "View work", start: "Start a conversation", selected: "03 / SELECTED", selectedTitle: "Selected work", selectedDetail: "A selection of projects and experiments that reflects how I think, build, and solve problems.", allProjects: "View all projects",
      ability: "04 / CAPABILITIES", abilityTitle: "What I can build", about: "05 / ABOUT", aboutTitle: "Building digital products end to end.", aboutDetail: "I develop web and mobile applications from interface to backend, focusing on function, responsiveness, and an effortless user experience.", knowMore: "Learn more",
    },
    footer: { idea: "Have an idea, a brief, or simply want to exchange thoughts?", talk: "Let's talk", contact: "Contact", privacy: "Privacy & legal", social: "Social media" },
    projects: { index: "02 / ARCHIVE", title: "All projects", detail: "A collection of work that reflects how I think, build, and solve problems.", selected: "SELECTED PROJECTS", space: "Project space", drag: "Swipe to explore projects", archive: "FULL ARCHIVE", all: "All work", read: "Read case study" },
    about: { index: "03 / PROFILE", title: "About Me", detail: "My journey, principles, and approach to building digital products.", approach: "Approach", heading: "Build from context, not from templates.", body: "I develop web and mobile applications from interface to backend, focusing on function, responsiveness, and an effortless user experience.", clarity: "Clarity before noise", clarityText: "Structure and hierarchy must work before motion is introduced.", detailTitle: "Details you can feel", detailText: "Visual character grows from small, consistent decisions.", tech: "Technology as a tool", techText: "Tools are selected to serve the idea and the experience.", certificateTitle: "Certificates & credentials", certificateDetail: "Learning and competencies that support how I build digital products.", allCertificates: "View all certificates" },
    certificates: { index: "06 / CREDENTIALS", title: "All certificates", detail: "An archive of learning and competencies I have completed.", open: "Open certificate" },
    services: { index: "04 / SERVICES", title: "Ways to collaborate", detail: "Web and mobile development services tailored to your product needs.", note: "Scope, deliverables, and process are agreed together through a brief." },
    contact: { index: "05 / CONTACT", title: "Let's start a conversation", detail: "Share your idea or product needs through email or the form below.", name: "Name", namePlaceholder: "Your name…", message: "Tell me briefly", messagePlaceholder: "What would you like to build?…", send: "Send via email", pending: "This button opens your email app with the message already prepared." },
  },
} as const;
