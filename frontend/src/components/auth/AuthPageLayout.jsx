/**
 * Full-height auth shell: brand panel + card (LinkedIn-style on large screens).
 */
export function AuthPageLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100 lg:flex-row dark:bg-slate-950">
      <aside
        className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-700 via-sky-800 to-indigo-900 px-8 py-10 text-white lg:w-[min(44%,520px)] lg:min-h-screen lg:py-16 lg:pl-12 lg:pr-10"
        aria-label="Product information"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_55%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Task Manager</span>
          </div>
          <h2 className="mt-10 max-w-sm text-2xl font-semibold leading-snug tracking-tight lg:text-3xl">
            Stay on top of what matters.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-sky-100/95">
            Plan tasks, track progress, and sign in securely — the same familiar flow you know from apps you use every day.
          </p>
        </div>
        <p className="relative mt-12 text-xs text-sky-200/80 lg:mt-auto">
          © {new Date().getFullYear()} Task Manager · Private & secure
        </p>
      </aside>

      <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-md shadow-sky-900/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold tracking-tight">Task Manager</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-300/40 ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/50 dark:ring-slate-800">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>
            ) : null}
            <div className="mt-8">{children}</div>
          </div>

          {footer ? <div className="mt-8 text-center">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-400/20";

export const authLabelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

export const authPrimaryButtonClass =
  "w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow-md shadow-sky-900/20 transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900";
