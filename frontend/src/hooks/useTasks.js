import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";
import { notify, notifyError } from "../utils/toast.js";

const defaultParams = {
  page: 1,
  limit: 9,
  sortBy: "createdAt",
  order: "desc",
};

function sameTaskId(a, b) {
  return String(a) === String(b);
}

export function useTasks(filters = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryKey = JSON.stringify({ ...defaultParams, ...filters });

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data: a } = await api.get("/api/tasks/analytics");
      setAnalytics(a);
    } catch {
      /* keep prior analytics; never throw — used after mutations */
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = { ...defaultParams, ...filters };
    try {
      const listRes = await api.get("/api/tasks", { params });
      setData(listRes.data.data);
      setPagination(listRes.data.pagination);
      try {
        const analyticsRes = await api.get("/api/tasks/analytics");
        setAnalytics(analyticsRes.data);
      } catch {
        setAnalytics(null);
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to load tasks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTaskOptimistic = useCallback(
    async (payload) => {
      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        _id: tempId,
        ...payload,
        status: payload.status || "todo",
        priority: payload.priority || "medium",
        createdAt: new Date().toISOString(),
      };
      setData((prev) => [optimistic, ...prev]);
      try {
        const { data: created } = await api.post("/api/tasks", payload);
        setData((prev) => prev.map((t) => (sameTaskId(t._id, tempId) ? created : t)));
        await fetchAnalytics();
        notify.taskCreated();
        return created;
      } catch (e) {
        setData((prev) => prev.filter((t) => !sameTaskId(t._id, tempId)));
        notifyError(e, "Could not create task");
        throw e;
      }
    },
    [fetchAnalytics]
  );

  const patchTaskOptimistic = useCallback(
    async (id, body, { silentNotify = false } = {}) => {
      let previous;
      setData((prev) => {
        previous = prev.find((t) => sameTaskId(t._id, id));
        if (!previous) return prev;
        return prev.map((t) => {
          if (!sameTaskId(t._id, id)) return t;
          const next = { ...t, ...body };
          if (body.status === "done" || body.completed === true) {
            next.completed = true;
            next.status = "done";
          }
          if (body.status && body.status !== "done") {
            next.completed = false;
          }
          return next;
        });
      });
      if (!previous) return null;
      try {
        const { data: updated } = await api.patch(`/api/tasks/${id}`, body);
        setData((prev) => prev.map((t) => (sameTaskId(t._id, id) ? updated : t)));
        await fetchAnalytics();
        if (!silentNotify) notify.taskUpdated();
        return updated;
      } catch (e) {
        setData((prev) => prev.map((t) => (sameTaskId(t._id, id) ? previous : t)));
        notifyError(e, "Could not update task");
        throw e;
      }
    },
    [fetchAnalytics]
  );

  const deleteTaskOptimistic = useCallback(
    async (id) => {
      let snapshot;
      setData((prev) => {
        snapshot = prev;
        return prev.filter((t) => !sameTaskId(t._id, id));
      });
      try {
        await api.delete(`/api/tasks/${id}`);
        await fetchAnalytics();
        notify.taskDeleted();
      } catch (e) {
        if (snapshot) setData(snapshot);
        notifyError(e, "Could not delete task");
        throw e;
      }
    },
    [fetchAnalytics]
  );

  const completeTaskOptimistic = useCallback(
    async (id) => {
      let previous;
      setData((prev) => {
        previous = prev.find((t) => sameTaskId(t._id, id));
        return prev.map((t) =>
          sameTaskId(t._id, id) ? { ...t, status: "done", completed: true } : t
        );
      });
      if (!previous) return;
      try {
        const { data: updated } = await api.patch(`/api/tasks/${id}/complete`);
        setData((prev) => prev.map((t) => (sameTaskId(t._id, id) ? updated : t)));
        await fetchAnalytics();
        notify.taskCompleted();
        return updated;
      } catch (e) {
        setData((prev) => prev.map((t) => (sameTaskId(t._id, id) ? previous : t)));
        notifyError(e, "Could not update task");
        throw e;
      }
    },
    [fetchAnalytics]
  );

  return {
    tasks: data,
    pagination,
    analytics,
    loading,
    error,
    refetch: fetchTasks,
    setError,
    fetchAnalytics,
    createTaskOptimistic,
    patchTaskOptimistic,
    deleteTaskOptimistic,
    completeTaskOptimistic,
    setTasksLocal: setData,
  };
}
