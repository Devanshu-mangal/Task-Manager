import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { useTasks } from "../hooks/useTasks.js";
import { useKanbanTasks } from "../hooks/useKanbanTasks.js";
import { DashboardStats } from "../components/DashboardStats.jsx";
import { ChartsSkeleton } from "../components/analytics/ChartsSkeleton.jsx";
import { Filters } from "../components/Filters.jsx";

const AnalyticsCharts = lazy(() =>
  import("../components/analytics/AnalyticsCharts.jsx").then((m) => ({ default: m.AnalyticsCharts }))
);
const KanbanBoard = lazy(() =>
  import("../components/kanban/KanbanBoard.jsx").then((m) => ({ default: m.KanbanBoard }))
);
import { TaskForm } from "../components/TaskForm.jsx";
import { TaskList } from "../components/TaskList.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { ErrorAlert } from "../components/common/ErrorAlert.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { exportTasksCsv, exportTasksExcel } from "../utils/export.js";
import { notify, notifyError } from "../utils/toast.js";

export function Tasks() {
  const [viewMode, setViewMode] = useState("list");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [exporting, setExporting] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters = useMemo(
    () => ({
      page,
      limit: 9,
      sortBy,
      order,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    }),
    [page, sortBy, order, status, priority, debouncedSearch]
  );

  const {
    tasks,
    pagination,
    analytics,
    loading,
    error,
    setError,
    createTaskOptimistic,
    patchTaskOptimistic,
    deleteTaskOptimistic,
    completeTaskOptimistic,
    refetch: refetchTasks,
  } = useTasks(filters);

  const {
    tasks: kanbanTasks,
    loading: kanbanLoading,
    refetch: refetchKanban,
    moveTaskLocal,
    rollbackTasks,
  } = useKanbanTasks({
    enabled: viewMode === "board",
    debouncedSearch,
    priority,
  });

  const hasActiveFilters = Boolean(status || priority || debouncedSearch.trim());

  const boardTasksFiltered = useMemo(() => {
    if (!status) return kanbanTasks;
    if (status === "pending") {
      return kanbanTasks.filter((t) => t.status !== "done" && !t.completed);
    }
    if (status === "done") {
      return kanbanTasks.filter((t) => t.status === "done" || t.completed);
    }
    return kanbanTasks.filter((t) => t.status === status);
  }, [kanbanTasks, status]);

  const handleDashboardFilter = useCallback((key) => {
    setPage(1);
    if (key === "total") {
      setStatus("");
      setPriority("");
      setSearch("");
      setDebouncedSearch("");
    } else if (key === "completed") {
      setStatus("done");
    } else if (key === "pending") {
      setStatus("pending");
    }
  }, []);

  const clearTaskFilters = useCallback(() => {
    setPage(1);
    setStatus("");
    setPriority("");
    setSearch("");
    setDebouncedSearch("");
  }, []);

  const filterBannerLabel = useMemo(() => {
    if (!status && !priority) return null;
    const parts = [];
    if (status === "pending") parts.push("status: pending (todo + in progress)");
    else if (status) parts.push(`status: ${status}`);
    if (priority) parts.push(`priority: ${priority}`);
    return parts.join(" · ");
  }, [status, priority]);

  const handleSeedDemoTasks = useCallback(async () => {
    setSeedingDemo(true);
    try {
      const { data } = await api.post("/api/tasks/seed-demo");
      await refetchTasks();
      if (viewMode === "board") await refetchKanban();
      const n = typeof data?.count === "number" ? data.count : 10;
      notify.demoTasksAdded(n);
    } catch (err) {
      notifyError(err, "Could not add demo tasks");
    } finally {
      setSeedingDemo(false);
    }
  }, [refetchTasks, refetchKanban, viewMode]);

  const scrollToCreate = useCallback(() => {
    document.getElementById("create-task-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSearchChange = useCallback((v) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((v) => {
    setStatus(v);
    setPage(1);
  }, []);

  const handlePriorityChange = useCallback((v) => {
    setPriority(v);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((v) => {
    setSortBy(v);
    setPage(1);
  }, []);

  const handleOrderChange = useCallback((v) => {
    setOrder(v);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p) => {
    setPage(p);
  }, []);

  const handleCreateTask = useCallback(
    async (payload) => {
      await createTaskOptimistic(payload);
      if (viewMode === "board") await refetchKanban();
    },
    [createTaskOptimistic, refetchKanban, viewMode]
  );

  const handleAfterMutation = useCallback(async () => {
    if (viewMode === "board") await refetchKanban();
  }, [refetchKanban, viewMode]);

  const handleKanbanStatusChange = useCallback(
    async (taskId, newStatus) => {
      const snap = [...kanbanTasks];
      moveTaskLocal(taskId, newStatus);
      try {
        await patchTaskOptimistic(taskId, { status: newStatus }, { silentNotify: true });
        await refetchKanban();
        notify.taskUpdated();
      } catch {
        rollbackTasks(snap);
      }
    },
    [kanbanTasks, moveTaskLocal, patchTaskOptimistic, refetchKanban, rollbackTasks]
  );

  const handleExport = useCallback(
    async (format) => {
      setExporting(true);
      try {
        const { data } = await api.get("/api/tasks", {
          params: {
            page: 1,
            limit: 500,
            sortBy: "createdAt",
            order: "desc",
            ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
            ...(priority ? { priority } : {}),
            ...(status ? { status } : {}),
          },
        });
        const rows = Array.isArray(data?.data) ? data.data : [];
        if (format === "csv") exportTasksCsv(rows);
        else await exportTasksExcel(rows);
        notify.exportSuccess();
      } catch {
        notify.exportFailed();
      } finally {
        setExporting(false);
      }
    },
    [debouncedSearch, priority, status]
  );

  const chartsLoading = loading && !analytics?.statusCounts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 dark:border-slate-800/80 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tasks</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Manage priorities, due dates, and status. Toggle list or board view.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-xl border border-slate-200 p-1 dark:border-slate-700"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-sky-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              List view
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                viewMode === "board"
                  ? "bg-sky-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              Board view
            </button>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Export tasks">
            <button
              type="button"
              disabled={exporting}
              onClick={() => handleExport("csv")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Export CSV
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => handleExport("xlsx")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <DashboardStats
          analytics={analytics}
          loading={loading}
          statusFilter={status}
          onFilter={handleDashboardFilter}
          onSeedDemo={handleSeedDemoTasks}
          seedingDemo={seedingDemo}
        />

        {filterBannerLabel ? (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
          >
            <span>
              <span className="font-semibold">Active filters: </span>
              {filterBannerLabel}
            </span>
            <button
              type="button"
              onClick={clearTaskFilters}
              className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600"
            >
              Clear all
            </button>
          </div>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 ring-1 ring-slate-200/80 dark:border-slate-800/90 dark:bg-slate-900/25 dark:ring-slate-800/50">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Filters</h2>
          <Filters
            search={search}
            onSearchChange={handleSearchChange}
            status={status}
            onStatusChange={handleStatusChange}
            priority={priority}
            onPriorityChange={handlePriorityChange}
            sortBy={sortBy}
            onSortByChange={handleSortByChange}
            order={order}
            onOrderChange={handleOrderChange}
          />
        </section>

        <section aria-labelledby="tasks-main-heading" className="space-y-4">
          <div>
            <h2 id="tasks-main-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Your tasks
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {viewMode === "list"
                ? "List view — cards in a grid. Switch to board for columns by status."
                : "Board view — drag cards between Todo, In progress, and Done."}
            </p>
          </div>

          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
            variant="server"
            title="Could not load tasks"
          />

          {viewMode === "list" && (
            <>
              {loading && !tasks.length ? (
                <LoadingSkeleton count={5} />
              ) : tasks.length === 0 ? (
                <EmptyState hasActiveFilters={hasActiveFilters} onCreateClick={scrollToCreate} />
              ) : (
                <TaskList
                  tasks={tasks}
                  onComplete={completeTaskOptimistic}
                  onDelete={deleteTaskOptimistic}
                  onPatchTask={patchTaskOptimistic}
                  onAfterMutation={handleAfterMutation}
                />
              )}
              <Pagination pagination={pagination} loading={loading} onPageChange={handlePageChange} />
            </>
          )}

          {viewMode === "board" && (
            <div className="space-y-4">
              {kanbanLoading ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40"
                    />
                  ))}
                </div>
              ) : kanbanTasks.length === 0 ? (
                <EmptyState hasActiveFilters={hasActiveFilters} onCreateClick={scrollToCreate} />
              ) : (
                <Suspense
                  fallback={
                    <div className="grid gap-4 lg:grid-cols-3" aria-hidden>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40"
                        />
                      ))}
                    </div>
                  }
                >
                  <KanbanBoard tasks={boardTasksFiltered} onStatusChange={handleKanbanStatusChange} />
                </Suspense>
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="charts-heading" className="space-y-4">
          <h2 id="charts-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Analytics
          </h2>
          {chartsLoading ? (
            <ChartsSkeleton />
          ) : (
            <Suspense fallback={<ChartsSkeleton />}>
              <AnalyticsCharts
                analytics={analytics}
                loading={loading}
                onSliceClick={(s) => {
                  setStatus(s);
                  setPage(1);
                }}
                onBarClick={(p) => {
                  setPriority(p);
                  setPage(1);
                }}
              />
            </Suspense>
          )}
        </section>

        <section aria-labelledby="create-heading" className="space-y-3">
          <h2 id="create-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            New task
          </h2>
          <TaskForm onCreateTask={handleCreateTask} />
        </section>
      </div>
    </div>
  );
}
