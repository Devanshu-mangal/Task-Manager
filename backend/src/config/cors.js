/**
 * CORS configuration: permissive in development; strict in production when CORS_ORIGIN is set.
 */
export function getCorsOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const raw = process.env.CORS_ORIGIN;

  if (!isProd) {
    return { origin: true, credentials: true };
  }

  const list = raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (list.length === 0) {
    console.warn(
      "CORS_ORIGIN is not set in production. Allowing all origins; set CORS_ORIGIN to your frontend URL(s) for strict CORS."
    );
    return { origin: true, credentials: true };
  }

  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (list.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  };
}
