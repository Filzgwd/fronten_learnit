import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 detik
});

// Add Authorization header interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// "http://localhost:3000/api" + "users" => "http://localhost:3000/api/users"

// const myData = fetch("https://jsonplaceholder.typicode.com/todos/1")
//   .then((res) => res.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));

export const request = async ({ method, url, data, signal }) => {
  try {
    const res = await api({ method, url, data, signal });
    return {
      ok: true,
      data: res.data,
      status: res.status,
    };
  } catch (err) {
    if (axios.isCancel(err)) {
      return { ok: false, error: "Request cancelled", status: 499 };
    }

    const status = err.response?.status || 500;
    const error = err.response?.data?.error || err.message || "Unknown error";

    return { ok: false, error, status };
  }
};
