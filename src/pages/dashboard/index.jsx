import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/authContext";
import { MaterialProvider, useMaterials } from "../../features/materials/materialContext";
import { learningPaths } from "../../features/materials/learningPaths";
import Sidebar from "../../features/dashboard/Sidebar";
import StatCard from "../../features/dashboard/StatCard";
import MaterialCard from "../../features/materials/MaterialCard";
import { getQuizScores } from "../../features/materials/quizData";
import "../../../css/dashboard.css";

const PREVIEW_COUNT = 4; // jumlah materi yang tampil secara default

function DashboardContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { stats, pathStats } = useMaterials();
  const [showAll, setShowAll] = useState(false);

  const quizScores = getQuizScores();
  const completedQuizzes = Object.keys(quizScores).length;
  const totalQuizzes = Object.keys(learningPaths).length;
  const totalPoints = Object.values(quizScores).reduce(
    (sum, data) => sum + Number(data.score || 0),
    0
  );

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const displayName = user?.name || user?.username || user?.email || "Siswa";

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const pathKeys = Object.keys(learningPaths);
  const visibleKeys = showAll ? pathKeys : pathKeys.slice(0, PREVIEW_COUNT);
  const hasMore = pathKeys.length > PREVIEW_COUNT;

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Selamat datang di platform belajar IT terbaik</p>
          </div>
        </div>

        <section className="dashboard-overview-column">
          <section className="hero-card">
            <div>
              <h2>Halo, {displayName}!</h2>
              <p>Terus semangat belajar dan tingkatkan skill IT-mu setiap hari!</p>
              <div className="progress-box">
                <div className="progress-info">
                  <span>Progres belajar kamu</span>
                  <span>{stats.overallPercent}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${stats.overallPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img src="/assets/img/LAPTOP.png" alt="Laptop LearnIT" />
            </div>
          </section>

          <section className="stats-grid">
            <StatCard
              icon="fa-book-open"
              color="purple"
              title="Total Materi"
              value={stats.total}
              desc="Materi tersedia"
            />
            <StatCard
              icon="fa-circle-check"
              color="green"
              title="Materi Selesai"
              value={stats.completed}
              desc="Materi terselesaikan"
            />
            <StatCard
              icon="fa-pen"
              color="orange"
              title="Quiz Dikerjakan"
              value={completedQuizzes}
              desc={`Dari ${totalQuizzes} Quiz`}
            />
            <StatCard
              icon="fa-trophy"
              color="yellow"
              title="Total Poin Kamu"
              value={totalPoints}
              desc="Poin belajar"
            />
          </section>
        </section>

        <div className="section-title">
          <h2>Materi</h2>
          {hasMore && (
            <button
              type="button"
              className="section-link"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Tampilkan Sedikit" : "Lihat Semua"}
            </button>
          )}
        </div>

        <section className="materi-grid db-materi-grid">
          {visibleKeys.map((pathKey) => (
            <MaterialCard
              key={pathKey}
              pathKey={pathKey}
              stats={pathStats[pathKey]}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <MaterialProvider>
      <DashboardContent />
    </MaterialProvider>
  );
}
