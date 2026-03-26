import { memo } from "react";

/**
 * Filters row: search + status + priority (API query params).
 * Sort controls on a second row to keep the primary filter strip compact.
 */
export const Filters = memo(function Filters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
}) {
  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700/90 dark:bg-slate-950/80 dark:text-white dark:placeholder:text-slate-500";

  const selectClass =
    "w-full min-w-[140px] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700/90 dark:bg-slate-950/80 dark:text-white";

  return (
    <section className="space-y-3" aria-label="Task filters">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <label className="min-w-0 flex-1 flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title…"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label className="w-full lg:w-44 flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          Status
          <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={selectClass}>
            <option value="">All statuses</option>
            <option value="pending">Pending (todo + in progress)</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="w-full lg:w-44 flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          Priority
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={selectClass}
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-3 dark:border-slate-800/80">
        <span className="text-xs font-medium text-slate-500">Sort</span>
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="sr-only">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="createdAt">Created</option>
            <option value="dueDate">Due date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="sr-only">Order</span>
          <select
            value={order}
            onChange={(e) => onOrderChange(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </label>
      </div>
    </section>
  );
});
