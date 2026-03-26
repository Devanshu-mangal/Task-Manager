import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./chartSetup.js";

/**
 * @param {{ analytics: { statusCounts?: object; totalTasks?: number } | null; loading?: boolean; onSliceClick?: (status: "done" | "todo" | "in-progress") => void }} props
 */
export function TaskPieChart({ analytics, loading, onSliceClick }) {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  const data = useMemo(() => {
    const sc = analytics?.statusCounts;
    const todo = sc?.todo ?? 0;
    const prog = sc?.["in-progress"] ?? 0;
    const done = sc?.done ?? 0;
    return {
      labels: ["Completed", "Pending (Todo)", "In progress"],
      datasets: [
        {
          data: [done, todo, prog],
          backgroundColor: [
            "rgba(16, 185, 129, 0.75)",
            "rgba(100, 116, 139, 0.75)",
            "rgba(245, 158, 11, 0.85)",
          ],
          borderColor: ["rgb(16, 185, 129)", "rgb(100, 116, 139)", "rgb(245, 158, 11)"],
          borderWidth: 1,
        },
      ],
    };
  }, [analytics]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      onClick: (_evt, elements) => {
        if (!elements?.length || !onSliceClick) return;
        const idx = elements[0].index;
        const map = ["done", "todo", "in-progress"];
        onSliceClick(map[idx]);
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: isDark ? "#e2e8f0" : "#334155",
            padding: 16,
            font: { size: 12 },
          },
        },
      },
    }),
    [isDark, onSliceClick]
  );

  if (loading) {
    return null;
  }

  if (!analytics) {
    return null;
  }

  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No status data yet
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">Tasks by status</h3>
      {onSliceClick ? (
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Click a slice to filter the list</p>
      ) : null}
      <div className="h-[calc(100%-2rem)]">
        <Pie data={data} options={options} aria-label="Pie chart of tasks by status" />
      </div>
    </div>
  );
}
