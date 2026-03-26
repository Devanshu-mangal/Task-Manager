import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: baseURL || undefined,
  headers: { "Content-Type": "application/json" },
});

/** Called when an authenticated request returns 401 (expired / invalid token). */
let onUnauthorized = () => {};

export function setUnauthorizedHandler(fn) {
  onUnauthorized = typeof fn === "function" ? fn : () => {};
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function persistToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadAuth = Boolean(error.config?.headers?.Authorization);
    if (status === 401 && hadAuth) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);
