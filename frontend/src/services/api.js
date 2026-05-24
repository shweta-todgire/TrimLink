import axios from "axios";
import { getSessionId } from "./session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor — attach session ID header on every request
api.interceptors.request.use(
  (config) => {
    config.headers["x-session-id"] = getSessionId();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// ─── URL API calls ──────────────────────────────────────────────────

export const shortenUrl = (originalUrl, customAlias = "", expiresIn = "") =>
  api.post("/urls/shorten", {
    originalUrl,
    customAlias,
    expiresIn,
    sessionId: getSessionId(),  // sent in body too for extra clarity
  });

// History is scoped to this session via ?sessionId=
export const getAllUrls = () =>
  api.get("/urls", { params: { sessionId: getSessionId() } });

export const getAnalytics = (code) => api.get(`/urls/${code}/analytics`);

// Delete sends sessionId in body so backend verifies ownership
export const deleteUrl = (id) =>
  api.delete(`/urls/${id}`, { data: { sessionId: getSessionId() } });

export const regenerateQr = (code) => api.get(`/urls/${code}/qr`);

export default api;

