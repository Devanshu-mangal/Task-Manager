/**
 * Dismissible inline alert for API, server, and auth-related messages.
 */
const variants = {
  error: "border-red-500/40 bg-red-950/50 text-red-200",
  server: "border-orange-500/35 bg-orange-950/40 text-orange-200",
  auth:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100",
};

export function ErrorAlert({ message, onDismiss, variant = "error", title }) {
  if (!message) return null;
  const styles = variants[variant] ?? variants.error;

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}
      role="alert"
    >
      <div className="min-w-0">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <span className="break-words">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
