import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "./authApi";

const AuthContext = createContext();

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const getTokenFromResponse = (data) =>
  data?.token ||
  data?.accessToken ||
  data?.access_token ||
  data?.data?.token ||
  data?.data?.accessToken ||
  data?.data?.access_token;

const getUserFromResponse = (data) => data?.user || data?.data?.user;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const payload = token ? parseJwt(token) : null;
    const storedRole = localStorage.getItem("authRole");
    return token
      ? { token, ...(payload || {}), ...(storedRole ? { role: storedRole } : {}) }
      : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const buildUser = (token, responseUser) => {
    const payload = parseJwt(token);
    return {
      token,
      ...(responseUser || payload || {}),
    };
  };

  const signin = async (data) => {
    const res = await authApi.signin(data);
    const token = getTokenFromResponse(res.data);
    if (!token) throw new Error("Token login tidak diterima dari server");
    const newUser = buildUser(token, getUserFromResponse(res.data));
    localStorage.setItem("authToken", token);
    if (newUser.role) {
      localStorage.setItem("authRole", newUser.role);
    }
    // Store full user info for per-user progress key
    localStorage.setItem("localCurrentUser", JSON.stringify({
      id: newUser.id || newUser.sub || newUser.email,
      email: newUser.email,
      name: newUser.name || newUser.namaLengkap,
      role: newUser.role,
    }));
    setUser(newUser);
    return newUser;
  };

  const signinWithToken = (token, responseUser) => {
    if (!token) throw new Error("Token tidak boleh kosong");
    const newUser = buildUser(token, responseUser);
    localStorage.setItem("authToken", token);
    if (newUser.role) {
      localStorage.setItem("authRole", newUser.role);
    }
    localStorage.setItem("localCurrentUser", JSON.stringify({
      id: newUser.id || newUser.sub || newUser.email,
      email: newUser.email,
      name: newUser.name || newUser.namaLengkap,
      role: newUser.role,
    }));
    setUser(newUser);
    return newUser;
  };

  const signup = async (data) => {
    const res = await authApi.signup(data);
    return res;
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("localCurrentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, logout, signinWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
