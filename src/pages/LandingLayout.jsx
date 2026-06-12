import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { images, footerMenu } from "../features/materials/landingContent";

export function Logo({ compact = false, large = false }) {
  return (
    <div className={`brand ${compact ? "brand-row" : ""} ${large ? "brand-large" : ""}`}>
      <img src={images.logo} alt="Logo LearnIT" className="logo-img" />
      <h2 className="logo-text">
        Learn<span>IT</span>
      </h2>
    </div>
  );
}

export default function LandingLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="landing-page">
      <header className="header">
        <div className="navbar container">
          <Logo compact />
          <nav className="nav-links">
            <Link to="/#beranda" className={location.pathname === "/" && (!location.hash || location.hash === "#beranda") ? "active-link" : ""}>Beranda</Link>
            <Link to="/#visi-misi" className={location.hash === "#visi-misi" ? "active-link" : ""}>Visi & Misi</Link>
            <Link to="/#fitur" className={location.hash === "#fitur" ? "active-link" : ""}>Fitur</Link>
            <Link to="/#materi" className={location.hash === "#materi" ? "active-link" : ""}>Alur Pembelajaran</Link>
            <Link to="/tentang-kami" className={location.pathname === "/tentang-kami" ? "active-link" : ""}>Tentang Kami</Link>
          </nav>
          <div className="nav-buttons">
            <Link to="/signin" state={{ forceShow: true }} className="login-btn">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-grid container">
          <div className="footer-about">
            <Logo compact />
            <p>
              Platform belajar IT online dengan materi terstruktur, latihan interaktif, dan komunitas aktif untuk mendukung perkembanganmu
            </p>
          </div>
          <div className="footer-menu">
            <h3>Menu</h3>
            {footerMenu.map(([href, label]) => (
              <Link to={href} key={label}>
                {label}
              </Link>
            ))}
          </div>
          <div className="footer-contact">
            <h3>Kontak</h3>
            <div className="footer-contact-item">
              <i className="fa-regular fa-envelope" />
              <span>Learnit@gmail.com</span>
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-phone" />
              <span>0813-3655-0788</span>
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-location-dot" />
              <span>Jl. Prof. Moch Yamin, Ketintang, Kec. Gayungan,<br />Kota Surabaya, Jawa Timur 60231</span>
            </div>
            <div className="social-icons">
              <a href="#github" className="github" aria-label="GitHub">
                <i className="fa-brands fa-github" />
              </a>
              <a href="#youtube" className="youtube" aria-label="YouTube">
                <i className="fa-brands fa-youtube" />
              </a>
              <a href="#instagram" className="instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 LearnIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
