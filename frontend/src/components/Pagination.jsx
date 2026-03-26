function getPageNumbers(current, total) {
  if (total <= 1) return [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}

export function Pagination({ pagination, onPageChange, loading }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;
  const items = getPageNumbers(page, totalPages);

  const btnBase =
    "min-w-[2.25rem] rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950";
  const btnIdle =
    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";
  const btnActive = "border-sky-500 bg-sky-600 text-white dark:bg-sky-600";
  const btnDisabled = "cursor-not-allowed opacity-40";

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
      role="navigation"
    >
      <button
        type="button"
        disabled={loading || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${btnBase} ${btnIdle} ${loading || page <= 1 ? btnDisabled : ""}`}
        aria-label="Previous page"
      >
        Previous
      </button>

      <ul className="flex flex-wrap items-center gap-1">
        {items.map((item, i) =>
          item === "ellipsis" ? (
            <li key={`e-${i}`} className="px-2 text-slate-400 dark:text-slate-500" aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                disabled={loading}
                onClick={() => onPageChange(item)}
                className={`${btnBase} ${item === page ? btnActive : btnIdle} ${
                  loading ? btnDisabled : ""
                }`}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        disabled={loading || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${btnBase} ${btnIdle} ${loading || page >= totalPages ? btnDisabled : ""}`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
