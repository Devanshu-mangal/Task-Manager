import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard.jsx";

export function KanbanColumn({ columnId, title, tasks }) {
  return (
    <div className="flex min-h-[320px] min-w-[260px] flex-1 flex-col rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <div className="text-xs text-slate-500">{(tasks.length)} tasks</div>
      </div>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 transition-colors ${
              snapshot.isDraggingOver ? "bg-sky-50/80 dark:bg-sky-950/30" : ""
            }`}
            role="list"
            aria-label={`${title} column`}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
