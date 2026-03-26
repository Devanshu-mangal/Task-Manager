export function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2" role="status" aria-busy="true" aria-label="Loading charts">
      <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50" />
      <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50" />
    </div>
  );
}
