import { Link } from "react-router-dom";

export function NotFound() {

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-slate-300 dark:text-slate-600" aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        to="/tasks"
        className="mt-8 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
      >
        Back to tasks
      </Link>
    </div>
  );
}
