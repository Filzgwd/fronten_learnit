import { Link } from "react-router";
import {
  images,
  learningPathsLanding,
  misiItems,
  whyFeatures,
} from "../features/materials/landingContent";

export default function Landing() {
  return (
    <>
      <section id="beranda" className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">Platform Belajar Informatika</span>
          <h1>Belajar Informatika Lebih Modern, Terarah, dan Interaktif</h1>
          <p>
            Dapatkan materi berkualitas, latihan interaktif, dan komunitas
            aktif untuk meningkatkan skill IT-mu kapan saja, dimana saja.
          </p>
          <Link to="/daftar-ulang" state={{ forceShow: true }} className="hero-btn">
            Mulai Sekarang
          </Link>
          <div className="hero-stats">
            <div className="hero-stat">
              <h3>100+</h3>
              <p>Pengguna Terdaftar</p>
            </div>
            <div className="hero-stat">
              <h3>20+</h3>
              <p>Materi Informatika</p>
            </div>
            <div className="hero-stat">
              <h3>5+</h3>
              <p>Quiz per materi</p>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <img src={images.hero} alt="Belajar informatika" className="hero-image" />
        </div>
      </section>

      <section id="visi-misi" className="visi-misi">
        <div className="visi-card">
          <div className="section-icon">
            <i className="fa-solid fa-eye" />
          </div>
          <h3>Visi</h3>
          <p>
            Menjadi platform pembelajaran IT yang inovatif, mudah diakses,
            dan mampu meningkatkan skill digital generasi muda.
          </p>
        </div>
        <div className="misi-card">
          <div className="section-icon">
            <i className="fa-solid fa-bullseye" />
          </div>
          <h3>Misi</h3>
          <ul>
            {misiItems.map((item) => (
              <li key={item}>
                <i className="fa-solid fa-circle-check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="fitur" className="why-section">
        <h2>Fitur - Fitur LearnIT?</h2>
        <p className="why-subtitle">
          Hadir dengan fitur pembelajaran interaktif, materi terstruktur, dan
          progress belajar yang mudah digunakan.
        </p>
        <div className="why-grid">
          {whyFeatures.map(([icon, text]) => (
            <div className="why-card" key={text}>
              <div className="why-icon">
                <i className={`fa-solid ${icon}`} />
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="materi" className="alur-section">
        <h2>Alur Pembelajaran</h2>
        <p className="alur-subtitle">
          Pilih jalur belajar sesuai minat dan tujuan karirmu di bidang
          teknologi.
        </p>
        <div className="alur-grid">
          {learningPathsLanding.map(({ title, image, pathKey }) => (
            <Link to={`/materi/${pathKey}`} key={title} className="alur-card-link">
              <div className="alur-card">
                <img src={image} alt={title} />
                <p>{title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="forum" className="quote-section">
        <div className="quote-left">
          <i className="fa-solid fa-quote-left" />
          <h2>
            Belajar teknologi hari ini untuk menciptakan{" "}
            <span className="quote-highlight">masa depan</span> yang lebih baik.
          </h2>
        </div>
        <div className="quote-right">
          <img src={images.laptop} alt="Laptop LearnIT" />
        </div>
      </section>
    </>
  );
}
