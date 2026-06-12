import { Link, useLocation } from "react-router";
import { useAuth } from "../auth/authContext";

export default function Sidebar({ onLogout, hideMenu }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/materi", icon: "fa-book-open", label: "Alur Pembelajaran" },
    { to: "/nilai", icon: "fa-address-card", label: "Kuis" },
    { to: "/forum", icon: "fa-user-group", label: "Forum Diskusi" },
  ];

  if (user?.role === "admin") {
    menuItems.push({
      to: "/admin",
      icon: "fa-users",
      label: "Kelola Pengguna",
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">
          <img
            src="/assets/img/Logo Learn IT.png"
            alt="LearnIT"
            className="logo-img"
          />
        </div>
        <h2 className="logo-text">
          Learn<span>IT</span>
        </h2>
      </div>

      {!hideMenu && (
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`menu-item ${pathname.startsWith(item.to) ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}

      {!hideMenu && (
        <div className="logout-area">
          <button type="button" onClick={onLogout} className="logout-btn">
            <i className="fa-solid fa-right-from-bracket" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
