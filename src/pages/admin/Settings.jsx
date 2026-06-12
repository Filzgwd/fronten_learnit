export default function AdminSettingsPage() {
  return (
    <section>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Pengaturan</h1>
          <p>Kelola platform pembelajaran Anda</p>
        </div>
      </div>

      <section className="section-card">
        <div className="section-header">
          <h2>Pengaturan Sistem</h2>
        </div>

        <div className="settings-container">
          <div className="settings-card">
            <h2>Halaman admin</h2>
            <p>Halaman kini sudah berjalan di React dengan struktur admin terpisah.</p>
            <button className="btn btn-primary">Refresh Data</button>
          </div>
          <div className="settings-card danger">
            <h2>Manajemen Akun</h2>
            <p>Ubah role, nonaktifkan akun, atau atur izin pengguna.</p>
            <button className="btn btn-secondary">Kelola Akun</button>
          </div>
        </div>
      </section>
    </section>
  );
}
