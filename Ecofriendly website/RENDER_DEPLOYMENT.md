# Render Deployment Guide — Earthform Web Service

This guide provides step-by-step instructions for deploying the **Earthform** ecommerce platform as a **single, unified Web Service** on Render with **one public URL**.

---

## 1. Target Architecture

```
                  Browser (Single Public URL: https://<your-service>.onrender.com)
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │            ONE Render Web Service            │
                    │       (Node.js + Express + TypeScript)       │
                    └──────┬────────────────────────────────┬──────┘
                           │                                │
                           ▼                                ▼
            ┌────────────────────────────┐    ┌───────────────────────────┐
            │   Express Backend API      │    │  Next.js Production App   │
            │   • /api/health            │    │  • /                      │
            │   • /api/auth/* (JWT)      │    │  • /shop → /collections   │
            │   • /api/products/*        │    │  • /cart                  │
            │   • Image upload via multer│    │  • /checkout              │
            └──────────────┬─────────────┘    │  • /admin                 │
                           │                  │  • /admin/login           │
                           │                  │  • /product/[id]          │
                           │                  └───────────────────────────┘
                           ▼
          ┌──────────────────────────────────┐
          │      External Managed Services   │
          │  • MongoDB Atlas (DB)            │
          │  • Cloudinary (Product Images)   │
          └──────────────────────────────────┘
```

- **Unified Origin:** Next.js pages and Express `/api/*` endpoints are served from the **exact same host and port**.
- **No Cross-Origin Issues:** Auth cookies (`auth_token`) use `SameSite: Strict` and `HttpOnly` securely without third-party cookie restrictions.
- **Dynamic Port:** The Express server automatically binds to Render's dynamically assigned `PORT` environment variable (`process.env.PORT`).

---

## 2. Render Web Service Settings

Configure the service on the [Render Dashboard](https://dashboard.render.com/) with these exact settings:

| Setting | Value | Notes |
|---|---|---|
| **Service Type** | **Web Service** | Standard Node.js environment |
| **Name** | `earthform` (or your choice) | Gives `https://<name>.onrender.com` |
| **Region** | Oregon (US West) or closest to DB | Choose region closest to your MongoDB Atlas cluster |
| **Branch** | `main` | Production branch |
| **Root Directory** | *(leave blank)* | Builds from the repository root |
| **Runtime** | **Node** | Node.js 18+ or 20+ |
| **Build Command** | `npm install && npm --prefix backend install && npm run build` | Installs root & backend dependencies, builds Next.js and backend |
| **Start Command** | `npm start` | Runs compiled `node backend/dist/server.js` |
| **Health Check Path** | `/api/health` | Returns `200 OK` when server & DB are healthy |
| **Auto-Deploy** | Yes | Deploys on git push to `main` |

---

## 3. Environment Variables Configuration

Set these environment variables in the Render Dashboard under **Environment**:

### A. Backend Secrets (Server-Only — NEVER expose to browser)

| Variable | Required | Description / Example Format |
|---|---|---|
| `NODE_ENV` | **Yes** | `production` |
| `MONGODB_URI` | **Yes** | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority` |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud identifier (e.g. `dnqg5lsvo`) |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key (numeric string) |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret (string) |
| `JWT_SECRET` | **Yes** | High-entropy random string (min 32 chars). Generate with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Optional | `7d` (default if omitted) |
| `ADMIN_SEED_NAME` | For Seeding | Display name (e.g. `Earthform Admin`) |
| `ADMIN_SEED_EMAIL` | For Seeding | Production administrator email |
| `ADMIN_SEED_PASSWORD` | For Seeding | Secure password (minimum 8 characters) |
| `FRONTEND_URL` | Optional | `https://<your-service>.onrender.com` (for explicit CORS whitelisting) |

### B. Frontend Public Variables (Safe for Browser)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Optional | **Leave empty or unset.** In production on the single Render service, the frontend automatically defaults to same-origin relative paths (`/api`). |

> [!IMPORTANT]
> **Zero Secrets in Frontend:** Never prefix database connection strings, JWT secrets, or Cloudinary API secrets with `NEXT_PUBLIC_`. Those must only exist as backend secrets.

---

## 4. External Services Setup

### MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Network Access**, ensure Render's outbound IPs are permitted. For standard Render shared plans, add `0.0.0.0/0` (Allow Access from Anywhere) with a strong database user password.
3. Under **Database Access**, create a user with read/write privileges on the `earthform` database.
4. Obtain the SRV connection string: `mongodb+srv://<username>:<password>@cluster0...mongodb.net/earthform?retryWrites=true&w=majority`.

### Cloudinary Setup
1. Log in to [Cloudinary](https://cloudinary.com/).
2. Navigate to Dashboard and copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste these values into Render environment variables.

---

## 5. Production Admin Seeding

After deploying the Web Service on Render, seed the initial administrator account:

### Method: Using Render Web Shell
1. Go to your Render Web Service dashboard.
2. Click **Shell** in the left sidebar to open the web terminal.
3. Verify that `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, and `ADMIN_SEED_PASSWORD` are configured in your Environment tab.
4. Run:
   ```bash
   npm run seed:admin:prod
   ```
5. Expected output:
   ```
   [seed:admin] Connecting to MongoDB Atlas...
   [seed:admin] Connected.
   [seed:admin] Hashing password...
   [seed:admin] Admin created successfully.
     Name:  <Your Admin Name>
     Email: <Your Admin Email>
     Role:  admin
     ID:    ...
   [seed:admin] Done. Database connection closed.
   ```
6. **Security & Idempotency:**
   - The password is hashed using `bcrypt` (12 rounds) and is **never logged or printed**.
   - If executed again with the same email, it detects the existing account and skips creation cleanly without duplicate key errors.
   - You may safely remove `ADMIN_SEED_PASSWORD` from your Render Environment variables after seeding.

---

## 6. Pre-Commit / Pre-Push Verification Checklist

Before pushing to your GitHub repository, ensure:

- [x] `.env` files are NOT committed (verified by `.gitignore` with `.env*` and `!.env.example`).
- [x] Both `.env.example` and `backend/.env.example` contain **placeholders only** (no actual credentials).
- [x] No hardcoded passwords, tokens, or connection strings exist in source code.
- [x] Backend compiled directory `/backend/dist/` is ignored in git.
- [x] Next.js build output `/.next/` is ignored in git.
- [x] Dependencies in `node_modules` are ignored in git.

---

## 7. Post-Deployment Verification Checklist

Once the Render deployment finishes and displays "Live":

1. **Health Check:**
   - Visit: `https://<your-service>.onrender.com/api/health`
   - Expected: `200 OK` JSON with `"database": { "status": "connected", "connected": true }`.
2. **Public Storefront:**
   - Homepage: `https://<your-service>.onrender.com/` (loads styling, assets, hero banner).
   - Shop redirect: `https://<your-service>.onrender.com/shop` (redirects to `/collections`).
   - Collections catalog: `https://<your-service>.onrender.com/collections` (renders product cards).
3. **Admin Authentication & Guard:**
   - Direct access to `/admin`: `https://<your-service>.onrender.com/admin` (redirects unauthenticated users to `/admin/login`).
   - Log in: Enter seeded admin email and password.
   - Dashboard: Verify admin header shows your email badge and product management table loads.
   - Refresh: Press F5 on `/admin` — session must persist cleanly.
   - Product Management: Test adding/editing a product and uploading an image.
   - Sign Out: Click "Sign Out" button; verify session cookie is cleared and redirected back to `/admin/login`.
   - Direct re-access: Navigating back to `/admin` must redirect back to `/admin/login`.

---

## 8. Local Development Commands

To run the application locally:

```bash
# Option A: Unified Production Build Test (Mirrors Render exactly)
npm run build
npm start
# Opens unified server on http://localhost:5000

# Option B: Standard Local Development (Independent processes)
# Terminal 1 — Frontend (port 3000):
npm run dev

# Terminal 2 — Backend API (port 5000):
npm run dev:backend

# Option C: Seed Admin in local development
npm run seed:admin
```
