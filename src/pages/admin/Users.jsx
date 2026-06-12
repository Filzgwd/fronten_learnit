import { useState, useEffect } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
      // Tambahkan admin statis agar selalu tampil
      const adminUser = {
        id: "admin_1",
        namaLengkap: "Administrator",
        email: "admin@informatika.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      
      const allUsers = [adminUser, ...localUsers];
      setUsers(allUsers);
    } catch (error) {
      console.error("Gagal memuat pengguna:", error);
    }
  }, []);

  const handleDeleteUser = (userId) => {
    if (userId === "admin_1") {
      alert("Administrator tidak dapat dihapus!");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
      const updatedLocalUsers = localUsers.filter((u) => u.id !== userId);
      localStorage.setItem("localUsers", JSON.stringify(updatedLocalUsers));
      
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const filteredUsers = users.filter((user) => 
    user.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Kelola Pengguna</h1>
          <p>Lihat dan kelola data pengguna terdaftar</p>
        </div>
      </div>

      <section className="section-card--no-bg">
        <div className="section-header">
          <h2>Kelola Pengguna</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Cari Pengguna" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.namaLengkap || user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="status-badge status-active">Aktif</span>
                    </td>
                    <td className="action-buttons">
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === "admin"}
                        style={user.role === "admin" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
