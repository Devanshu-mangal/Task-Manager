import { memo, useMemo } from "react";
import { TaskCard } from "./TaskCard.jsx";

export const TaskList = memo(function TaskList({
  tasks,
  onComplete,
  onDelete,
  onPatchTask,
  onAfterMutation,
}) {
  const items = useMemo(
    () =>
      tasks.map((task) => (
        <li key={task._id} className="min-h-0">
          <TaskCard
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            onPatchTask={onPatchTask}
            onAfterMutation={onAfterMutation}
          />
        </li>
      )),
    [tasks, onComplete, onDelete, onPatchTask, onAfterMutation]
  );

  return (
    <ul
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      role="list"
      aria-label="Task list"
    >
      {items}
    </ul>
  );
});
