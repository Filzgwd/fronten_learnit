import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../features/auth/authContext";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signinWithToken } = useAuth();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const token = search.get("token") || search.get("access_token") || search.get("accessToken");
    const role = search.get("role");
    const userJson = search.get("user");
    let user = null;
    if (userJson) {
      try {
        user = JSON.parse(decodeURIComponent(userJson));
      } catch (e) {
        user = null;
      }
    }

    if (token) {
      try {
        const newUser = signinWithToken(token, user);
        const dest = newUser?.role === "admin" ? "/admin" : "/dashboard";
        navigate(dest, { replace: true });
      } catch (err) {
        console.error(err);
        navigate("/signin", { replace: true });
      }
    } else {
      // no token in query, redirect to signin
      navigate("/signin", { replace: true });
    }
  }, [location.search, navigate, signinWithToken]);

  return <div className="page-loader">Memproses login Google...</div>;
}
