import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080",
  withCredentials: true,
});

// Global interceptor (xohlasangiz JWT qo'shasiz)
api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error("API error:", err?.response || err);
    throw err;
  }
);
