import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { MaterialProvider, useMaterials } from "../../features/materials/materialContext";
import { learningPaths } from "../../features/materials/learningPaths";
import { useAuth } from "../../features/auth/authContext";
import { materialApi } from "../../features/materials/materialApi";

function MateriReadContent() {
  const { pathKey, materialId } = useParams();
  const { state, dispatch } = useMaterials();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const articleRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastMaterial, setIsLastMaterial] = useState(false);
  const [showQuizAlert, setShowQuizAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const config = learningPaths[pathKey];
  const material = state.materials.find(
    (item) => String(item.id) === String(materialId),
  );

  const materialsInPath = state.materials.filter((m) => m.path === pathKey);
  const allMaterialsRead = materialsInPath.every((m) => {
    // Treat the current material as read if we just clicked complete
    if (String(m.id) === String(material?.id) && isCompleted) return true;
    return (state.progress[m.id] || 0) >= 100;
  });

  // Detect if this is the last material in the path
  useEffect(() => {
    if (!material || !state.materials.length) return;
    const materialsInPath = state.materials.filter((m) => m.path === pathKey);
    const lastMaterial = materialsInPath[materialsInPath.length - 1];
    setIsLastMaterial(lastMaterial && String(lastMaterial.id) === String(materialId));
  }, [material, state.materials, pathKey, materialId]);

  // Check if already marked as read
  useEffect(() => {
    if (!material) return;
    const progress = state.progress[material.id] || 0;
    if (progress >= 100) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [material, state.progress]);

  const handleCompleteMaterial = () => {
    if (material && !isCompleted) {
      const newProgress = materialApi.saveProgress(material.id, 100);
      dispatch({ type: "SET_PROGRESS", payload: newProgress });
      setIsCompleted(true);
      setShowSuccessModal(true);
    }
  };

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  if (!config || !material || material.path !== pathKey) {
    return (
      <main className="not-found">
        <h1>404</h1>
        <p>Materi tidak ditemukan.</p>
        <Link to={`/materi/${pathKey || ""}`}>Kembali ke Daftar Materi</Link>
      </main>
    );
  }

  // Find next material
  const currentIndex = materialsInPath.findIndex(
    (m) => String(m.id) === String(materialId),
  );
  const nextMaterial = materialsInPath[currentIndex + 1] || null;

  return (
    <div className="dashboard-container" style={{ display: "block", background: "#f8fafc" }}>
      <main className="main-content" style={{ marginLeft: 0 }}>
        <div className="materi-read-top-nav" style={{ marginBottom: "20px" }}>
          <Link to={`/materi/${pathKey}`} className="materi-read-back">
            <i className="fa-solid fa-arrow-left" style={{ marginRight: "8px" }} />
            Kembali ke daftar materi
          </Link>
        </div>

        <div className="materi-read-hero">
          <div className="materi-hero-left">
            <span className="materi-hero-path">{config.title}</span>
            <h1>{material.title}</h1>
            <p>{material.desc || material.description || config.desc}</p>
            <div className="materi-hero-badges">
              {material.videoLink && (
                <a href={material.videoLink} target="_blank" rel="noreferrer" className="materi-hero-badge" style={{ background: "#2563eb", color: "#fff" }}>
                  <i className="fa-brands fa-youtube" style={{ color: "#ef4444" }} /> Tonton Video Youtube
                </a>
              )}
            </div>
          </div>
          <div className="materi-hero-right">
            <img src={material.image || config.image} alt={material.title} />
          </div>
        </div>

        {/* Removed scroll progress hint */}
        <article ref={articleRef} className="materi-read-content">
          <div className="materi-read-text">
            {/* Render blocks if available */}
            {material.blocks && material.blocks.length > 0 ? (
              material.blocks.map((block, idx) => (
                <div key={idx} className="materi-read-block-card">
                  {block.title && (
                    <div className="materi-read-block-header">
                      <h3>{block.title}</h3>
                    </div>
                  )}
                  <div className="materi-read-block-body">
                    {block.example && (
                      <p className="materi-read-example">{block.example}</p>
                    )}
                    {block.paragraph && <p>{block.paragraph}</p>}
                    {block.list && (
                      block.listType === "number" ? (
                        <ol type="1" className="materi-read-list">
                          {block.list.split("\n").filter(l => l.trim()).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      ) : block.listType === "alpha" ? (
                        <ol type="a" className="materi-read-list">
                          {block.list.split("\n").filter(l => l.trim()).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="materi-read-list">
                          {block.list.split("\n").filter(l => l.trim()).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )
                    )}
                    {block.image && (
                      <div className="materi-read-block-image">
                        <img src={block.image} alt={block.title || `Gambar ${idx}`} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="materi-read-block-card">
                <div className="materi-read-block-header">
                  <h3>Penjelasan Materi</h3>
                </div>
                <div className="materi-read-block-body">
                  <p>
                    {material.content ||
                      `Materi ini membahas ${material.title.toLowerCase()} sebagai bagian dari ${config.title.toLowerCase()}. Pelajari konsepnya langkah demi langkah, lalu kerjakan quiz di akhir materi.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Manual completion button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px", marginBottom: "20px" }}>
          {!isCompleted ? (
            <button
              onClick={handleCompleteMaterial}
              style={{ padding: "14px 28px", fontSize: "16px", fontWeight: "600", color: "#fff", background: "#2563eb", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "transform 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fa-solid fa-check" /> Selesai Mempelajari Materi
            </button>
          ) : (
            <button
              disabled
              style={{ padding: "14px 28px", fontSize: "16px", fontWeight: "600", color: "#fff", background: "#10b981", border: "none", borderRadius: "12px", cursor: "not-allowed", display: "flex", alignItems: "center", gap: "10px" }}
            >
              <i className="fa-solid fa-check-double" /> Materi Telah Diselesaikan
            </button>
          )}
        </div>

        {/* Navigation after reading */}
        {isCompleted && (
          <div className="materi-nav-area">
            {nextMaterial && !isLastMaterial && (
              <div className="materi-next-card">
                <p className="materi-next-hint">Lanjutkan ke materi berikutnya</p>
                <Link
                  to={`/materi/${pathKey}/${nextMaterial.id}`}
                  className="quiz-btn-secondary"
                >
                  <i className="fa-solid fa-arrow-right" /> {nextMaterial.title}
                </Link>
              </div>
            )}

          </div>
        )}
        {/* Success Popup Modal */}
        {showSuccessModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.3s ease" }}>
            <div style={{ background: "#fff", padding: "32px 24px", borderRadius: "20px", maxWidth: "400px", width: "90%", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", animation: "modalAppear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
              <div style={{ width: "70px", height: "70px", background: "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#10b981", fontSize: "32px" }}>
                <i className="fa-solid fa-check-circle" />
              </div>
              <h3 style={{ fontSize: "22px", color: "#111827", marginBottom: "12px", fontWeight: "800" }}>Selamat!</h3>
              <p style={{ color: "#4b5563", marginBottom: "28px", lineHeight: 1.6, fontSize: "15px" }}>Anda telah berhasil menyelesaikan materi <strong>{material.title}</strong>. Terus semangat belajarnya!</p>
              <button 
                onClick={() => setShowSuccessModal(false)} 
                style={{ background: "#2563eb", color: "#fff", border: "none", padding: "14px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", width: "100%", fontSize: "15px", transition: "transform 0.2s, box-shadow 0.2s" }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Removed Quiz Alert & Suggestion Modals */}
    </div>
  );
}

export default function MateriReadPage() {
  return (
    <MaterialProvider>
      <MateriReadContent />
    </MaterialProvider>
  );
}
