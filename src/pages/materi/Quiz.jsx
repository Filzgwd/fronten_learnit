import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { MaterialProvider } from "../../features/materials/materialContext";
import { learningPaths } from "../../features/materials/learningPaths";
import { quizApi } from "../../features/materials/quizApi";
import { useAuth } from "../../features/auth/authContext";

const OPTION_LABELS = ["A", "B", "C", "D"];

const pathKeyToTopic = {
  algoritma: "Algoritma & Pemrograman",
  website: "Pengembangan Website",
  uiux: "Desain UI/UX",
  ai: "Kecerdasan Buatan",
  mobile: "Pemrograman Mobile",
};

function QuizContent() {
  const { pathKey } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const config = learningPaths[pathKey];
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState("quiz"); // "quiz" | "result" | "review"
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await quizApi.getAll();
        if (res.data && Array.isArray(res.data)) {
          const targetTopic = pathKeyToTopic[pathKey];
          const found = res.data.find((q) => q.category_name === targetTopic);
          if (found) {
            const mappedQuiz = {
              id: found.id,
              title: found.title,
              duration: found.duration || 10,
              questions: (found.questions || []).map((q) => ({
                id: q.id,
                text: q.question,
                options: (q.options || []).map((o) => ({
                  id: o.id,
                  text: o.option_text,
                  isCorrect: o.is_correct,
                })),
              })),
            };
            setQuizData(mappedQuiz);
            setTimeLeft((found.duration || 10) * 60);
          }
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [pathKey]);

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  // Timer countdown
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitted || !quizData) return;
      setSubmitted(true);

      const formattedAnswers = Object.entries(answers).map(([qId, optId]) => ({
        question_id: qId,
        selected_option_ids: [optId],
      }));

      try {
        const res = await quizApi.submitQuiz({
          quiz_id: quizData.id,
          answers: formattedAnswers,
        });

        if (res.data && typeof res.data.score === "number") {
          setScore(res.data.score);
        } else {
          const questions = quizData.questions || [];
          let correct = 0;
          questions.forEach((q) => {
            const chosen = answers[q.id];
            const correctOption = q.options.find((o) => o.isCorrect);
            if (chosen && correctOption && chosen === correctOption.id) {
              correct++;
            }
          });

          const finalScore =
            questions.length > 0
              ? Math.round((correct / questions.length) * 100)
              : 0;
          setScore(finalScore);
        }
        setPhase("result");
      } catch (err) {
        console.error("Error submitting quiz:", err);
        alert("Gagal mengirim jawaban: " + err.message);
        setSubmitted(false);
      }
    },
    [submitted, quizData, answers]
  );

  useEffect(() => {
    if (submitted || phase === "result" || loading || !quizData) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted, phase, handleSubmit, loading, quizData]);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner" style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
          <p style={{ color: "#64748b", fontSize: "16px", fontWeight: "500" }}>Memuat kuis...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!config || !quizData) {
    return (
      <main className="not-found">
        <h1>Quiz tidak ditemukan</h1>
        <p>Quiz untuk learning path ini belum tersedia.</p>
        <Link to={`/materi/${pathKey}`}>Kembali ke Materi</Link>
      </main>
    );
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const selectAnswer = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // ── RESULT PHASE ─────────────────────────────────────────────
  if (phase === "result") {
    const passed = score >= 70;
    return (
      <div className="dashboard-container" style={{ display: "block" }}>
        <main className="main-content quiz-main" style={{ marginLeft: 0, margin: "0 auto", maxWidth: "900px", float: "none" }}>
          <div className="topbar" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <h1>{config.title}</h1>
            <p>Jawab {quizData.questions.length} pertanyaan berdasarkan materi yang sudah dipelajari.</p>
          </div>

          <div className="quiz-container-inner">
            <div className="quiz-result-card">
              <div className={`quiz-result-score ${passed ? "passed" : "failed"}`}>
                {score} / 100
              </div>
              <p className="quiz-result-status">
                Status: <strong>{passed ? "Lulus " : "Belum Lulus"}</strong>
              </p>
              <p className="quiz-result-message">
                {passed
                  ? "Selamat! Kamu berhasil menguasai materi ini."
                  : "Jangan menyerah! Pelajari kembali materinya dan coba lagi."}
              </p>
              <div className="quiz-result-actions" style={{ flexDirection: "column", width: "100%" }}>
                <button
                  className="quiz-btn-primary"
                  onClick={() => navigate("/nilai")}
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "16px" }}
                >
                  Kembali ke Daftar Nilai
                </button>
                <button
                  className="quiz-btn-secondary"
                  onClick={() => setPhase("review")}
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "16px" }}
                >
                  Lihat Review Soal
                </button>
              </div>
            </div>
          </div>

          {/* Review Full Page */}
          {phase === "review" && (
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 }}>Review Jawaban</h2>
                <button onClick={() => setPhase("result")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "24px", fontWeight: "bold" }}>
                  ✕
                </button>
              </div>

              <div className="quiz-questions-list">
                {quizData.questions.map((question, qIdx) => {
                  const chosenOptionId = answers[question.id];
                  const correctOption = question.options.find(o => o.isCorrect);
                  const isCorrect = chosenOptionId === correctOption?.id;

                  return (
                    <div key={question.id} className="quiz-question-card" style={{ borderColor: isCorrect ? "#34d399" : "#f87171", borderWidth: "2px", borderStyle: "solid", marginBottom: "16px", padding: "16px", borderRadius: "12px", textAlign: "left" }}>
                      <p className="quiz-question-text" style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#374151" }}>
                        {qIdx + 1}. {question.text}
                        <span style={{ marginLeft: "12px", color: isCorrect ? "#10b981" : "#ef4444", fontWeight: "bold", fontSize: "14px", display: "inline-block" }}>
                          {isCorrect ? " Benar" : " Salah"}
                        </span>
                      </p>
                      <div className="quiz-options" style={{ pointerEvents: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {question.options.map((option, oIdx) => {
                          const isSelected = chosenOptionId === option.id;
                          const isActuallyCorrect = option.isCorrect;

                          let bg = "transparent";
                          if (isActuallyCorrect) bg = "#d1fae5";
                          else if (isSelected && !isActuallyCorrect) bg = "#fee2e2";

                          return (
                            <label
                              key={option.id}
                              style={{
                                display: "flex", alignItems: "center", padding: "12px", borderRadius: "8px", border: "1px solid",
                                background: bg,
                                opacity: (isSelected || isActuallyCorrect) ? 1 : 0.6,
                                borderColor: (isSelected || isActuallyCorrect) ? "transparent" : "#e5e7eb",
                                margin: "0"
                              }}
                            >
                              <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", borderColor: isActuallyCorrect ? "#10b981" : isSelected ? "#ef4444" : "#d1d5db" }}>
                                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: isActuallyCorrect ? "#10b981" : isSelected ? "#ef4444" : "transparent" }} />
                              </span>
                              <span style={{ color: isActuallyCorrect ? "#065f46" : isSelected ? "#991b1b" : "#4b5563", fontWeight: isActuallyCorrect ? "600" : "normal" }}>
                                {OPTION_LABELS[oIdx]}. {option.text}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "center" }}>
                <button
                  className="quiz-btn-primary"
                  onClick={() => setPhase("result")}
                  style={{ padding: "12px 24px", fontSize: "16px" }}
                >
                  Kembali ke Hasil
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── REVIEW PHASE ───────────────────────────────────────────
  if (phase === "review") {
    return (
      <div className="dashboard-container" style={{ display: "block" }}>
        <main className="main-content quiz-main" style={{ marginLeft: 0, margin: "0 auto", maxWidth: "900px", float: "none" }}>
          <div className="topbar" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <h1>{config.title}</h1>
            <p>Lihat detail jawaban Anda di bawah ini.</p>
          </div>

          <div className="quiz-container-inner">
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>Review Jawaban</h2>

            <div className="quiz-questions-list">
              {quizData.questions.map((question, qIdx) => {
                const chosenOptionId = answers[question.id];
                const correctOption = question.options.find(o => o.isCorrect);
                const isCorrect = chosenOptionId === correctOption?.id;

                return (
                  <div key={question.id} className="quiz-question-card" style={{ borderColor: isCorrect ? "#34d399" : "#f87171", borderWidth: "2px", borderStyle: "solid", marginBottom: "16px", padding: "16px", borderRadius: "12px", textAlign: "left" }}>
                    <p className="quiz-question-text" style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#374151" }}>
                      {qIdx + 1}. {question.text}
                      <span style={{ marginLeft: "12px", color: isCorrect ? "#10b981" : "#ef4444", fontWeight: "bold", fontSize: "14px", display: "inline-block" }}>
                        {isCorrect ? " Benar" : " Salah"}
                      </span>
                    </p>
                    <div className="quiz-options" style={{ pointerEvents: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {question.options.map((option, oIdx) => {
                        const isSelected = chosenOptionId === option.id;
                        const isActuallyCorrect = option.isCorrect;

                        let bg = "transparent";
                        if (isActuallyCorrect) bg = "#d1fae5";
                        else if (isSelected && !isActuallyCorrect) bg = "#fee2e2";

                        return (
                          <label
                            key={option.id}
                            style={{
                              display: "flex", alignItems: "center", padding: "12px", borderRadius: "8px", border: "1px solid",
                              background: bg,
                              opacity: (isSelected || isActuallyCorrect) ? 1 : 0.6,
                              borderColor: (isSelected || isActuallyCorrect) ? "transparent" : "#e5e7eb",
                              margin: "0"
                            }}
                          >
                            <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", borderColor: isActuallyCorrect ? "#10b981" : isSelected ? "#ef4444" : "#d1d5db" }}>
                              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: isActuallyCorrect ? "#10b981" : isSelected ? "#ef4444" : "transparent" }} />
                            </span>
                            <span style={{ color: isActuallyCorrect ? "#065f46" : isSelected ? "#991b1b" : "#4b5563", fontWeight: isActuallyCorrect ? "600" : "normal" }}>
                              {OPTION_LABELS[oIdx]}. {option.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "center" }}>
              <button
                className="quiz-btn-secondary"
                onClick={() => setPhase("result")}
                style={{ padding: "12px 24px", fontSize: "16px" }}
              >
                Kembali ke Hasil
              </button>
              <button
                className="quiz-btn-primary"
                onClick={() => navigate("/nilai")}
                style={{ padding: "12px 24px", fontSize: "16px" }}
              >
                Kembali ke Daftar Nilai
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── QUIZ PHASE ────────────────────────────────────────────────
  return (
    <div className="dashboard-container" style={{ display: "block" }}>
      <main className="main-content quiz-main" style={{ marginLeft: 0, margin: "0 auto", maxWidth: "900px", float: "none" }}>
        <div className="topbar" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <h1>{config.title}</h1>
          <p>Jawab {quizData.questions.length} pertanyaan berdasarkan materi yang sudah dipelajari.</p>
        </div>

        <div className="quiz-container-inner">
          <div className="quiz-board">
            <div className="quiz-meta-bar">
              <span className="quiz-timer">
                Timer: {minutes}:{seconds}
              </span>
              <span className="quiz-count">
                Jumlah: {quizData.questions.length} soal
              </span>
            </div>

            <div className="quiz-questions-list">
              {quizData.questions.map((question, qIdx) => (
                <div key={question.id} className="quiz-question-card">
                  <p className="quiz-question-text">
                    {qIdx + 1}. {question.text}
                  </p>
                  <div className="quiz-options">
                    {question.options.map((option, oIdx) => {
                      const isSelected = answers[question.id] === option.id;
                      return (
                        <label
                          key={option.id}
                          className={`quiz-option ${isSelected ? "selected" : ""}`}
                          onClick={() => selectAnswer(question.id, option.id)}
                        >
                          <span className="quiz-radio">
                            <span className={`quiz-radio-inner ${isSelected ? "checked" : ""}`} />
                          </span>
                          <span>
                            {OPTION_LABELS[oIdx]}. {option.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-submit-area">
              <button
                className="quiz-btn-primary"
                onClick={() => handleSubmit(false)}
                disabled={Object.keys(answers).length === 0}
              >
                Kirim Jawaban
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <MaterialProvider>
      <QuizContent />
    </MaterialProvider>
  );
}
