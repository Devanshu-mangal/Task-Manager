import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./chartSetup.js";

/**
 * @param {{ analytics: { priorityCounts?: { low?: number; medium?: number; high?: number } } | null; loading?: boolean; onBarClick?: (priority: "low" | "medium" | "high") => void }} props
 */
export function TaskBarChart({ analytics, loading, onBarClick }) {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  const data = useMemo(() => {
    const pc = analytics?.priorityCounts ?? { low: 0, medium: 0, high: 0 };
    return {
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          label: "Tasks",
          data: [pc?.low ?? 0, pc?.medium ?? 0, pc?.high ?? 0],
          backgroundColor: [
            "rgba(16, 185, 129, 0.65)",
            "rgba(245, 158, 11, 0.75)",
            "rgba(239, 68, 68, 0.7)",
          ],
          borderColor: ["rgb(16, 185, 129)", "rgb(245, 158, 11)", "rgb(239, 68, 68)"],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  }, [analytics]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      onClick: (_evt, elements) => {
        if (!elements?.length || !onBarClick) return;
        const idx = elements[0].index;
        const map = ["low", "medium", "high"];
        onBarClick(map[idx]);
      },
      scales: {
        x: {
          ticks: { color: isDark ? "#94a3b8" : "#64748b" },
          grid: { color: isDark ? "rgba(148,163,184,0.15)" : "rgba(100,116,139,0.15)" },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: isDark ? "#94a3b8" : "#64748b" },
          grid: { color: isDark ? "rgba(148,163,184,0.15)" : "rgba(100,116,139,0.15)" },
        },
      },
      plugins: {
        legend: { display: false },
      },
    }),
    [isDark, onBarClick]
  );

  if (loading) {
    return null;
  }

  if (!analytics) {
    return null;
  }

  const pc = analytics.priorityCounts ?? { low: 0, medium: 0, high: 0 };
  const total = (pc.low ?? 0) + (pc.medium ?? 0) + (pc.high ?? 0);
  if (total === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No priority data yet
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">Tasks by priority</h3>
      {onBarClick ? (
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Click a bar to filter by priority</p>
      ) : null}
      <div className="h-[calc(100%-2rem)]">
        <Bar data={data} options={options} aria-label="Bar chart of tasks by priority" />
      </div>
    </div>
  );
}
