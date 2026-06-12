import { useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router";
import AuthLayout from "../../features/auth/AuthLayout";
import AuthField from "../../features/auth/AuthField";
import { authPanels } from "../../features/auth/authContent";
import { authApi } from "../../features/auth/authApi";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setFieldError("Password tidak cocok");
    }
    
    if (password.length < 6) {
      return setFieldError("Password minimal 6 karakter");
    }

    setLoading(true);
    try {
      const response = await authApi.resetPassword({ email, token, password });
      setMessage(response.data.message || "Password berhasil direset!");
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      setFieldError(
        error.response?.data?.message || error.message || "Gagal mereset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout panel={authPanels.forgot}>
      <div className="auth-card">
        <h2>Buat Password Baru</h2>
        <p className="auth-card-desc">
          Silakan masukkan password baru untuk akun Anda.
        </p>

        {message && <div className="auth-toast auth-toast-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <AuthField
            id="password"
            name="password"
            label="Password Baru"
            icon="fa-lock"
            type="password"
            placeholder="Masukkan Password Baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldError}
          />
          
          <AuthField
            id="confirmPassword"
            name="confirmPassword"
            label="Konfirmasi Password"
            icon="fa-lock"
            type="password"
            placeholder="Ulangi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>

        <Link to="/signin" state={{ forceShow: true }} className="auth-back-login">
          <i className="fa-solid fa-arrow-left" />
          Kembali ke Halaman Login
        </Link>
      </div>
    </AuthLayout>
  );
}
