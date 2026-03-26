export function DashboardStats({ analytics, loading, statusFilter, onFilter, onSeedDemo, seedingDemo }) {
  if (loading && !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800/80 dark:bg-slate-800/40"
          />
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const sc = analytics.statusCounts;
  const completed =
    sc != null && typeof sc.done === "number" ? sc.done : (analytics.completedTasks ?? 0);
  const pending =
    sc != null
      ? (sc.todo ?? 0) + (sc["in-progress"] ?? 0)
      : (analytics.pendingTasks ?? 0);

  const isTotalActive = !statusFilter;
  const isCompletedActive = statusFilter === "done";
  const isPendingActive = statusFilter === "pending";

  const cards = [
    {
      key: "total",
      label: "Total tasks",
      value: analytics.totalTasks ?? 0,
      accent: "from-sky-500/20 to-slate-100 dark:to-slate-900/80",
      ring: "ring-sky-500/30",
      text: "text-slate-900 dark:text-white",
      active: isTotalActive,
      hint: "Show all tasks",
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      accent: "from-emerald-500/20 to-slate-100 dark:to-slate-900/80",
      ring: "ring-emerald-500/30",
      text: "text-slate-900 dark:text-white",
      active: isCompletedActive,
      hint: "Filter to completed (done)",
    },
    {
      key: "pending",
      label: "Pending",
      value: pending,
      accent: "from-amber-500/15 to-slate-100 dark:to-slate-900/80",
      ring: "ring-amber-500/25",
      text: "text-slate-900 dark:text-white",
      active: isPendingActive,
      hint: "Filter to todo + in progress",
    },
  ];

  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Dashboard
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Overview of your workload — click a card to filter tasks below
          </p>
        </div>
        {typeof onSeedDemo === "function" ? (
          <button
            type="button"
            onClick={onSeedDemo}
            disabled={seedingDemo}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 disabled:opacity-60 dark:border-sky-800 dark:bg-slate-900 dark:text-sky-100 dark:hover:bg-slate-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {seedingDemo ? "Adding…" : "Add 10 demo tasks"}
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onFilter(c.key)}
            title={c.hint}
            aria-pressed={c.active}
            className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${c.accent} p-5 text-left shadow-lg shadow-slate-200/50 ring-1 ${c.ring} transition hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-800/90 dark:shadow-slate-950/50 dark:hover:shadow-slate-950/60 dark:focus-visible:ring-offset-slate-900 ${
              c.active ? "ring-2 ring-sky-500 ring-offset-2 dark:ring-sky-400" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {c.label}
            </p>
            <p className={`mt-2 text-3xl font-bold tabular-nums ${c.text}`}>{c.value}</p>
            {c.active ? (
              <span className="mt-3 inline-flex items-center rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-400/20 dark:text-sky-200">
                Filter on
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </header>
  );
}
