import { useState } from "react";
import { aboutContent, teamMembers } from "../features/materials/landingContent";
import { Logo } from "./LandingLayout";

function TeamPhoto({ name, photo }) {
  const [hasError, setHasError] = useState(false);
  const initial = String(name || "?").trim().charAt(0).toUpperCase();

  if (hasError) {
    return (
      <div className="team-photo team-photo-fallback" aria-hidden="true">
        {initial}
      </div>
    );
  }

  return (
    <div className="team-photo">
      <img
        src={photo}
        alt={name}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function AboutUs() {
  return (
    <section id="tentang-kami" className="about-section" style={{ marginTop: '32px' }}>
      <div className="about-intro">
        <Logo large />
        <div className="about-intro-text">
          <span className="about-badge">{aboutContent.badge}</span>
          <h2>{aboutContent.title}</h2>
          <p>{aboutContent.description}</p>
        </div>
      </div>

      <div className="team-section">
        <h2>Anggota Tim Kami</h2>
        <p className="team-subtitle">
          Kami adalah individu dengan peran berbeda yang bekerja sama membangun Learn-IT.
        </p>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.id}>
              <span className={`team-role role-${member.roleColor}`}>
                {member.role}
              </span>
              <TeamPhoto name={member.name} photo={member.photo} />
              <h3>{member.name}</h3>
              <p>{member.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
