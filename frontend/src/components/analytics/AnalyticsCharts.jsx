import { TaskPieChart } from "./TaskPieChart.jsx";
import { TaskBarChart } from "./TaskBarChart.jsx";

/**
 * Bundled analytics section for code-splitting (loaded with charts chunk).
 */
export function AnalyticsCharts({ analytics, loading, onSliceClick, onBarClick }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TaskPieChart analytics={analytics} loading={loading} onSliceClick={onSliceClick} />
      <TaskBarChart analytics={analytics} loading={loading} onBarClick={onBarClick} />
    </div>
  );
}
