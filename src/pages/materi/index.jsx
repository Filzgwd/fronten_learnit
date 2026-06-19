import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { MaterialProvider, useMaterials } from "../../features/materials/materialContext";
import { learningPaths } from "../../features/materials/learningPaths";
import Sidebar from "../../features/dashboard/Sidebar";
import { useAuth } from "../../features/auth/authContext";
import "../../../css/dashboard.css";

function MateriListContent() {
  const { pathKey } = useParams();
  const { state } = useMaterials();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const config = learningPaths[pathKey];
  const materials = state.materials.filter(
    (material) => material.path === pathKey,
  );

  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) => {
        const text = `${material.title} ${material.desc || ""}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }),
    [materials, query],
  );

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  if (!config) {
    return (
      <main className="not-found">
        <h1>404</h1>
        <p>Alur pembelajaran tidak ditemukan.</p>
        <Link to="/materi">Kembali ke Alur Pembelajaran</Link>
      </main>
    );
  }

  if (state.loading && materials.length === 0) {
    return (
      <div className="dashboard-container materi-page">
        <Sidebar onLogout={handleLogout} />
        <main className="main-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div className="loading-spinner" style={{ border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
            <p style={{ color: "#64748b", fontSize: "16px", fontWeight: "500" }}>Memuat daftar materi...</p>
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
    <div className="dashboard-container materi-page">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Materi - Materi {config.title}</h1>
            <p>{config.desc}</p>
          </div>
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Cari dokumen, kategori..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <section className="materi-list-grid">
          {filteredMaterials.map((material, index) => {
            const isRead = (state.progress[material.id] || 0) >= 100;
            return (
            <article className="materi-list-card" key={material.id}>
              <div className="materi-list-card-image">
                <img src={material.image || config.image} alt={material.title} />
              </div>
              <div className="materi-list-card-body">
                <div>
                  <h3>{material.title}</h3>
                  <p>{material.desc || config.desc}</p>
                </div>
                <Link
                  to={`/materi/${pathKey}/${material.id}`}
                  className="materi-list-btn"
                  style={isRead ? { backgroundColor: "#10b981", borderColor: "#10b981", color: "#fff" } : {}}
                >
                  {isRead ? "Materi Selesai" : "Pelajari Materi"}
                </Link>
              </div>
            </article>
          )})}
        </section>

        {filteredMaterials.length === 0 && (
          <div className="materi-list-empty">
            <p>Belum ada materi untuk kategori ini.</p>
            <Link to="/materi">Kembali ke Alur Pembelajaran</Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MateriDetailPage() {
  return (
    <MaterialProvider>
      <MateriListContent />
    </MaterialProvider>
  );
}
