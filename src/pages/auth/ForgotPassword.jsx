import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../../features/auth/AuthLayout";
import AuthField from "../../features/auth/AuthField";
import { authPanels } from "../../features/auth/authContent";
import { authApi } from "../../features/auth/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    setMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setFieldError("Email tidak valid");
    }

    setLoading(true);
    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(
        response.data.message || "Tautan reset password telah dikirim ke email Anda."
      );
    } catch (error) {
      setFieldError(
        error.response?.data?.message || error.message || "Gagal mengirim tautan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout panel={authPanels.forgot}>
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-card-desc">
          Kami akan mengirim tautan reset ke email Anda
        </p>

        {message && <div className="auth-toast auth-toast-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <AuthField
            id="email"
            name="email"
            label="Email"
            icon="fa-envelope"
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError}
            autoComplete="email"
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Tautan Reset Password"}
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
