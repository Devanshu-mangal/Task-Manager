import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthPageLayout, authInputClass, authLabelClass, authPrimaryButtonClass } from "../components/auth/AuthPageLayout.jsx";
import { ErrorAlert } from "../components/common/ErrorAlert.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { notify } from "../utils/toast.js";

export function Register() {
  const { register, isAuthenticated, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <LoadingSpinner fullPage label="Checking session" />;
  }

  if (!loading && isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ email, password, name: name || undefined });
      notify.registerSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      const errs = err.response?.data?.errors;
      const full =
        errs?.length ? errs.map((x) => x.msg || x).join(", ") : msg || err.message || "Registration failed";
      setError(full);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Join Task Manager to organize work, set priorities, and track progress in one place."
      footer={
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Already on Task Manager?{" "}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300">
            Sign in
          </Link>
        </p>
      }
    >
      <ErrorAlert message={error} onDismiss={() => setError(null)} variant="auth" title="Registration failed" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className={authLabelClass}>
          Name <span className="font-normal text-slate-500 dark:text-slate-500">(optional)</span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={authInputClass}
          />
        </label>
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
          Password <span className="text-slate-500 dark:text-slate-500">(min. 6 characters)</span>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Create a password"
            className={authInputClass}
          />
        </label>
        <button type="submit" disabled={submitting} className={authPrimaryButtonClass}>
          {submitting ? "Creating account…" : "Agree & join"}
        </button>
        <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
          By clicking Agree & join, you agree to use this app responsibly.
        </p>
      </form>
    </AuthPageLayout>
  );
}
