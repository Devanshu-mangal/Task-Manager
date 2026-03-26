import { Link, useNavigate } from "react-router-dom";

export function ServerError() {
  const navigate = useNavigate();


  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-slate-300 dark:text-slate-600" aria-hidden>
        500
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Something went wrong</h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
        We could not complete this request. Try again or return to the dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Go back
        </button>
        <Link
          to="/tasks"
          className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
