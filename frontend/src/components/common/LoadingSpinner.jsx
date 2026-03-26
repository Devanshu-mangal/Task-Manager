/**
 * Full-page or inline loading indicator (auth bootstrap, protected routes).
 */
export function LoadingSpinner({ label = "Loading", className = "", fullPage = false }) {
  const wrapper = fullPage
    ? "flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4"
    : "inline-flex items-center gap-2";

  return (
    <div className={`${wrapper} ${className}`} role="status" aria-live="polite" aria-busy="true">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
      {fullPage && <p className="text-sm text-slate-400">{label}…</p>}
    </div>
  );
}
