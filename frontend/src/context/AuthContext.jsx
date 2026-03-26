import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  api,
  getStoredToken,
  persistToken,
  setAuthToken,
  setUnauthorizedHandler,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  /** True while validating stored token or until we know there is none. */
  const [loading, setLoading] = useState(() => Boolean(getStoredToken()));
  const [error, setError] = useState(null);

  const clearSession = useCallback(() => {
    persistToken(null);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
    return () => setUnauthorizedHandler(() => {});
  }, [clearSession]);

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    /** Token just set from login/register already includes `user` — skip extra round-trip. */
    if (user) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user, clearSession]);

  const login = useCallback(async (email, password) => {
    setError(null);
    const { data } = await api.post("/api/auth/login", { email, password });
    persistToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    const { data } = await api.post("/api/auth/register", payload);
    persistToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthToken(data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      setError,
      login,
      register,
      logout,
      clearSession,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading, error, login, register, logout, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
