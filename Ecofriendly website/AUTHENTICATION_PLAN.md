# Authentication & Admin Authorization Plan
## Earthform — Ecofriendly Product Platform

---

## 1. Current Architecture Snapshot

| Layer        | Technology                           | Status       |
|--------------|--------------------------------------|--------------|
| Frontend     | Next.js 16 (App Router, TypeScript)  | Existing     |
| Backend      | Node.js + Express + TypeScript       | Existing     |
| Database     | MongoDB Atlas (Mongoose)             | Existing     |
| Images       | Cloudinary                           | Existing     |
| Auth         | None                                 | To be added  |

---

## 2. Admin User / Data Model

MongoDB collection: `admins`

Fields:
- _id: ObjectId
- name: string — Display name
- email: string — Lowercase, unique, indexed
- passwordHash: string — bcryptjs hash — NEVER returned via API
- role: 'admin' — Enum, extensible later
- isActive: boolean — Allows account disable without deletion
- createdAt: Date — Auto via timestamps
- updatedAt: Date — Auto via timestamps

Security rules:
- Email stored lowercase, trimmed
- passwordHash field uses select: false in Mongoose (never returned by default queries)
- role defaults to 'admin'; enforced via enum
- isActive: false prevents login even with correct credentials

---

## 3. Password Hashing

- Library: bcryptjs (pure JS, no native bindings needed)
- Salt rounds: 12 (strong but performant)
- Hash on create/update only; never stored plaintext
- Comparison via bcryptjs.compare() — constant-time safe

---

## 4. Login Flow

POST /api/auth/login
1. Validate request body (email + password present)
2. Normalize email to lowercase
3. Find admin by email — SELECT passwordHash explicitly (select: false field)
4. If not found OR isActive === false -> return 401 GENERIC error
5. bcryptjs.compare(password, admin.passwordHash)
6. If mismatch -> return 401 GENERIC error
7. Sign JWT
8. Set HTTP-only cookie on response
9. Return sanitized user object (no passwordHash)

Generic error message (both no-user and wrong-password): "Invalid email or password."
This prevents user-enumeration attacks.

---

## 5. Authentication Mechanism

Choice: JWT stored in HTTP-only Cookie

Requirements met:
- Not in localStorage: Cookie-based only
- Not readable by JS: httpOnly: true
- CSRF protection: sameSite: 'strict' (same-origin SPA)
- Secure in production: secure: true when NODE_ENV=production
- Stateless: JWT is self-contained
- Secret management: JWT_SECRET in backend .env

JWT Payload: { sub: admin._id, role: 'admin', iat, exp }
Token expiry: 7d
Cookie name: auth_token

---

## 6. Token / Session Handling

- Cookie is httpOnly, sameSite: 'strict', path: '/'
- In production: secure: true
- Cookie max-age mirrors JWT expiry (7 days)
- No refresh token in Phase 1
- Logout clears cookie server-side (maxAge: 0)

---

## 7. Backend Auth Middleware

requireAuth:
1. Read auth_token cookie from request
2. If missing -> 401 Unauthorized
3. Verify JWT with JWT_SECRET
4. If invalid/expired -> 401 Unauthorized
5. Find admin by sub (id) — exclude passwordHash
6. If not found OR isActive === false -> 401 Unauthorized
7. Attach sanitized admin to req.admin
8. Call next()

requireAdmin:
1. Requires requireAuth already run (chained)
2. Check req.admin.role === 'admin'
3. If not -> 403 Forbidden
4. Call next()

---

## 8. Protected Endpoints

| Method | Endpoint                    | Auth Required | Note                         |
|--------|-----------------------------|---------------|------------------------------|
| GET    | /api/products               | Public*       | *includeInactive needs auth  |
| GET    | /api/products/:id           | Public        | Returns any product by ID    |
| POST   | /api/products               | requireAdmin  | Create product               |
| PUT    | /api/products/:id           | requireAdmin  | Update product               |
| DELETE | /api/products/:id           | requireAdmin  | Soft-delete product          |
| POST   | /api/products/:id/image     | requireAdmin  | Upload image                 |
| DELETE | /api/products/:id/image     | requireAdmin  | Delete image                 |
| POST   | /api/auth/login             | None          | Auth endpoint                |
| POST   | /api/auth/logout            | requireAuth   | Clear auth cookie            |
| GET    | /api/auth/me                | requireAuth   | Return current admin         |

includeInactive guard: The GET /api/products route uses optional auth middleware.
If includeInactive=true is requested, the controller checks req.admin is present;
if not, it rejects with 401. This protects admin-only visibility without breaking public access.

---

## 9. Frontend Login Flow

- New page: src/app/admin/login/page.tsx
- Form: email + password + submit button
- On submit: POST to backend /api/auth/login with credentials: 'include'
- Success: redirect to /admin
- Error: display generic error message from backend
- Prevent duplicate submissions (loading state, button disabled)
- Accessible: aria-* labels, error role

---

## 10. Logout Flow

- Backend: POST /api/auth/logout clears auth_token cookie (maxAge: 0)
- Frontend: authApi.logout() calls backend, then router.push('/admin/login')
- Logout button added to admin sidebar

---

## 11. Admin Routing (Frontend)

- src/app/admin/page.tsx checks auth status on mount via GET /api/auth/me
  - If 401 -> router.replace('/admin/login')
  - If 200 -> render existing product management UI
- src/app/admin/login/page.tsx: if already authenticated -> redirect to /admin
- All authenticated fetch calls use credentials: 'include'

No Next.js middleware for redirect (cookie is HTTP-only, not readable client-side).
Auth check is done client-side via GET /api/auth/me on page mount.

---

## 12. API Client Updates

src/lib/productsApi.ts — add credentials: 'include' to all mutating fetch calls.

Create src/lib/authApi.ts:
- login(email, password) — POST /api/auth/login
- logout() — POST /api/auth/logout
- getMe() — GET /api/auth/me

---

## 13. Environment Variables

Backend (backend/.env / backend/.env.example):
- JWT_SECRET=<strong-random-secret-min-32-chars>
- JWT_EXPIRES_IN=7d
- ADMIN_SEED_NAME=<initial-admin-name>
- ADMIN_SEED_EMAIL=<initial-admin-email>
- ADMIN_SEED_PASSWORD=<initial-admin-password>

Frontend (.env):
- No auth secrets in NEXT_PUBLIC_* variables
- Backend URL stays as NEXT_PUBLIC_API_URL (non-secret, just a URL)

---

## 14. Admin Account Creation

Script: backend/src/scripts/seedAdmin.ts
NPM command: npm run seed:admin (in backend directory)

Behavior:
1. Connect to MongoDB
2. Read ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD from env
3. Check if admin with that email already exists
4. If exists -> log "Admin already exists" and exit
5. If not -> hash password (bcrypt, 12 rounds), create admin document
6. Log "Admin created successfully" (no password printed)
7. Disconnect

---

## 15. CORS Configuration

- credentials: true already set
- Origin must be specific (not *) when credentials: true
- Update to allow only FRONTEND_URL and localhost variants explicitly
- allowedHeaders includes Content-Type

---

## 16. Security Considerations

| Risk                              | Mitigation                                        |
|-----------------------------------|---------------------------------------------------|
| Password in plaintext             | bcryptjs hash, select: false on field             |
| passwordHash exposed via API      | select: false + explicit omission in responses    |
| Token in localStorage             | HTTP-only cookie                                  |
| XSS reading token                 | httpOnly: true on cookie                          |
| CSRF attacks                      | sameSite: 'strict'                                |
| User enumeration on login         | Generic "Invalid email or password" error         |
| JWT secret in code                | .env only, .gitignore confirmed                   |
| includeInactive public access     | Auth check before query flag is honored           |
| Disabled admin login              | isActive check after password verification        |
| Auth secrets in NEXT_PUBLIC_*     | None — backend URL only                           |
| Token leakage in error messages   | Generic errors, no stack traces in production     |

---

## 17. Implementation Order

1. Install backend dependencies (bcryptjs, jsonwebtoken, cookie-parser)
2. Create Admin model
3. Create auth controller (login, logout, me)
4. Create auth routes
5. Create requireAuth and requireAdmin middleware
6. Update app.ts (cookie-parser, CORS tightening)
7. Protect product routes
8. Update routes index
9. Update backend/.env.example
10. Create seed script
11. Add seed:admin to package.json scripts
12. Create src/lib/authApi.ts
13. Update src/lib/productsApi.ts (add credentials)
14. Create src/app/admin/login/page.tsx
15. Update src/app/admin/page.tsx (auth guard + logout)
16. Regression test
