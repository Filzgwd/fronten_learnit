import { Link } from "react-router";
import { learningPaths } from "./learningPaths";

export default function MaterialCard({ pathKey, stats = {}, hidden }) {
  if (hidden) return null;

  const config = learningPaths[pathKey];
  const pathPercent = Number(stats?.pathPercent || 0);

  return (
    <article className="materi-card">
      <img src={config.image} alt={config.title} />
      <div className="materi-card-body">
        <h3>{config.title}</h3>
        <p>{config.desc}</p>
        
        <div className="materi-card-progress-bar">
          <div 
            className="materi-card-progress-fill" 
            style={{ width: `${pathPercent}%` }}
          ></div>
        </div>

        <div className="materi-footer">
          <span className="materi-percent">{pathPercent}%</span>
          <Link to={`/materi/${pathKey}`}>
            <i className="fa-solid fa-play" />
            Lanjutkan
          </Link>
        </div>
      </div>
    </article>
  );
}
