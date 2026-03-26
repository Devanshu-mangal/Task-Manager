import { useState, useCallback } from "react";
import { notifyError } from "../utils/toast.js";
import { ErrorAlert } from "./common/ErrorAlert.jsx";

const empty = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export function TaskForm({ onCreateTask }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        ...(form.dueDate
          ? { dueDate: new Date(form.dueDate + "T12:00:00").toISOString() }
          : {}),
      };
      await onCreateTask(payload);
      setForm(empty);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not create task");
      notifyError(err, "Could not create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="create-task-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 p-5 shadow-lg ring-1 ring-slate-200/80 dark:border-slate-800/90 dark:from-slate-900/80 dark:to-slate-950/80 dark:ring-slate-800/50"
    >
      <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Create task</h2>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-500">
        Add a title, optional details, status, priority, and due date.
      </p>
      <ErrorAlert message={error} onDismiss={() => setError(null)} variant="error" title="Could not create task" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 sm:col-span-2">
          Title *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 sm:col-span-2">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          Priority
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 sm:col-span-2">
          Due date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:bg-sky-500 disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {submitting ? "Creating…" : "Create task"}
      </button>
    </form>
  );
}
