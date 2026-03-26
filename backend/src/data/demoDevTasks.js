/**
 * Templates for POST /api/tasks/seed-demo — software-development themed sample work.
 * `daysDue` is offset from “today” when seeding (negative = overdue).
 */
export const demoDevTaskTemplates = [
  {
    title: "Implement JWT refresh token flow",
    description: "Add optional refresh cookie, rotation, and revoke list in Redis or DB.",
    status: "in-progress",
    priority: "high",
    daysDue: 2,
  },
  {
    title: "Write integration tests for /api/tasks",
    description: "Cover pagination, filters, analytics, and auth errors with supertest.",
    status: "todo",
    priority: "high",
    daysDue: 4,
  },
  {
    title: "Refactor Task model indexes",
    description: "Add compound index on user + status; verify explain() for list query.",
    status: "todo",
    priority: "medium",
    daysDue: 6,
  },
  {
    title: "Code review: PR #42 — Kanban drag-and-drop",
    description: "Check accessibility, optimistic updates, and rollback on API failure.",
    status: "in-progress",
    priority: "medium",
    daysDue: 1,
  },
  {
    title: "Document REST API in OpenAPI 3",
    description: "Publish /api/tasks and /api/auth paths; add examples for 401/400.",
    status: "done",
    priority: "medium",
    daysDue: -1,
  },
  {
    title: "Fix N+1 query on user dashboard",
    description: "Batch-load related docs or use aggregation for analytics counts.",
    status: "done",
    priority: "high",
    daysDue: -3,
  },
  {
    title: "Set up GitHub Actions: lint + test",
    description: "Node 20, cache npm, run on PR and main; fail on coverage drop.",
    status: "todo",
    priority: "medium",
    daysDue: 5,
  },
  {
    title: "Spike: migrate charts to lighter bundle",
    description: "Evaluate uPlot or vanilla canvas vs Chart.js for dashboard charts.",
    status: "todo",
    priority: "low",
    daysDue: 10,
  },
  {
    title: "On-call: investigate 500s on /api/tasks/analytics",
    description: "Reproduce with staging data; fix ObjectId match in aggregation pipeline.",
    status: "in-progress",
    priority: "high",
    daysDue: 0,
  },
  {
    title: "Sprint demo: record Loom walkthrough",
    description: "5 min — login, create task, board view, export CSV.",
    status: "todo",
    priority: "low",
    daysDue: 7,
  },
];
