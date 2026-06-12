import { useState, useEffect } from "react";
import { QUIZ_STORAGE_KEY } from "../../features/materials/quizData";

const initialQuestion = {
  text: "",
  options: [
    { id: 1, text: "", isCorrect: true },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ],
};

const initialQuiz = {
  title: "",
  material: "",
  pathKey: "",
  duration: "",
  questions: [initialQuestion],
  status: "Aktif",
};

const relatedMaterials = [
  { label: "Pengembangan Website", pathKey: "website" },
  { label: "Desain UI/UX", pathKey: "uiux" },
  { label: "Algoritma & Pemrograman", pathKey: "algoritma" },
  { label: "Pemrograman Mobile", pathKey: "mobile" },
  { label: "Kecerdasan Buatan", pathKey: "ai" },
];

const getPathKeyFromMaterial = (material) => {
  const found = relatedMaterials.find((item) => item.label === material);
  return found ? found.pathKey : "";
};

const INITIAL_QUIZ_LIST = [
  {
    id: 1,
    title: "Quiz Pengembangan Website",
    material: "Pengembangan Website",
    pathKey: "website",
    duration: "15",
    status: "Aktif",
    questions: [
      {
        text: "Apa yang dimaksud dengan HTML?",
        options: [
          { id: 1, text: "Bahasa pemrograman", isCorrect: false },
          { id: 2, text: "Struktur konten web", isCorrect: true },
          { id: 3, text: "Database website", isCorrect: false },
          { id: 4, text: "Server web", isCorrect: false },
        ],
      },
    ],
  },
];

const loadStoredQuizzes = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) || "null");
    if (Array.isArray(stored)) {
      return stored;
    }

    if (stored && typeof stored === "object") {
      return Object.entries(stored).map(([pathKey, quiz], index) => ({
        ...quiz,
        pathKey,
        material:
          relatedMaterials.find((item) => item.pathKey === pathKey)?.label ||
          quiz.material ||
          "",
        id: quiz.id ?? Date.now() + index,
        status: quiz.status || "Aktif",
      }));
    }
  } catch {
    // ignore
  }

  return INITIAL_QUIZ_LIST;
};

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState(loadStoredQuizzes);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(initialQuiz);

  useEffect(() => {
    const payload = {};
    quizzes.forEach((quiz) => {
      if (quiz.pathKey) {
        payload[quiz.pathKey] = {
          title: quiz.title,
          duration: quiz.duration,
          questions: quiz.questions,
        };
      }
    });
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
  }, [quizzes]);

  const openAddModal = () => {
    setCurrentQuiz(initialQuiz);
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (quiz) => {
    setCurrentQuiz({
      ...quiz,
      pathKey: quiz.pathKey || getPathKeyFromMaterial(quiz.material),
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentQuiz(initialQuiz);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setCurrentQuiz((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, value) => {
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, idx) =>
        idx === index ? { ...question, text: value } : question
      ),
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIdx) =>
        qIdx === questionIndex
          ? {
              ...question,
              options: question.options.map((option, oIdx) =>
                oIdx === optionIndex ? { ...option, text: value } : option
              ),
            }
          : question
      ),
    }));
  };

  const handleCorrectAnswer = (questionIndex, optionIndex) => {
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIdx) =>
        qIdx === questionIndex
          ? {
              ...question,
              options: question.options.map((option, oIdx) => ({
                ...option,
                isCorrect: oIdx === optionIndex,
              })),
            }
          : question
      ),
    }));
  };

  const handleAddQuestion = () => {
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, initialQuestion],
    }));
  };

  const handleRemoveQuestion = (index) => {
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== index),
    }));
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  };

  const handleSaveQuiz = (event) => {
    event.preventDefault();
    const pathKey = getPathKeyFromMaterial(currentQuiz.material);
    const quizPayload = {
      ...currentQuiz,
      pathKey,
      duration: currentQuiz.duration,
      questions: currentQuiz.questions,
      status: currentQuiz.status || "Aktif",
    };

    if (isEditing) {
      setQuizzes((prev) =>
        prev.map((quiz) => (quiz.id === currentQuiz.id ? quizPayload : quiz))
      );
    } else {
      setQuizzes((prev) => [
        ...prev,
        { ...quizPayload, id: Date.now(), status: "Aktif" },
      ]);
    }

    closeModal();
  };

  return (
    <section>
      {modalOpen ? (
        // Full Screen Form Mode
        <div style={{ width: "100%", padding: "0", backgroundColor: "transparent" }}>
          <div className="tambah-materi-container" style={{ maxWidth: "100%", margin: "0" }}>
            <div className="topbar" style={{ marginBottom: "24px" }}>
              <div className="topbar-left">
                <h1>{isEditing ? "Edit Kuis" : "Tambah Kuis"}</h1>
                <p>{isEditing ? "Perbarui informasi kuis dan soal-soalnya" : "Kelola platform pembelajaran Anda"}</p>
              </div>
            </div>

            <form onSubmit={handleSaveQuiz} className="tambah-materi-card">
              <div className="form-grid-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Nama Kuis</label>
                  <input
                    type="text"
                    value={currentQuiz.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Nama Materi"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Topik (Alur Pembelajaran)</label>
                  <select
                    value={currentQuiz.material}
                    onChange={(e) => handleChange("material", e.target.value)}
                    required
                    style={{ cursor: "pointer", color: currentQuiz.material ? "#111827" : "#9ca3af" }}
                  >
                    <option value="" disabled>Pilih Topik</option>
                    {relatedMaterials.map((material) => (
                      <option key={material.pathKey} value={material.label}>
                        {material.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Jumlah Soal</label>
                  <input
                    type="number"
                    value={currentQuiz.questions.length}
                    readOnly
                    style={{ backgroundColor: "#f9fafb" }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Durasi Menit</label>
                  <input
                    type="number"
                    value={currentQuiz.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="Durasi (menit)"
                    required
                  />
                </div>
              </div>

              <div className="konten-materi-header">
                <h3>Daftar Soal</h3>
                <button type="button" className="btn-tambah-blok" onClick={handleAddQuestion}>
                  <i className="fa-solid fa-plus"></i> Tambah Soal
                </button>
              </div>

              <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "10px", marginBottom: "24px" }}>
                {currentQuiz.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="block-card">
                    <div className="block-header">
                      <h4>Soal {questionIndex + 1}</h4>
                      <button
                        type="button"
                        className="btn-hapus-blok"
                        onClick={() => handleRemoveQuestion(questionIndex)}
                        disabled={currentQuiz.questions.length === 1}
                      >
                        Hapus Blok
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Pertanyaan</label>
                      <textarea
                        value={question.text}
                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                        placeholder="Pertanyaan"
                        required
                        style={{ minHeight: "80px" }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Jawaban A</label>
                      <input
                        type="text"
                        value={question.options[0].text}
                        onChange={(e) => handleOptionChange(questionIndex, 0, e.target.value)}
                        placeholder="Jawaban A"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Jawaban B</label>
                      <input
                        type="text"
                        value={question.options[1].text}
                        onChange={(e) => handleOptionChange(questionIndex, 1, e.target.value)}
                        placeholder="Jawaban B"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Jawaban C</label>
                      <input
                        type="text"
                        value={question.options[2].text}
                        onChange={(e) => handleOptionChange(questionIndex, 2, e.target.value)}
                        placeholder="Jawaban C"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Jawaban D</label>
                      <input
                        type="text"
                        value={question.options[3].text}
                        onChange={(e) => handleOptionChange(questionIndex, 3, e.target.value)}
                        placeholder="Jawaban D"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Kunci Jawaban</label>
                      <select
                        value={question.options.findIndex((option) => option.isCorrect)}
                        onChange={(e) => handleCorrectAnswer(questionIndex, Number(e.target.value))}
                        style={{ cursor: "pointer" }}
                      >
                        {question.options.map((option, optionIndex) => (
                          <option key={option.id} value={optionIndex}>
                            Jawaban {String.fromCharCode(65 + optionIndex)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" className="btn-batal" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn-simpan">
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // List View Mode
        <>
          <div className="topbar">
            <div className="topbar-left">
              <h1>Kelola Quiz</h1>
              <p>Atur quiz dan soal-soal pembelajaran</p>
            </div>
          </div>

          <section className="section-card--no-bg">
            <div className="section-header">
              <div>
                <h2>Kelola Quiz</h2>
              </div>
              <button className="btn btn-primary" onClick={openAddModal}>
                + Tambah Quiz
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Quiz</th>
                    <th>Materi Terkait</th>
                    <th>Jumlah Soal</th>
                    <th>Durasi (Menit)</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>{quiz.title}</td>
                      <td>{quiz.material}</td>
                      <td>{quiz.questions.length}</td>
                      <td>{quiz.duration}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            quiz.status === "Aktif" ? "status-active" : "status-inactive"
                          }`}
                        >
                          {quiz.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button className="action-btn edit" onClick={() => openEditModal(quiz)}>
                          Edit
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteQuiz(quiz.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
