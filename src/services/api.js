import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
});

export const request = async ({ method, url, data, params, headers, signal }) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
      headers,
      signal,
    });
    return {
      ok: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.response?.status || 500,
      error: error.response?.data || error.message,
    };
  }
};

export default api;
