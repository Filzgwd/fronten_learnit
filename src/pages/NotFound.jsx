import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/">Kembali ke beranda</Link>
    </main>
  );
}
