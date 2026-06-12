import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { API_BASE_URL } from "../../config";
import AuthLayout from "../../features/auth/AuthLayout";
import AuthField from "../../features/auth/AuthField";
import { authPanels } from "../../features/auth/authContent";
import { useAuth } from "../../features/auth/authContext";

export default function Signin() {

  const { signin, signinWithToken } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        let userInfo;
        try {
          const infoRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          userInfo = infoRes.data;
        } catch (e) {
          throw new Error("Gagal mengambil data akun Google");
        }

        try {
          // Attempt backend login
          const res = await axios.post(`${API_BASE_URL}/auth/google`, {
            token: tokenResponse.access_token,
          });
          const token = res.data?.token || res.data?.accessToken || res.data?.access_token || res.data?.data?.token || res.data?.data?.accessToken || res.data?.data?.access_token;
          const user = res.data?.user || res.data?.data?.user;
          const signedInUser = signinWithToken(token, user);
          navigate(signedInUser?.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
          // Fallback if backend is down
          if (!err.response && userInfo) {
            const mockUser = {
              id: `google_${userInfo.sub}`,
              name: userInfo.name,
              namaLengkap: userInfo.name,
              email: userInfo.email,
              role: "user",
            };
            // Mock JWT token
            const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
            const payload = btoa(
              JSON.stringify({
                id: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
                role: "user",
                sub: mockUser.id,
              })
            );
            const sig = btoa(mockUser.email + mockUser.id);
            const token = `${header}.${payload}.${sig}`;

            // Save to localUsers so they exist
            try {
              const users = JSON.parse(localStorage.getItem("localUsers") || "[]");
              if (!users.find((u) => u.email === mockUser.email)) {
                users.push(mockUser);
                localStorage.setItem("localUsers", JSON.stringify(users));
              }
            } catch (e) {
              console.error(e);
            }

            const signedInUser = signinWithToken(token, mockUser);
            navigate("/dashboard");
          } else {
            console.log(err);
            alert("Login Google gagal di server");
          }
        }
      } catch (err) {
        console.log(err);
        alert(err.message || "Login Google gagal");
      }
    },
    onError: () => {
      console.log("Google Login Failed");
      alert("Autentikasi Google dibatalkan atau gagal");
    },
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (fieldErrors[e.target.name]) {

      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: "",
      });

    }

  };

  const validate = () => {

    const errors = {};

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      errors.email = "Email tidak valid";
    }

    if (form.password.length < 6) {
      errors.password =
        "Password minimal 6 karakter";
    }

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

      const signedInUser =
        await signin(form);

      const dest =
        location.state?.from;

      if (dest) {

        navigate(dest);

      } else if (
        signedInUser?.role === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/dashboard");

      }

    } catch (err) {

      const res =
        err.response?.data;

      if (Array.isArray(res)) {

        setToast(
          res
            .map((item) => item.message)
            .join(", ")
        );

      } else if (res?.message) {

        setToast(res.message);

      } else if (err.message && err.message !== "Login gagal") {

        setToast(err.message);

      } else {

        setToast(
          "Login gagal. Periksa email dan password Anda."
        );

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <AuthLayout panel={authPanels.signin}>

      <div className="auth-card">

        <h2>Masuk ke akun</h2>

        <p className="auth-card-lead">

          Belum punya akun?{" "}

          <Link
            to="/daftar-ulang"
            state={{ forceShow: true }}
            className="auth-link"
          >
            Daftar Sekarang
          </Link>

        </p>

        {toast && (
          <div className="auth-toast">
            {toast}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
            autoComplete="current-password"
          />

          <div className="auth-forgot">

            <Link
              to="/lupa-password"
              state={{ forceShow: true }}
            >
              Lupa password?
            </Link>

          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >

            {loading
              ? "Memproses..."
              : "Masuk"}

          </button>

        </form>

        <div className="auth-divider">
          <span>atau</span>
        </div>

        <div className="auth-google-wrap">

          <button
            type="button"
            className="auth-google-btn"
            onClick={() => handleGoogleLogin()}
          >
            <img src="/assets/img/google.svg" alt="Google" style={{ width: "20px", height: "20px" }} /> Masuk dengan Google
          </button>

        </div>

      </div>

    </AuthLayout>

  );

}
