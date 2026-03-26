import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

/**
 * Loads up to 500 tasks for board view (no status filter; optional search/priority).
 */
export function useKanbanTasks({ enabled, debouncedSearch, priority }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const key = JSON.stringify({ debouncedSearch, priority });

  const fetchBoard = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 500,
        sortBy: "createdAt",
        order: "desc",
      };
      if (priority) params.priority = priority;
      if (debouncedSearch?.trim()) params.search = debouncedSearch.trim();
      const { data } = await api.get("/api/tasks", { params });
      setTasks(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, key]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const moveTaskLocal = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        String(t._id) === String(taskId)
          ? {
              ...t,
              status: newStatus,
              completed: newStatus === "done",
            }
          : t
      )
    );
  }, []);

  const rollbackTasks = useCallback((snapshot) => {
    setTasks(snapshot);
  }, []);

  return {
    tasks,
    loading,
    refetch: fetchBoard,
    setTasks,
    moveTaskLocal,
    rollbackTasks,
  };
}
