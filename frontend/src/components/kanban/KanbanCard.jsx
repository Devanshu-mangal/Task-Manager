import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";

function priorityClass(p) {
  if (p === "high") return "text-red-600 dark:text-red-400";
  if (p === "medium") return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

export const KanbanCard = memo(function KanbanCard({ task, index }) {
  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition dark:border-slate-700 dark:bg-slate-800/90 ${
            snapshot.isDragging ? "ring-2 ring-sky-500 ring-opacity-60" : ""
          }`}
          role="listitem"
          aria-label={`Task: ${task.title}`}
        >
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
          {task.description ? (
            <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{task.description}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-slate-500">
            <span className={`font-medium ${priorityClass(task.priority)}`}>{task.priority}</span>
            {task.dueDate ? (
              <span className="text-slate-400">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            ) : null}
          </div>
        </article>
      )}
    </Draggable>
  );
});
