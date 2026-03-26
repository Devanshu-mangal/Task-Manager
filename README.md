# Task Manager

Full-stack task management with a **React (Vite)** dashboard, **Express** REST API, **MongoDB**, and **JWT** authentication. Switch between a responsive **list view** (filters, pagination, exports) and a **Kanban board** with drag-and-drop, plus **analytics charts** and a production-oriented deploy path (GitHub, Atlas, Render, Vercel).

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## Features

| Area | Details |
|------|---------|
| **Auth** | Register, login, JWT bearer tokens, bcrypt password hashing, protected routes |
| **Tasks** | CRUD, mark complete, filters (status, priority, search), sorting, pagination |
| **Views** | **List** grid with cards and **Kanban** board (`@hello-pangea/dnd`) |
| **Analytics** | Dashboard stats and charts (Chart.js / `react-chartjs-2`) |
| **UX** | Loading skeletons, empty states, toasts, dark-friendly UI, optimistic updates where applicable |
| **Export** | CSV and Excel export from the dashboard |

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, Vite 5, React Router 6, Tailwind CSS 3, Axios, react-hot-toast, Chart.js, XLSX |
| **Backend** | Node.js (ES modules), Express 4, Mongoose 8, express-validator, cors, dotenv |
| **Data** | MongoDB (users and tasks, per-user isolation) |
| **Security** | JWT auth middleware, validated inputs on auth and task routes |

More detail: [`TECH_STACK.md`](TECH_STACK.md).

---

## Repository layout

```
task-manager/
├── backend/          # Express API (see backend/package.json)
│   └── src/          # server, routes, controllers, models, middleware
├── frontend/         # React SPA (see frontend/package.json)
│   └── src/          # pages, components, hooks, context, services
├── DEPLOY.md         # Free-tier deploy: GitHub + Atlas + Render + Vercel
└── TECH_STACK.md     # Architecture and UI notes
```

---

## Prerequisites

- **Node.js** ≥ 18  
- **MongoDB** (local URI or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env
# Set MONGODB_URI, JWT_SECRET, and optionally PORT (default 5000)
npm install
npm run dev
```

Health check: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# Optional: VITE_API_URL for explicit API origin; dev often uses Vite proxy
npm install
npm run dev
```

The Vite dev server proxies `/api` to the backend (see `frontend/vite.config.js`). Open the printed local URL (e.g. `http://localhost:5173`), register a user, and use the app.

### Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `backend/` | `npm run dev` | API with `--watch` |
| `backend/` | `npm start` | Production-style start |
| `backend/` | `npm run seed` | Seed script (if configured) |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | Production build → `frontend/dist` |
| `frontend/` | `npm run preview` | Preview production build |

---

## Environment variables

| File | Variables |
|------|-----------|
| `backend/.env` | `MONGODB_URI`, `JWT_SECRET`, `PORT`; production: `CORS_ORIGIN`, `NODE_ENV` |
| `frontend/.env` / `.env.local` | `VITE_API_URL` (full API origin, no trailing slash, for hosted builds) |

Examples: `backend/.env.example`, `frontend/.env.example`.

---

## API overview

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Issue JWT |
| `GET` | `/api/auth/me` | Current user (Bearer token) |
| `GET` | `/api/tasks` | Paginated list (`page`, `limit`, `status`, `priority`, `search`, `sortBy`, `order`) |
| `GET` | `/api/tasks/analytics` | Aggregates for dashboard |
| | | CRUD + complete on `/api/tasks/:id` |

---

## Deployment

Step-by-step **free-tier** deployment (GitHub, MongoDB Atlas, Render, Vercel) is in **[`DEPLOY.md`](DEPLOY.md)**.

---

## GitHub language bar (“JavaScript only”)

GitHub uses [Linguist](https://github.com/github-linguist/linguist): **`.jsx` files are counted as JavaScript**, so the bar will not show a separate “React” slice. That is normal. This repo uses **badges above** and **[`TECH_STACK.md`](TECH_STACK.md)** so the stack (React, Vite, Express, MongoDB, Tailwind) is explicit.

If **`frontend/dist`** was ever committed, it can skew the bar toward huge bundled JS. The repo includes **`.gitattributes`** so generated build output is excluded from language statistics when present. Prefer **not** committing `dist/` (see `.gitignore`); build on the host (e.g. Vercel).

---

## License

Use and modify for learning or portfolio purposes according to your needs; add a `LICENSE` file if you want a standard open-source license.
