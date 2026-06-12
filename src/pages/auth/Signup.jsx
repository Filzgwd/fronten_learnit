import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../../features/auth/AuthLayout";
import AuthField from "../../features/auth/AuthField";
import { authPanels } from "../../features/auth/authContent";
import { useAuth } from "../../features/auth/authContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ namaLengkap: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successDestination, setSuccessDestination] = useState("/signin");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.namaLengkap.trim()) errors.namaLengkap = "Nama wajib diisi";
    if (!emailRegex.test(form.email)) errors.email = "Email tidak valid";
    if (form.password.length < 6)
      errors.password = "Password minimal 6 karakter";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setToast("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      return setFieldErrors(errors);
    }

    setLoading(true);
    try {
      const res = await signup(form);
      // Local fallback returns token directly in res.data
      if (res?.data?.token) {
        setSuccessDestination("/dashboard");
      } else {
        setSuccessDestination("/signin");
      }
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate(res?.data?.token ? "/dashboard" : "/signin", { state: { forceShow: true } });
      }, 2000);
    } catch (err) {
      const res = err.response?.data;
      if (Array.isArray(res)) {
        setToast(res.map((item) => item.message).join(", "));
      } else if (res?.message) {
        setToast(res.message);
      } else if (err.message) {
        setToast(err.message);
      } else if (!err.response) {
        setToast("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
      } else {
        setToast("Registrasi gagal. Coba beberapa saat lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout panel={authPanels.signup}>
      <div className="auth-card">
        <h2>Buat akun baru</h2>
        <p className="auth-card-lead">
          Sudah punya akun?{" "}
          <Link to="/signin" state={{ forceShow: true }} className="auth-link">
            Masuk
          </Link>
        </p>

        {toast && <div className="auth-toast">{toast}</div>}

        <form onSubmit={handleSubmit}>
          <AuthField
            id="name"
            name="namaLengkap"
            label="Nama Lengkap"
            icon="fa-user"
            type="text"
            placeholder="Nama lengkap"
            value={form.namaLengkap}
            onChange={handleChange}
            error={fieldErrors.namaLengkap}
            autoComplete="name"
          />

          <AuthField
            id="email"
            name="email"
            label="Email"
            icon="fa-envelope"
            type="email"
            placeholder="Masukkan Email"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            autoComplete="email"
          />

          <AuthField
            id="password"
            name="password"
            label="Password"
            icon="fa-lock"
            type="password"
            placeholder="Masukkan Password"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="new-password"
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Memproses..." : "Buat Akun"}
          </button>
        </form>

        <Link to="/signin" state={{ forceShow: true }} className="auth-back-login">
          <i className="fa-solid fa-arrow-left" />
          Kembali ke Halaman Login
        </Link>

        <div className={`success-popup ${showSuccessPopup ? "show" : ""}`}>
          <div className="popup-card">
            <div className="check-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2>Berhasil</h2>
            <p>Data anda telah berhasil disimpan</p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessPopup(false);
                navigate(successDestination, { state: { forceShow: true } });
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
