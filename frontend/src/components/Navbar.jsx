import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { notify } from "../utils/toast.js";

const TASK_PATHS = new Set(["/", "/tasks", "/dashboard"]);

export function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const tasksActive = TASK_PATHS.has(pathname);

  const handleLogout = () => {
    logout();
    notify.logoutSuccess();
    navigate("/login", { replace: true });
  };

  const cycleTheme = () => {
    const order = ["light", "dark", "system"];
    const i = order.indexOf(mode);
    setMode(order[(i + 1) % order.length]);
  };

  const themeLabel =
    mode === "light" ? "Light theme" : mode === "dark" ? "Dark theme" : "System theme";

  const tasksLinkClass = `px-3 py-2 rounded-lg text-sm font-medium transition ${
    tasksActive
      ? "bg-slate-200 text-sky-700 dark:bg-slate-800 dark:text-sky-400"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
  }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/tasks"
          className="group flex flex-col leading-tight text-slate-900 transition hover:opacity-90 dark:text-white"
          aria-label="Task Manager home"
        >
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text font-extrabold text-transparent dark:from-sky-400 dark:to-cyan-400">
            Task Manager
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:block dark:text-slate-500">
            Dashboard
          </span>
        </Link>

        <nav
          className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={cycleTheme}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            title={themeLabel}
            aria-label={`Theme: ${themeLabel}. Click to cycle.`}
          >
            {mode === "light" ? "☀" : mode === "dark" ? "🌙" : "◐"}
          </button>

          {loading && isAuthenticated ? (
            <span className="text-xs text-slate-500">…</span>
          ) : null}
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className={tasksLinkClass}>
                Tasks
              </Link>
              <div className="hidden h-6 w-px bg-slate-300 dark:bg-slate-700 sm:block" aria-hidden />
              <div className="flex min-w-0 max-w-[min(200px,40vw)] flex-col items-end text-right sm:items-start sm:text-left">
                <span className="truncate text-sm font-medium text-slate-900 dark:text-white" title={user?.email}>
                  {displayName}
                </span>
                <span
                  className="hidden truncate text-xs text-slate-500 dark:text-slate-500 sm:block"
                  title={user?.email}
                >
                  {user?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                aria-label="Log out"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-200 text-sky-700 dark:bg-slate-800 dark:text-sky-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
                  }`
                }
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-200 text-sky-700 dark:bg-slate-800 dark:text-sky-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
