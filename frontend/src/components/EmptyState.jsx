export function EmptyState({ hasActiveFilters, onCreateClick }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700/90 dark:bg-slate-900/30"
      role="status"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200/80 text-sky-600 ring-1 ring-slate-300 dark:bg-slate-800/80 dark:text-sky-400 dark:ring-slate-700/80">
        <ClipboardIcon className="h-8 w-8" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No tasks found</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        {hasActiveFilters
          ? "Try adjusting filters or create a task that matches."
          : "Create your first task to get started."}
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
      >
        {hasActiveFilters ? "Create task" : "Create your first task"}
      </button>
    </div>
  );
}

function ClipboardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
      />
    </svg>
  );
}
