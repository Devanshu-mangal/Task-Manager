import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthPageLayout, authInputClass, authLabelClass, authPrimaryButtonClass } from "../components/auth/AuthPageLayout.jsx";
import { ErrorAlert } from "../components/common/ErrorAlert.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { notify } from "../utils/toast.js";

export function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/tasks";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <LoadingSpinner fullPage label="Checking session" />;
  }

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      notify.loginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="Sign in"
      subtitle="Welcome back. Enter your email and password to open your tasks."
      footer={
        <p className="text-sm text-slate-600 dark:text-slate-400">
          New to Task Manager?{" "}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300">
            Create an account
          </Link>
        </p>
      }
    >
      <ErrorAlert
        message={error}
        onDismiss={() => setError(null)}
        variant="auth"
        title="Could not sign you in"
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className={authLabelClass}>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className={authInputClass}
          />
        </label>
        <label className={authLabelClass}>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className={authInputClass}
          />
        </label>
        <button type="submit" disabled={submitting} className={authPrimaryButtonClass}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthPageLayout>
  );
}
