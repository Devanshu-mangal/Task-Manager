# Task Manager — tech stack and dashboard architecture

This document describes the **technologies** used in the project and the **production-style dashboard UI** built with React and Tailwind CSS.

---

## Repository layout

| Path | Responsibility |
|------|------------------|
| `backend/` | Node.js + Express REST API, MongoDB (Mongoose), JWT auth |
| `frontend/` | React (Vite) SPA, Tailwind CSS, React Router |

---

## Backend (summary)

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (ES modules) |
| HTTP | Express — JSON body, routes, CORS |
| Config | dotenv (`MONGODB_URI`, `JWT_SECRET`, `PORT`, …) |
| Database | MongoDB via Mongoose (User, Task models, indexes) |
| Auth | bcryptjs (passwords), jsonwebtoken (Bearer JWT), `requireAuth` middleware |
| Validation | express-validator on auth and task routes |

**Main API surface**

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Tasks: `GET /api/tasks` (query: `page`, `limit`, `status`, `priority`, `search`, `sortBy`, `order`), `GET /api/tasks/analytics`, CRUD + `PATCH /api/tasks/:id/complete`

---

## Frontend — core stack

| Technology | Role |
|------------|------|
| **React 18** | Components, local state, composition |
| **Vite 5** | Dev server, HMR, optimized production build |
| **React Router 6** | `/`, `/login`, `/register`; protected home route |
| **Tailwind CSS 3** | Utility-first layout, responsive breakpoints, transitions |
| **PostCSS + Autoprefixer** | Tailwind pipeline |
| **Axios** | HTTP client; `Authorization: Bearer` from `AuthContext` |

**Supporting modules**

| Path | Role |
|------|------|
| `src/context/AuthContext.jsx` | Session, token in `localStorage`, `/api/auth/me` bootstrap |
| `src/services/api.js` | Axios instance and token helpers |
| `src/hooks/useTasks.js` | Fetches task list + analytics; refetch after mutations |
| `src/utils/date.js` | `toDateInputValue()` for `<input type="date" />`, `isTaskOverdue()` for overdue styling |

---

## Dashboard UI — component structure

Reusable components under `frontend/src/components/`:

| Component | Responsibility |
|-----------|----------------|
| **`DashboardStats.jsx`** | Top dashboard header: **Total** / **Completed** / **Pending** as three gradient stat cards; skeleton placeholders while analytics load |
| **`Filters.jsx`** | Primary row: **Search** (title), **Status**, **Priority** — all drive API query params; secondary row: **Sort** + **Order** |
| **`TaskForm.jsx`** | Create task: title, description, **status** dropdown, **priority** dropdown, **due date** (`<input type="date" />`), submit → `POST /api/tasks` |
| **`TaskCard.jsx`** | Card layout: title, description, **status badge**, **priority badge**, due date line, **Overdue** when `dueDate < today` and status ≠ `done` (red border + label), **Edit** / **Mark complete** / **Delete**; hover shadow + smooth transition |
| **`TaskEditModal.jsx`** | Modal edit form with same **status** / **priority** / **`<input type="date" />`** fields; `PATCH /api/tasks/:id` |
| **`EmptyState.jsx`** | Centered “No tasks found”, contextual subtitle, **clipboard icon** (inline SVG), CTA button scrolls to `#create-task-form` |
| **`LoadingSkeleton.jsx`** | **5** (configurable 3–5) placeholder cards mimicking card chrome while the list loads |

**`pages/Tasks.jsx`** composes the dashboard: page header → **DashboardStats** → **TaskForm** (`id="create-task-form"`) → **Filters** (above the list) → error alert → **LoadingSkeleton** | **EmptyState** | responsive **grid** → **Pagination**.

---

## Visual design tokens (Tailwind)

**Status**

- `todo` — gray (`slate` badges)
- `in-progress` — yellow (`amber`)
- `done` — green (`emerald`)

**Priority**

- `low` — green
- `medium` — yellow
- `high` — red

**Due dates**

- Display formatted in the card; **overdue** if calendar day is before today and task is not **done**: red border/ring and **“Overdue”** pill.

**Layout (responsive)**

- **Mobile:** 1 column (`grid-cols-1`)
- **Tablet:** 2 columns (`md:grid-cols-2`)
- **Desktop:** 3 columns (`xl:grid-cols-3`)

**Cards**

- Hover: slight lift (`hover:-translate-y-0.5`), stronger shadow, border emphasis

---

## Data flow and API integration

- **Filters** update React state → debounced **search** (350 ms) → `useTasks` builds query params → `GET /api/tasks`.
- **DashboardStats** reads `GET /api/tasks/analytics` (same hook as tasks) for totals.
- **Empty state** distinguishes “no tasks yet” vs “no matches for filters” via `hasActiveFilters` (any of status, priority, or non-empty search).

---

## Configuration

| File | Purpose |
|------|---------|
| `backend/.env.example` | MongoDB URI, JWT secret, port |
| `frontend/.env.example` | Optional `VITE_API_URL` when API is not proxied |
| `frontend/vite.config.js` | Dev proxy: `/api` → `http://localhost:5000` |

---

## Production readiness (scope of this project)

- JWT + hashed passwords, validated inputs, per-user tasks on the API
- **Dashboard:** loading skeletons, empty state, error alerts, accessible landmarks (`section`, `aria-label`, `role="status"` on skeleton list)
- For live production: HTTPS, rate limiting, security headers, monitoring, and CI/CD as required by your environment

