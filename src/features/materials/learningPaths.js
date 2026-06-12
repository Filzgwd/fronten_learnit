export const learningPaths = {
  algoritma: {
    title: "Algoritma Pemrograman",
    desc: "Mempelajari logika, alur, dan dasar pembuatan program.",
    image: "/assets/img/f.jpeg",
  },
  website: {
    title: "Pengembangan Website",
    desc: "Membangun dan mendesain aplikasi berbasis web dan mobile.",
    image: "/assets/img/a.jpeg",
  },
  ai: {
    title: "Kecerdasan Buatan",
    desc: "Mengenal AI dan Teknik Pengolahan serta analisa data.",
    image: "/assets/img/d.jpeg",
  },
  uiux: {
    title: "Desain UI / UX",
    desc: "Memahami konsep, komunikasi, dan desain digital.",
    image: "/assets/img/c.jpeg",
  },
  mobile: {
    title: "Pemrograman Mobile",
    desc: "Membuat Aplikasi Mobile Android dan iOS Modern.",
    image: "/assets/img/b.jpeg",
  },
};

export const landingFields = [
  ["f.jpeg", "Pengembangan Website"],
  ["d.jpeg", "Kecerdasan Buatan"],
  ["c.jpeg", "UI / UX"],
  ["b.jpeg", "Mobile Programming"],
  ["a.jpeg", "Pemrograman"],
];

export const learningPathsLanding = [
  { title: "Algoritma & Pemrograman", image: "/assets/img/f.jpeg", pathKey: "algoritma" },
  { title: "Pengembangan Website", image: "/assets/img/a.jpeg", pathKey: "website" },
  { title: "Desain UI/UX", image: "/assets/img/c.jpeg", pathKey: "uiux" },
  { title: "Kecerdasan Buatan", image: "/assets/img/d.jpeg", pathKey: "ai" },
  { title: "Pemrograman Mobile", image: "/assets/img/b.jpeg", pathKey: "mobile" },
];

export const defaultMaterials = [
  {
    id: 1,
    title: "Pengertian Algoritma Pemrograman",
    desc: "dasar dasar algoritma",
    path: "algoritma",
    content:
      "Algoritma pemrograman adalah langkah-langkah logis dan terstruktur untuk menyelesaikan suatu masalah. Dalam pemrograman, algoritma menjadi dasar sebelum menulis kode agar program berjalan efisien dan mudah dipahami.",
  },
  {
    id: 2,
    title: "Fungsi Algoritma Pemrograman",
    desc: "dasar dasar algoritma",
    path: "algoritma",
    content:
      "Algoritma berfungsi untuk memecahkan masalah secara sistematis, membantu programmer merancang solusi, dan memastikan program dapat diuji, dioptimalkan, serta dikembangkan lebih lanjut.",
  },
  {
    id: 3,
    title: "Pengenalan Website",
    desc: "Belajar mengenal dasar website dan cara kerjanya",
    path: "website",
    image: "/assets/img/material/intro_website.png",
  },
  {
    id: 4,
    title: "Dasar HTML",
    desc: "Belajar membuat struktur konten website dengan HTML",
    path: "website",
    image: "/assets/img/material/html_dasar.png",
  },
  {
    id: 5,
    title: "Dasar CSS",
    desc: "Memberi warna, ukuran, dan layout pada elemen HTML",
    path: "website",
    image: "/assets/img/material/css_dasar.png",
  },
  {
    id: 6,
    title: "Dasar Javascript",
    desc: "Membuat website lebih hidup dengan Javascript",
    path: "website",
    image: "/assets/img/material/js_dasar.png",
  },
  {
    id: 7,
    title: "Front End Development",
    desc: "Mengatur tata letak website secara modern agar lebih rapi",
    path: "website",
    image: "/assets/img/material/frontend_dev.png",
  },
  {
    id: 8,
    title: "Back End Development",
    desc: "Membangun sistem di balik layar agar website dapat berjalan baik",
    path: "website",
    image: "/assets/img/material/backend_dev.png",
  },
  { id: 9, title: "Konsep UI/UX", desc: "desain antarmuka", path: "uiux" },
  { id: 10, title: "Pengenalan AI", desc: "dasar kecerdasan buatan", path: "ai" },
  { id: 11, title: "Flutter Dasar", desc: "dasar aplikasi mobile", path: "mobile" },
];
