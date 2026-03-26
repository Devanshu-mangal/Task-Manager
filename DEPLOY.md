# Deploy for free (GitHub + Atlas + Render + Vercel)

This stack uses **no paid services** for a small demo/portfolio app. Limits apply (cold starts, sleep, Atlas storage).

| Piece        | Free option        | Role                          |
|-------------|--------------------|-------------------------------|
| Code        | **GitHub**         | Host the repo                 |
| Database    | **MongoDB Atlas**  | M0 free cluster               |
| Backend API | **Render**         | Web Service (free tier)       |
| Frontend    | **Vercel**         | Static hosting for the Vite SPA |

**Order:** Create Atlas → deploy backend on Render → copy API URL → deploy frontend on Vercel with `VITE_API_URL` → set `CORS_ORIGIN` on Render to your Vercel URL.

---

## 1. Push to GitHub

1. Create a **new empty repository** on GitHub (no README if you will push existing code).
2. In the project root:

```bash
git init
git add .
git commit -m "Initial commit: task manager full stack"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Use SSH if you prefer: `git@github.com:YOUR_USERNAME/YOUR_REPO.git`

**Never commit** `.env` files (they are in `.gitignore`). Secrets only go in the host dashboards (Render, Vercel, Atlas).

---

## 2. MongoDB Atlas (free)

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **free M0** cluster (any region close to your users).
3. **Database Access:** add a database user (username + password). Save the password.
4. **Network Access:** add IP `0.0.0.0/0` (required so **Render** can connect; acceptable for a demo; tighten later if needed).
5. **Connect** → Drivers → copy the **connection string**. Replace `<password>` and set database name, e.g.  
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/task-manager?retryWrites=true&w=majority`

This value is **`MONGODB_URI`** for Render.

---

## 3. Backend on Render (free)

1. Sign up at [render.com](https://render.com).
2. **New** → **Web Service** → connect your **GitHub** repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
4. **Environment variables:**

| Key            | Value |
|----------------|--------|
| `NODE_ENV`     | `production` |
| `MONGODB_URI`  | Your Atlas connection string |
| `JWT_SECRET`   | Long random string (e.g. `openssl rand -base64 48`) |
| `CORS_ORIGIN`  | Your Vercel URL once it exists, e.g. `https://your-app.vercel.app` (no trailing slash). Comma-separated if multiple. |

5. Deploy. When it is live, copy the service URL, e.g. `https://task-manager-api-xxxx.onrender.com`.

**Health check:** open `https://YOUR-RENDER-URL/api/health` — should return `{"status":"ok"}`.

**Note:** Free Render apps **sleep** after inactivity; first request after sleep can take ~30–60s.

Optional: use `backend/render.yaml` as a **Blueprint** if you prefer infrastructure-as-code (set secrets in the dashboard).

---

## 4. Frontend on Vercel (free)

1. Sign up at [vercel.com](https://vercel.com).
2. **Add New** → **Project** → import the same GitHub repo.
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**

| Name            | Value |
|-----------------|--------|
| `VITE_API_URL`  | Your Render API origin **only**, e.g. `https://task-manager-api-xxxx.onrender.com` (no trailing slash). |

`VITE_*` vars are baked in at **build time** — after changing them, **Redeploy**.

5. Deploy. Open your `.vercel.app` URL and test **Register** / **Login**.

6. Go back to **Render** → update **`CORS_ORIGIN`** to exactly your Vercel site origin, e.g. `https://your-project.vercel.app`, then **Manual Deploy** so CORS matches.

---

## 5. Checklist

- [ ] Atlas user + network `0.0.0.0/0` + `MONGODB_URI` works from Render
- [ ] Render shows **Live** and `/api/health` works
- [ ] Vercel build has correct `VITE_API_URL`
- [ ] `CORS_ORIGIN` on Render includes the Vercel URL (scheme + host, no path)
- [ ] Register a new user on production and create a task

---

## Alternatives (also free tiers)

- **Backend:** [Railway](https://railway.app) (limited free credits/month), [Fly.io](https://fly.io) free allowance.
- **Frontend:** [Netlify](https://netlify.com), [Cloudflare Pages](https://pages.cloudflare.com) — same idea: build `frontend`, set `VITE_API_URL`.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| CORS errors in browser | `CORS_ORIGIN` must match the browser origin exactly (`https://...`) |
| API 401 / network | `VITE_API_URL` wrong or missing; rebuild Vercel |
| Mongo timeout | Atlas IP whitelist; URI user/password |
| Blank page on refresh | `vercel.json` rewrites (already in repo for SPA) |
