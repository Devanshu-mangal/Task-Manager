import toast from "react-hot-toast";

/** Centralized success / error toasts for consistent UX. */
export const notify = {
  taskCreated: () => toast.success("Task created"),
  taskUpdated: () => toast.success("Task updated"),
  taskDeleted: () => toast.success("Task deleted"),
  taskCompleted: () => toast.success("Task marked complete"),
  loginSuccess: () => toast.success("Welcome back!"),
  registerSuccess: () => toast.success("Account created"),
  logoutSuccess: () => toast.success("Signed out"),
  exportSuccess: (label = "Tasks exported") => toast.success(label),
  exportFailed: () => toast.error("Export failed"),
  demoTasksAdded: (n = 10) => toast.success(`Added ${n} demo developer tasks`),
};

/**
 * @param {unknown} err - Axios error or Error
 * @param {string} [fallback] - Message when response has no body
 */
export function notifyError(err, fallback = "Something went wrong") {
  const msg =
    err?.response?.data?.message ||
    (Array.isArray(err?.response?.data?.errors) &&
      err.response.data.errors.map((e) => e.msg || e.message).filter(Boolean).join(", ")) ||
    err?.message ||
    fallback;
  toast.error(typeof msg === "string" ? msg : fallback);
}

export { toast };
