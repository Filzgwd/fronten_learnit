import axios from "axios";
import { API_BASE_URL } from "../../config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// ─── LOCAL USER STORAGE ─────────────────────────────────────────
const LOCAL_USERS_KEY = "localUsers";
const LOCAL_CURRENT_USER_KEY = "localCurrentUser";

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function makeLocalToken(user) {
  // Simple base64 JWT-like token (not secure, for local use only)
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.namaLengkap || user.name,
      role: user.role || "user",
      sub: user.id,
    })
  );
  const sig = btoa(user.email + user.id);
  return `${header}.${payload}.${sig}`;
}

export const authApi = {
  signup: async (data) => {
    try {
      // Backend expects "name" not "namaLengkap", map the field
      const payload = {
        name: data.namaLengkap || data.name,
        email: data.email,
        password: data.password,
      };
      const res = await api.post("/auth/register", payload);
      // This backend returns token directly on registration
      return res;
    } catch (err) {
      // Backend unavailable → register locally
      if (!err.response) {
        const users = getLocalUsers();
        const exists = users.find(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (exists) {
          const error = new Error("Email sudah terdaftar");
          error.response = {
            data: { message: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." },
          };
          throw error;
        }
        const newUser = {
          id: `local_${Date.now()}`,
          namaLengkap: data.namaLengkap,
          name: data.namaLengkap,
          email: data.email,
          password: data.password,
          role: "user",
        };
        users.push(newUser);
        saveLocalUsers(users);
        const token = makeLocalToken(newUser);
        localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(newUser));
        return {
          data: { token, user: newUser },
        };
      }
      // Backend returned a real error (e.g. email already exists)
      throw err;
    }
  },

  signin: async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      // Normalize role: backend uses "student", we treat it as "user"
      if (res.data?.user?.role === "student") {
        res.data.user.role = "user";
      }
      return res;
    } catch (err) {
      // Backend unavailable → check local users
      if (!err.response) {
        const users = getLocalUsers();
        const found = users.find(
          (u) =>
            u.email.toLowerCase() === data.email.toLowerCase() &&
            u.password === data.password
        );
        if (found) {
          const token = makeLocalToken(found);
          localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(found));
          return { data: { token, user: found } };
        }

        const emailExists = users.find(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        );
        const error = new Error("Login gagal");
        error.response = {
          data: {
            message: emailExists
              ? "Password salah. Coba lagi."
              : "Email tidak ditemukan. Silakan daftar terlebih dahulu.",
          },
        };
        throw error;
      }
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
    return Promise.resolve();
  },

  forgotPassword: async (data) => {
    try {
      const res = await api.post("/auth/forgot-password", data);
      return res;
    } catch (err) {
      throw err;
    }
  },

  resetPassword: async (data) => {
    try {
      const res = await api.post("/auth/reset-password", data);
      return res;
    } catch (err) {
      throw err;
    }
  },
};

export default api;
