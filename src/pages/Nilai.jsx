import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../features/auth/authContext";
import Sidebar from "../features/dashboard/Sidebar";
import { MaterialProvider, useMaterials } from "../features/materials/materialContext";
import { learningPaths } from "../features/materials/learningPaths";
import { quizApi } from "../features/materials/quizApi";
import { getQuizForPath } from "../features/materials/quizData";
import "../../css/nilai.css"; 

const OPTION_LABELS = ["A", "B", "C", "D"];

const ORDERED_PATHS = ["website", "algoritma", "uiux", "ai", "mobile"];

const topicToPath = {
  "Algoritma & Pemrograman": "algoritma",
  "Pengembangan Website": "website",
  "Desain UI/UX": "uiux",
  "Kecerdasan Buatan": "ai",
  "Pemrograman Mobile": "mobile",
};

function NilaiContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state, pathStats } = useMaterials();
  const [quizScores, setQuizScores] = useState({});
  const [loading, setLoading] = useState(true);

  const [reviewPath, setReviewPath] = useState(null);
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  const username = user?.name ? user.name.split(" ")[0] : "Siswa";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await quizApi.getResults();
        if (res.data && Array.isArray(res.data)) {
          const pathScores = {};
          res.data.forEach((r) => {
            const pathKey = topicToPath[r.name] || "website";
            pathScores[pathKey] = {
              score: r.score,
              correct_answers: r.correct_answers,
              total_questions: r.total_questions,
              answers: {}, // Details are only stored locally or empty
            };
          });
          setQuizScores(pathScores);
        }
      } catch (err) {
        console.error("Error fetching quiz results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const cards = useMemo(() => {
    return ORDERED_PATHS.map((pathKey) => {
      const config = learningPaths[pathKey];
      if (!config) return null;

      // Determine material progress
      const materialsInPath = state.materials.filter((m) => m.path === pathKey);
      
      // Calculate material completion purely based on materials
      const allMaterialsRead = materialsInPath.length > 0 && materialsInPath.every((m) => {
        return (state.progress[m.id] || 0) >= 100;
      });

      // Get progress percentage using pathStats
      const progressPercent = pathStats[pathKey]?.pathPercent || 0;

      const isUnlocked = allMaterialsRead;

      // Quiz score
      const scoreData = quizScores[pathKey];
      const score = scoreData ? Number(scoreData.score || 0) : null;
      
      // If locked, hide score and badge
      const scoreDisplay = isUnlocked ? (scoreData ? `${score}/100` : "0/100") : "- / 100";

      // Status badge
      let statusBadge = null;
      if (isUnlocked && scoreData) {
        if (score >= 70) {
          statusBadge = { text: "Lulus", className: "lulus", icon: "fa-solid fa-circle-check" };
        } else {
          statusBadge = { text: "Tidak Lulus", className: "tidak-lulus", icon: "fa-solid fa-circle-xmark" };
        }
      }

      return {
        key: pathKey,
        title: config.title,
        allMaterialsRead,
        progressPercent,
        scoreDisplay,
        statusBadge,
        hasScoreData: !!scoreData
      };
    }).filter(Boolean);
  }, [state.materials, state.progress, pathStats, quizScores]);

  if (loading || state.loading) {
    return (
      <div className="dashboard-container nilai-page">
        <Sidebar onLogout={handleLogout} />
        <main className="main-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <div style={{ textAlign: "center" }}>
            <div className="loading-spinner" style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
            <p style={{ color: "#64748b", fontSize: "16px", fontWeight: "500" }}>Memuat daftar nilai...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container nilai-page">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <div className="nilai-topbar">
          <h1>Daftar Kuis LearnIT</h1>
          <p>Pilih dan kerjakan kuis yang tersedia untuk menguji pemahamanmu</p>
        </div>

        <div className="nilai-hero-card">
          <div className="nilai-hero-icon">
            <img src="/assets/img/logo nilai.png" alt="Logo Nilai" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(1.8)" }} />
          </div>
          <div className="nilai-hero-text">
            <span className="nilai-hero-badge">Hai, {username}!</span>
            <p>Terus belajar dan tingkatkan hasilmu!</p>
          </div>
        </div>

        <div className="nilai-content-grid">
          {cards.map((card) => {
            const isUnlocked = card.allMaterialsRead;

            return (
              <div key={card.key} className="nilai-quiz-card">
                <div className="nilai-card-body">
                  <div className="nilai-card-header">
                    <div className={`nilai-card-icon ${isUnlocked ? 'unlocked' : 'locked'}`}>
                      {isUnlocked ? (
                        <i className="fa-solid fa-file-circle-check"></i>
                      ) : (
                        <i className="fa-solid fa-lock"></i>
                      )}
                    </div>
                    <div className="nilai-card-title-area">
                      <h3>{card.title}</h3>
                      <span className={`nilai-card-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
                        {isUnlocked ? "Kuis Siap Dikerjakan" : "Kuis Terkunci"}
                      </span>
                    </div>
                  </div>

                  <div className="nilai-progress-section">
                    <div className="nilai-progress-bar-bg">
                      <div 
                        className={`nilai-progress-bar-fill ${isUnlocked ? 'unlocked' : 'locked'}`}
                        style={{ width: `${card.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="nilai-progress-text">
                      {card.progressPercent}%
                    </div>
                  </div>

                  <div className="nilai-score-section">
                    <div className="nilai-score-label">Skor Kuis :</div>
                    <div className="nilai-score-row">
                      <div className="nilai-score-value">{card.scoreDisplay}</div>
                      {card.statusBadge && (
                        <div 
                          className={`nilai-score-status ${card.statusBadge.className}`} 
                          title="Klik untuk melihat review jawaban"
                          onClick={() => setReviewPath(card.key)}
                        >
                          <i className={card.statusBadge.icon}></i> {card.statusBadge.text}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    className={`nilai-action-btn ${isUnlocked ? 'unlocked' : 'locked'}`}
                    onClick={() => {
                      if (isUnlocked) {
                        navigate(`/quiz/${card.key}`);
                      } else {
                        setShowLockedPopup(true);
                      }
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <div className="nilai-action-btn-icon-wrapper">
                          <i className="fa-solid fa-play"></i>
                        </div>
                        Kerjakan Kuis
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lock"></i>
                        Terkunci
                      </>
                    )}
                  </button>
                </div>
                
                <div className={`nilai-card-footer ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  {isUnlocked ? (
                    <>
                      <i className="fa-solid fa-circle-check"></i>
                      Semua materi telah selesai
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-circle-exclamation"></i>
                      Selesaikan semua materi
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Review Modal */}
      {reviewPath && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.3s ease", padding: "20px" }}>
          <div className="hide-scrollbar" style={{ background: "#fff", padding: "32px 24px", borderRadius: "20px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", animation: "modalAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>Review Jawaban</h3>
              <button onClick={() => setReviewPath(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "20px" }}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="quiz-questions-list" style={{ paddingRight: "10px" }}>
              {getQuizForPath(reviewPath)?.questions.map((question, qIdx) => {
                const answers = quizScores[reviewPath]?.answers || {};
                const chosenOptionId = answers[question.id];
                const correctOption = question.options.find(o => o.isCorrect);
                const isCorrect = chosenOptionId === correctOption?.id;

                return (
                  <div key={question.id} className="quiz-question-card" style={{ borderColor: isCorrect ? "#34d399" : "#f87171", borderWidth: "2px", borderStyle: "solid", marginBottom: "16px", padding: "16px", borderRadius: "12px" }}>
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
              {(!quizScores[reviewPath]?.answers || Object.keys(quizScores[reviewPath].answers).length === 0) && (
                <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "32px", marginBottom: "16px", color: "#d1d5db" }} />
                  <p>Maaf, detail jawaban tidak ditemukan. Pastikan Anda telah mengerjakan kuis terbaru.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Locked Quiz Modal */}
      {showLockedPopup && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.3s ease", padding: "20px" }} onClick={() => setShowLockedPopup(false)}>
          <div style={{ background: "#fff", padding: "32px 24px", borderRadius: "20px", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", animation: "modalAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: "64px", height: "64px", background: "#fee2e2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 20px" }}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Kuis Terkunci</h3>
            <p style={{ fontSize: "15px", color: "#4b5563", margin: "0 0 24px 0", lineHeight: "1.5" }}>Anda belum menyelesaikan semua materi di jalur ini. Silakan baca dan selesaikan materi hingga 100% untuk membuka kuis.</p>
            <button 
              onClick={() => setShowLockedPopup(false)}
              style={{ width: "100%", padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={(e) => e.target.style.background = "#2563eb"}
              onMouseOut={(e) => e.target.style.background = "#3b82f6"}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NilaiPage() {
  return (
    <MaterialProvider>
      <NilaiContent />
    </MaterialProvider>
  );
}
