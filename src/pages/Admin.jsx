import { Link, NavLink, useNavigate } from "react-router";
import { Outlet, useLocation } from "react-router";
import { useAuth } from "../features/auth/authContext";
import "../../css/admin.css";

const menuItems = [
  { to: "/admin", icon: "fa-chart-pie", label: "Dashboard" },
  { to: "/admin/materi", icon: "fa-book-open", label: "Kelola Materi" },
  { to: "/admin/quiz", icon: "fa-clipboard-question", label: "Kelola Quiz" },
  { to: "/admin/users", icon: "fa-users", label: "Kelola Pengguna" },
];

export default function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">
            <img src="/assets/img/Logo Learn IT.png" alt="LearnIT" className="logo-img" />
          </div>
          <div className="logo-text">
            Learn<span>IT</span>
          </div>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="logout-area">
          <button type="button" onClick={handleLogout} className="logout-btn">
            <i className="fa-solid fa-right-from-bracket" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
