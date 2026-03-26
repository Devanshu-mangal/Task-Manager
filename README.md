# Task Manager

Full-stack task management with a React dashboard, Express REST API, MongoDB persistence, and JWT authentication. Suitable for production-style demos and portfolio submissions.

## Description

The app lets users register and sign in, then manage tasks with status, priority, due dates, and rich filtering. The UI includes list and Kanban views, analytics charts, CSV export, dark mode, and optimistic updates. The API is stateless and secured with bearer tokens.

## Features

- **Authentication:** Register, login, JWT sessions, protected routes
- **Tasks:** CRUD, mark complete, pagination, sorting, debounced search
- **Fields:** Title, description, status (`todo` | `in-progress` | `done`), priority (`low` | `medium` | `high`), due date
- **Views:** Task list, Kanban board (lazy-loaded), analytics charts (lazy-loaded)
- **Analytics:** Totals, completion rate, breakdowns by status and priority
- **UX:** Responsive layout, loading and empty states, toast notifications, 404 and 500 pages
- **Ops:** Health check endpoint, seed script for demo data, deployment configs for Vercel (frontend) and Render / Railway (backend)

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Chart.js, `@hello-pangea/dnd` |
| Backend  | Node.js, Express, Mongoose, JWT, bcryptjs, express-validator |
| Database | MongoDB |
| Deploy   | Vercel (SPA), Render or Railway (API) |

See [TECH_STACK.md](./TECH_STACK.md) for deeper architecture notes.

## Folder Structure

```
task-manager/
├── backend/
│   ├── scripts/          # seed.js — demo user + tasks
│   └── src/
│       ├── config/       # CORS, etc.
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── server.js
├── frontend/
│   ├── public/           # static assets (favicon, etc.)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── main.jsx
├── docs/
│   └── API.md            # HTTP API reference
├── README.md
├── TECH_STACK.md
└── backend/render.yaml   # Render blueprint (optional)
```

## Installation

**Requirements:** Node.js 18+, MongoDB (local or Atlas).

### Backend

```bash
cd backend
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Optional: set VITE_API_URL if API is not proxied in dev
npm install
```

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description |
|----------------|-------------|
| `MONGODB_URI`  | MongoDB connection string |
| `JWT_SECRET`   | Secret for signing JWTs (use a long random string in production) |
| `PORT`         | Server port (default `5000`) |
| `CORS_ORIGIN`  | Comma-separated allowed origins in production (e.g. your Vercel URL) |
| `JWT_EXPIRES_IN` | Optional token lifetime |

Copy from `backend/.env.example`.

### Frontend (`frontend/.env`)

| Variable        | Description |
|-----------------|-------------|
| `VITE_API_URL`  | Base URL of the API (e.g. `http://localhost:5000` or your deployed API) |

Copy from `frontend/.env.example`.

## Running Locally

1. Start MongoDB and ensure `MONGODB_URI` in `backend/.env` is correct.

2. **Backend** (from `backend/`):

   ```bash
   npm run dev
   ```

   API: `http://localhost:5000` — verify with `GET http://localhost:5000/api/health`.

3. **Frontend** (from `frontend/`):

   ```bash
   npm run dev
   ```

   App: `http://localhost:5173` (Vite proxies `/api` to the backend when configured in `vite.config.js`).

### Seed demo data

From `backend/`:

```bash
npm run seed
```

Creates one demo user and ten sample tasks (see script output for credentials).

## Build Instructions

### Frontend (production bundle)

```bash
cd frontend
npm run build
npm run preview   # optional: test the static build locally
```

Set `VITE_API_URL` to your production API origin before building if the frontend and API are on different hosts.

### Backend

No compile step. Use:

```bash
cd backend
npm start
```

## Deployment

### Frontend (Vercel)

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` includes SPA rewrites so client-side routes work.

Set `VITE_API_URL` in Vercel project environment variables to your deployed API URL, then redeploy.

### Backend (Render)

- Use `backend/render.yaml` as a blueprint or create a Web Service manually.
- Set `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN` (your Vercel site URL, e.g. `https://your-app.vercel.app`).

### Backend (Railway)

- New project → deploy from repo, set root to `backend`.
- Start command: `npm start`. Set the same env vars as on Render.

**CORS:** In production, set `CORS_ORIGIN` to your frontend origin(s). See `backend/src/config/cors.js`.

## Screenshots

_Add screenshots of the dashboard, task list, Kanban, and analytics here for reviewers._

## API Documentation

Full request/response examples: **[docs/API.md](./docs/API.md)**.

Covers:

- Health (`GET /api/health`)
- Auth (register, login, current user)
- Tasks (CRUD, filters)
- Analytics

## Future Improvements

- Refresh tokens and secure httpOnly cookie option
- Team workspaces and shared task lists
- Real-time updates (WebSockets or SSE)
- File attachments and comments
- E2E tests (Playwright) and CI pipeline
- Rate limiting and structured logging in production

## License

MIT (adjust for your organization if needed).
