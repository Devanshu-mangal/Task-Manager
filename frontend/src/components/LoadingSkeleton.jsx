export function LoadingSkeleton({ count = 5 }) {
  const n = Math.min(Math.max(count, 3), 5);
  return (
    <ul
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-busy="true"
      aria-label="Loading tasks"
    >
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800/90 dark:bg-slate-900/40">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-3/5 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700/80" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700/60" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700/60" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800/80" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800/80" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800/80" />
          </div>
          <div className="mt-4 h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800/60" />
          <div className="mt-5 flex gap-2">
            <div className="h-9 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800/80" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800/80" />
            <div className="h-9 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800/80" />
          </div>
        </li>
      ))}
    </ul>
  );
}
