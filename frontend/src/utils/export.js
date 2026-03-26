/**
 * @param {Array<{ title?: string; description?: string; status?: string; priority?: string; dueDate?: string | null }>} tasks
 */
export function tasksToCsvRows(tasks) {
  const header = ["title", "description", "status", "priority", "dueDate"];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(",")];
  for (const t of tasks) {
    const due = t.dueDate ? new Date(t.dueDate).toISOString() : "";
    lines.push(
      [t.title, t.description ?? "", t.status ?? "", t.priority ?? "", due].map(escape).join(",")
    );
  }
  return lines.join("\r\n");
}

export function downloadTextFile(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTasksCsv(tasks, filename = "tasks.csv") {
  downloadTextFile(filename, tasksToCsvRows(tasks), "text/csv;charset=utf-8");
}

export function exportTasksJson(tasks, filename = "tasks.json") {
  const payload = tasks.map((t) => ({
    title: t.title,
    description: t.description ?? "",
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ?? null,
  }));
  downloadTextFile(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

/**
 * @param {Array<{ title?: string; description?: string; status?: string; priority?: string; dueDate?: string | null }>} tasks
 */
export async function exportTasksExcel(tasks, filename = "tasks.xlsx") {
  const XLSX = await import("xlsx");
  const rows = tasks.map((t) => ({
    title: t.title ?? "",
    description: t.description ?? "",
    status: t.status ?? "",
    priority: t.priority ?? "",
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tasks");
  XLSX.writeFile(wb, filename);
}
