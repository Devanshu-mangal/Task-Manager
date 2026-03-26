import { memo, useState, useCallback } from "react";
import { TaskEditModal } from "./TaskEditModal.jsx";
import { isTaskOverdue } from "../utils/date.js";
import { notifyError } from "../utils/toast.js";

const statusBadge = {
  todo: "border-slate-500/50 bg-slate-600/40 text-slate-100",
  "in-progress": "border-amber-400/50 bg-amber-500/15 text-amber-200",
  done: "border-emerald-500/50 bg-emerald-500/15 text-emerald-200",
};

const priorityBadge = {
  low: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  medium: "border-amber-400/45 bg-amber-500/10 text-amber-200",
  high: "border-red-500/45 bg-red-500/10 text-red-300",
};

function formatDueDate(iso) {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const TaskCard = memo(function TaskCard({
  task,
  onComplete,
  onDelete,
  onPatchTask,
  onAfterMutation,
}) {
  const [editOpen, setEditOpen] = useState(false);
  const overdue = isTaskOverdue(task);

  const handleComplete = useCallback(async () => {
    try {
      await onComplete(task._id);
      onAfterMutation?.();
    } catch (err) {
      notifyError(err, "Could not update task");
    }
  }, [task._id, onComplete, onAfterMutation]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await onDelete(task._id);
      onAfterMutation?.();
    } catch (err) {
      notifyError(err, "Could not delete task");
    }
  }, [task._id, onDelete, onAfterMutation]);

  const handleSave = useCallback(
    async (id, payload) => {
      await onPatchTask(id, payload);
      onAfterMutation?.();
    },
    [onPatchTask, onAfterMutation]
  );

  const borderClass = overdue
    ? "border-red-500/70 ring-1 ring-red-500/30"
    : "border-slate-200/90 hover:border-slate-300 dark:border-slate-800/90 dark:hover:border-slate-700/90";

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border bg-white p-5 shadow-md transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl dark:bg-slate-900/50 dark:shadow-slate-950/50 ${borderClass}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">{task.title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {overdue && (
            <span className="rounded-full border border-red-500/50 bg-red-950/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-300">
              Overdue
            </span>
          )}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadge[task.status] ?? statusBadge.todo}`}
          >
            {task.status === "in-progress" ? "In progress" : task.status}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${priorityBadge[task.priority] ?? priorityBadge.medium}`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4 dark:text-slate-400">
        {task.description?.trim() ? task.description : "No description"}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <CalendarIcon className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-600" aria-hidden />
        <span className={overdue ? "font-medium text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}>
          {formatDueDate(task.dueDate)}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label={`Edit task ${task.title}`}
        >
          Edit
        </button>
        {task.status !== "done" && !task.completed && (
          <button
            type="button"
            onClick={handleComplete}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-500"
            aria-label={`Mark ${task.title} complete`}
          >
            Mark complete
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-xl border border-red-900/50 bg-red-950/20 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-950/40 dark:text-red-300"
          aria-label={`Delete task ${task.title}`}
        >
          Delete
        </button>
      </div>

      <TaskEditModal
        task={task}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </article>
  );
});

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
      />
    </svg>
  );
}
