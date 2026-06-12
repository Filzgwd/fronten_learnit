import { useState } from "react";
import { Link } from "react-router";
import { authImages } from "./authContent";

export default function AuthLayout({ panel, children }) {
  const [imgError, setImgError] = useState(false);
  const illustrationSrc = imgError
    ? authImages.illustrationFallback
    : authImages.illustration;

  return (
    <div className="auth-layout" data-panel={panel?.id}>
      <aside className="auth-side">
        <div className="auth-side-inner">
          <div className="auth-side-logo">
            <div className="logo-box">
              <img src={authImages.logo} alt="LearnIT" className="logo-img" />
            </div>
            <span>
              Learn<span>IT</span>
            </span>
          </div>

          <div className="auth-brand-box">
            <h1>{panel.title}</h1>
            <p>{panel.subtitle}</p>
            <Link to={panel.backTo} className="auth-side-link">
              <i className="fa-solid fa-arrow-left" />
              {panel.backLabel}
            </Link>
          </div>

          <div className="auth-illustration-wrap">
            <img
              src={illustrationSrc}
              alt="Ilustrasi belajar informatika"
              className="auth-illustration"
              onError={() => setImgError(true)}
            />
          </div>
        </div>
      </aside>

      <main className="auth-main">{children}</main>
    </div>
  );
}
