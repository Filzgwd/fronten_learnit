export default function StatCard({ icon, color, title, value, desc }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div>
        <h3>{title}</h3>
        <h2>{value}</h2>
        <p>{desc}</p>
      </div>
    </article>
  );
}
