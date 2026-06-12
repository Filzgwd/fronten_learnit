import { useAuth } from "../../features/auth/authContext";

export default function AdminHomePage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.username || "Administrator";

  return (
    <section className="admin-home-page">
      <div className="topbar admin-home">
        <div className="topbar-left">
          <h1>Dashboard</h1>
          <p>Kelola platform pembelajaran LearnIT</p>
        </div>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon purple">
            <i className="fa-solid fa-users" />
          </div>
          <div>
            <h3>Total Pengguna</h3>
            <div className="stat-value">8</div>
            <div className="stat-label">Terdaftar</div>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon green">
            <i className="fa-solid fa-book" />
          </div>
          <div>
            <h3>Total Materi</h3>
            <div className="stat-value">2</div>
            <div className="stat-label">Dipublikasikan</div>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon orange">
            <i className="fa-solid fa-clipboard-question" />
          </div>
          <div>
            <h3>Total Quiz</h3>
            <div className="stat-value">1</div>
            <div className="stat-label">Aktif</div>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon yellow">
            <i className="fa-solid fa-chart-line" />
          </div>
          <div>
            <h3>Progress</h3>
            <div className="stat-value">100%</div>
            <div className="stat-label">Terdaftar</div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <section className="section-card">
          <div className="section-header">
            <h2>Materi Terbaru</h2>
          </div>
          <div className="list-container">
            <div className="list-item">
              <div className="list-item-title">Pengenalan Website</div>
              <div className="list-item-desc">Website</div>
            </div>
            <div className="list-item">
              <div className="list-item-title">Back End Development</div>
              <div className="list-item-desc">Database</div>
            </div>
            <div className="list-item">
              <div className="list-item-title">Front End Development</div>
              <div className="list-item-desc">Tampilan</div>
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <h2>Pengguna Terbaru</h2>
          </div>
          <div className="list-container">
            <div className="list-item">
              <div className="list-item-title">Administrator</div>
              <div className="list-item-desc">admin@informatika.com</div>
            </div>
            <div className="list-item">
              <div className="list-item-title">Fila</div>
              <div className="list-item-desc">fila@gmail.com</div>
            </div>
            <div className="list-item">
              <div className="list-item-title">Widjra</div>
              <div className="list-item-desc">widjra@gmail.com</div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
