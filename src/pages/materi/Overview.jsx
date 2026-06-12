import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/authContext";
import Sidebar from "../../features/dashboard/Sidebar";
import { learningPaths } from "../../features/materials/learningPaths";
import "../../../css/dashboard.css";

export default function MateriOverviewPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const filteredPaths = useMemo(
    () =>
      Object.entries(learningPaths).filter(([, config]) => {
        const text = `${config.title} ${config.desc}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }),
    [query],
  );

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Alur Pembelajaran</h1>
            <p>Pilih materi yang ingin dipelajari, lalu kerjakan quiz di akhir materi.</p>
          </div>
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Cari dokumen, kategori...."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <section className="materi-overview-grid">
          {filteredPaths.map(([pathKey, config]) => (
            <article key={pathKey} className="materi-path-card">
              <div className="materi-path-card-image">
                <img src={config.image} alt={config.title} />
              </div>
              <div className="materi-path-card-body">
                <div>
                  <h3>{config.title}</h3>
                  <p>{config.desc}</p>
                </div>
                <div className="materi-path-card-footer">
                  <Link to={`/materi/${pathKey}`}>
                    Lihat Rincian Alur <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
