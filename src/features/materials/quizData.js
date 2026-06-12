// Default quiz questions per learning path
// Admin can override these via admin/quiz page (saved to localStorage)
export const QUIZ_STORAGE_KEY = "adminQuizData";
export const QUIZ_SCORE_KEY = "quizScores";

export const defaultQuizData = {
  algoritma: {
    title: "Algoritma & Pemrograman",
    duration: 10, // minutes
    questions: [
      {
        id: 1,
        text: "Apa yang dimaksud dengan algoritma?",
        options: [
          { id: "A", text: "Bahasa pemrograman", isCorrect: false },
          { id: "B", text: "Langkah-langkah logis untuk menyelesaikan masalah", isCorrect: true },
          { id: "C", text: "Komputer digital", isCorrect: false },
          { id: "D", text: "Sistem operasi", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "Struktur algoritma yang digunakan untuk memilih kondisi tertentu disebut?",
        options: [
          { id: "A", text: "Sequence", isCorrect: false },
          { id: "B", text: "Selection", isCorrect: true },
          { id: "C", text: "Repetition", isCorrect: false },
          { id: "D", text: "Function", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Flowchart menggunakan simbol oval untuk menggambarkan?",
        options: [
          { id: "A", text: "Proses", isCorrect: false },
          { id: "B", text: "Keputusan", isCorrect: false },
          { id: "C", text: "Mulai/Selesai", isCorrect: true },
          { id: "D", text: "Input/Output", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Variabel dalam pemrograman digunakan untuk?",
        options: [
          { id: "A", text: "Menghapus data", isCorrect: false },
          { id: "B", text: "Menyimpan data sementara", isCorrect: true },
          { id: "C", text: "Membuat tampilan", isCorrect: false },
          { id: "D", text: "Menghubungkan internet", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "Perulangan dalam algoritma digunakan untuk?",
        options: [
          { id: "A", text: "Menghentikan program", isCorrect: false },
          { id: "B", text: "Mengulang proses tertentu", isCorrect: true },
          { id: "C", text: "Menghapus data", isCorrect: false },
          { id: "D", text: "Menampilkan error", isCorrect: false },
        ],
      },
    ],
  },
  website: {
    title: "Pengembangan Website",
    duration: 10,
    questions: [
      {
        id: 1,
        text: "HTML singkatan dari?",
        options: [
          { id: "A", text: "Hyper Text Markup Language", isCorrect: true },
          { id: "B", text: "High Tech Modern Language", isCorrect: false },
          { id: "C", text: "Home Tool Markup Language", isCorrect: false },
          { id: "D", text: "Hyperlink Text Machine Language", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "CSS digunakan untuk?",
        options: [
          { id: "A", text: "Membuat logika program", isCorrect: false },
          { id: "B", text: "Menyimpan database", isCorrect: false },
          { id: "C", text: "Mengatur tampilan/style halaman web", isCorrect: true },
          { id: "D", text: "Mengelola server", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Tag HTML yang digunakan untuk membuat judul terbesar adalah?",
        options: [
          { id: "A", text: "<h6>", isCorrect: false },
          { id: "B", text: "<header>", isCorrect: false },
          { id: "C", text: "<h1>", isCorrect: true },
          { id: "D", text: "<title>", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "JavaScript digunakan dalam pengembangan website untuk?",
        options: [
          { id: "A", text: "Mengatur tampilan warna", isCorrect: false },
          { id: "B", text: "Memberikan interaktivitas pada halaman web", isCorrect: true },
          { id: "C", text: "Membuat struktur halaman", isCorrect: false },
          { id: "D", text: "Menyimpan gambar", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "Front End Development berfokus pada?",
        options: [
          { id: "A", text: "Pengelolaan database", isCorrect: false },
          { id: "B", text: "Keamanan server", isCorrect: false },
          { id: "C", text: "Tampilan yang dilihat pengguna", isCorrect: true },
          { id: "D", text: "Konfigurasi hosting", isCorrect: false },
        ],
      },
    ],
  },
  uiux: {
    title: "Desain UI/UX",
    duration: 10,
    questions: [
      {
        id: 1,
        text: "UX singkatan dari?",
        options: [
          { id: "A", text: "User Experience", isCorrect: true },
          { id: "B", text: "User Expansion", isCorrect: false },
          { id: "C", text: "Unified Exchange", isCorrect: false },
          { id: "D", text: "Ultra Extension", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "Wireframe dalam desain UI/UX digunakan untuk?",
        options: [
          { id: "A", text: "Menulis kode program", isCorrect: false },
          { id: "B", text: "Membuat kerangka tampilan awal", isCorrect: true },
          { id: "C", text: "Mengetes performa aplikasi", isCorrect: false },
          { id: "D", text: "Menyimpan data pengguna", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Prinsip desain yang membuat elemen penting lebih menonjol disebut?",
        options: [
          { id: "A", text: "Konsistensi", isCorrect: false },
          { id: "B", text: "Proximity", isCorrect: false },
          { id: "C", text: "Hierarki Visual", isCorrect: true },
          { id: "D", text: "Alignment", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Prototipe dalam desain berguna untuk?",
        options: [
          { id: "A", text: "Langsung merilis produk", isCorrect: false },
          { id: "B", text: "Menguji alur sebelum dikembangkan", isCorrect: true },
          { id: "C", text: "Menulis dokumentasi", isCorrect: false },
          { id: "D", text: "Mengoptimasi database", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "Warna yang sering digunakan sebagai call-to-action karena menarik perhatian adalah?",
        options: [
          { id: "A", text: "Abu-abu", isCorrect: false },
          { id: "B", text: "Putih", isCorrect: false },
          { id: "C", text: "Hitam", isCorrect: false },
          { id: "D", text: "Warna kontras/terang seperti biru atau orange", isCorrect: true },
        ],
      },
    ],
  },
  ai: {
    title: "Kecerdasan Buatan",
    duration: 10,
    questions: [
      {
        id: 1,
        text: "AI singkatan dari?",
        options: [
          { id: "A", text: "Automated Interface", isCorrect: false },
          { id: "B", text: "Artificial Intelligence", isCorrect: true },
          { id: "C", text: "Advanced Integration", isCorrect: false },
          { id: "D", text: "Analytical Input", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "Machine Learning adalah?",
        options: [
          { id: "A", text: "Mesin yang bisa berjalan sendiri", isCorrect: false },
          { id: "B", text: "Cara komputer belajar dari data tanpa diprogram eksplisit", isCorrect: true },
          { id: "C", text: "Perangkat keras baru", isCorrect: false },
          { id: "D", text: "Bahasa pemrograman AI", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Neural Network terinspirasi dari?",
        options: [
          { id: "A", text: "Jaringan internet", isCorrect: false },
          { id: "B", text: "Struktur jaringan syaraf otak manusia", isCorrect: true },
          { id: "C", text: "Jaringan komputer", isCorrect: false },
          { id: "D", text: "Algoritma sorting", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Supervised Learning menggunakan data yang?",
        options: [
          { id: "A", text: "Tidak berlabel", isCorrect: false },
          { id: "B", text: "Sudah berlabel/diberi label", isCorrect: true },
          { id: "C", text: "Dienkripsi", isCorrect: false },
          { id: "D", text: "Diacak", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "Chatbot merupakan contoh aplikasi dari?",
        options: [
          { id: "A", text: "Augmented Reality", isCorrect: false },
          { id: "B", text: "Blockchain", isCorrect: false },
          { id: "C", text: "Natural Language Processing (NLP)", isCorrect: true },
          { id: "D", text: "IoT", isCorrect: false },
        ],
      },
    ],
  },
  mobile: {
    title: "Pemrograman Mobile",
    duration: 10,
    questions: [
      {
        id: 1,
        text: "Flutter dikembangkan oleh?",
        options: [
          { id: "A", text: "Microsoft", isCorrect: false },
          { id: "B", text: "Apple", isCorrect: false },
          { id: "C", text: "Google", isCorrect: true },
          { id: "D", text: "Facebook", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "Bahasa pemrograman yang digunakan Flutter adalah?",
        options: [
          { id: "A", text: "Kotlin", isCorrect: false },
          { id: "B", text: "Swift", isCorrect: false },
          { id: "C", text: "Dart", isCorrect: true },
          { id: "D", text: "JavaScript", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Aplikasi mobile yang bisa berjalan di iOS dan Android menggunakan satu codebase disebut?",
        options: [
          { id: "A", text: "Native App", isCorrect: false },
          { id: "B", text: "Cross-Platform App", isCorrect: true },
          { id: "C", text: "Web App", isCorrect: false },
          { id: "D", text: "Desktop App", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Widget di Flutter digunakan untuk?",
        options: [
          { id: "A", text: "Menyimpan database", isCorrect: false },
          { id: "B", text: "Membangun tampilan UI", isCorrect: true },
          { id: "C", text: "Mengatur jaringan", isCorrect: false },
          { id: "D", text: "Membuat API", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "SDK singkatan dari?",
        options: [
          { id: "A", text: "Software Development Kit", isCorrect: true },
          { id: "B", text: "System Debug Key", isCorrect: false },
          { id: "C", text: "Secure Data Keeper", isCorrect: false },
          { id: "D", text: "Standard Design Kernel", isCorrect: false },
        ],
      },
    ],
  },
};

export function getQuizForPath(pathKey) {
  try {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data[pathKey]) return data[pathKey];
    }
  } catch {
    // ignore
  }
  return defaultQuizData[pathKey] || null;
}

// Legacy key kept for fallback if needed

// Helper to get user ID
function getCurrentUserId() {
  try {
    const localUser = JSON.parse(localStorage.getItem("localCurrentUser"));
    if (localUser?.id) return localUser.id;
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id || payload?.sub) return String(payload.id || payload.sub);
    }
  } catch {
    // ignore
  }
  return "guest";
}

function getQuizScoreKey() {
  return `quizScores_${getCurrentUserId()}`;
}

export function saveQuizScore(pathKey, score, answers = null) {
  try {
    const key = getQuizScoreKey();
    const existing = JSON.parse(localStorage.getItem(key) || "{}");
    existing[pathKey] = { score, date: new Date().toISOString(), answers };
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function getQuizScores() {
  try {
    const key = getQuizScoreKey();
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}
