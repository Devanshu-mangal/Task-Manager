import { useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn.jsx";

const COLUMNS = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

function groupTasks(tasks) {
  const g = { todo: [], "in-progress": [], done: [] };
  for (const t of tasks) {
    let s = t.status;
    if (s === "done" || t.completed) s = "done";
    if (!g[s]) s = "todo";
    g[s].push(t);
  }
  return g;
}

export function KanbanBoard({ tasks, onStatusChange }) {
  const grouped = useMemo(() => groupTasks(tasks), [tasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    const newStatus = destination.droppableId;
    await onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="flex flex-col gap-4 lg:flex-row lg:items-start"
        role="region"
        aria-label="Kanban board"
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            columnId={col.id}
            title={col.title}
            tasks={grouped[col.id] ?? []}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
