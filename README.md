# PrescripTrack

**Prescription-to-order tracking for doctors and pharmacies.**

PrescripTrack connects the two ends of a prescription's life. A doctor's prescription reaches a pharmacy, the pharmacist verifies it, prepares the order and tracks it through to delivery, and every step is recorded. It is a full-stack Next.js application with role-based portals, a PostgreSQL data layer and a JWT-secured API.

Built for **Kalvium SPE Squad-134**.

---

## Features

**Authentication and access control**
- Email and password sign-up and login with bcrypt-hashed passwords
- Google sign-in (OAuth 2.0) with a CSRF `state` cookie, plus a profile-completion step for new Google users
- Password reset endpoint that creates a one-hour, single-use token (email delivery is not connected yet)
- Signed JWT sessions (7-day expiry) stored in cookies
- Edge middleware that protects `/doctor` and `/pharmacist` routes by role, using `jose`
- New doctors and pharmacists register with a `PENDING` approval status (the enum also supports `UNDER_REVIEW`, `VERIFIED` and `REJECTED`); the status is returned on login and session checks
- One-time admin bootstrap endpoint, locked by a secret and disabled automatically once an admin exists

**Doctor portal**
- Profile, patient list, prescription history and notifications
- Medicine catalogue lookup

**Pharmacist portal**
- Prescription status updates (verify, reject, dispense) run inside a database transaction, with rules that block invalid moves such as dispensing an unverified or rejected prescription, or dispensing the same prescription twice
- Order queue with status updates (`PENDING` → `PACKING` → `READY_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`, or `CANCELLED`)
- Pharmacy inventory with stock and price updates
- Weekly orders and revenue report, scoped to the pharmacist's own pharmacy so one pharmacy can never see another's numbers
- Notifications and profile

**Platform**
- `/api/health` endpoint that checks database connectivity
- Security headers on every response (HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`)
- The app refuses to start if `JWT_SECRET` is missing, so there is no insecure fallback

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Route Handlers, Middleware) |
| UI | React 18, TypeScript, Tailwind CSS v4, shadcn/ui (Radix), Recharts |
| Forms and validation | React Hook Form, Zod |
| Database | PostgreSQL with Prisma 5 |
| Auth | `jsonwebtoken`, `jose` (Edge), `bcryptjs`, Google OAuth 2.0 |
| Deployment target | Vercel with Neon PostgreSQL |

---

## Data model

The Prisma schema has **31 models** and **8 enums**, grouped by area:

| Area | Models |
|---|---|
| Identity | `User`, `Patient`, `DoctorProfile`, `PharmacistProfile`, `AdminProfile`, `Address` |
| Auth | `Session`, `RefreshToken`, `OTP`, `PasswordResetToken` |
| Pharmacy | `Pharmacy`, `PharmacyInventory`, `InventoryBatch`, `InventoryTransaction` |
| Catalogue | `Medicine`, `MedicineCategory`, `MedicineManufacturer` |
| Prescriptions | `Prescription`, `PrescriptionItem`, `PrescriptionDocument`, `Allergy`, `MedicalHistory` |
| Orders | `Order`, `OrderItem`, `Payment`, `Invoice` |
| Operations | `Notification`, `VerificationRequest`, `AuditLog`, `ActivityLog`, `FileUpload` |

Two migrations are included: the initial schema and the Google auth additions.

---

## Roles and workflow

| Role | How they get access | What they can do |
|---|---|---|
| **Doctor** | Self-register (starts as `PENDING`) or Google sign-in | View patients, prescriptions and notifications |
| **Pharmacist** | Self-register (starts as `PENDING`) or Google sign-in | Verify prescriptions, manage orders and inventory, view reports |
| **Admin** | Created once through the bootstrap endpoint | Role exists in the schema and auth flow; see limitations |

**Prescription lifecycle:** `PENDING` → `VERIFIED` or `REJECTED` → `DISPENSED`

**Account approval status:** `PENDING` → `UNDER_REVIEW` → `VERIFIED` or `REJECTED`

---

## API reference

All protected routes read the session cookie and enforce the required role.

**Auth** (public)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a doctor or pharmacist |
| `POST` | `/api/auth/login` | Log in with email and password |
| `GET` | `/api/auth/session` | Current session and approval status |
| `POST` | `/api/auth/reset-password` | Request a password reset |
| `GET` | `/api/auth/google` | Start Google sign-in |
| `GET` | `/api/auth/google/callback` | Google OAuth callback |
| `GET` | `/api/auth/google/pending` | Read a pending Google signup |
| `POST` | `/api/auth/google/complete` | Finish Google signup with role details |
| `POST` | `/api/auth/setup-admin` | One-time admin bootstrap (needs secret) |

**Doctor** (role: `DOCTOR`)

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/doctor/profile` | Doctor profile |
| `GET` | `/api/doctor/patients` | Patient list |
| `GET` | `/api/doctor/prescriptions` | Prescription list |
| `GET` | `/api/doctor/prescriptions/[id]` | One prescription |
| `GET` | `/api/doctor/notifications` | Notifications |

**Pharmacist** (role: `PHARMACIST`)

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/pharmacist/profile` | Pharmacist profile |
| `PATCH` | `/api/pharmacist/prescriptions/[id]` | Verify, reject or dispense a prescription (transactional, with state-transition checks) |
| `GET` | `/api/pharmacist/orders` | Order queue |
| `PATCH` | `/api/pharmacist/orders` | Update an order's status (only for orders belonging to the pharmacist's own pharmacy) |
| `GET` | `/api/pharmacist/inventory` | Inventory list |
| `PATCH` | `/api/pharmacist/inventory` | Update stock and price for a medicine |
| `GET` | `/api/pharmacist/reports` | Weekly orders and revenue |
| `GET` | `/api/pharmacist/notifications` | Notifications |

**Shared**

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/medicines` | Medicine catalogue |
| `GET` | `/api/health` | Health and database check |

---

## Getting started

### Prerequisites
- Node.js 18 or newer
- A PostgreSQL database (local, or a free [Neon](https://neon.tech) project)
- Optional: a Google Cloud OAuth client, only if you want Google sign-in

### 1. Install

```bash
git clone https://github.com/singamshettys134-dev/Tata1mg_kalvium-community.git
cd Tata1mg_kalvium-community
npm install
```

`npm install` also runs `prisma generate` automatically.

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Long random string. Generate with `openssl rand -base64 48`. The app will not start without it. |
| `GOOGLE_CLIENT_ID` | For Google sign-in | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | For Google sign-in | From Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | For Google sign-in | Must exactly match the authorized redirect URI, for example `http://localhost:3000/api/auth/google/callback` |
| `SETUP_ADMIN_SECRET` | For admin bootstrap | Any random string. Generate with `openssl rand -base64 24`. |

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed loads medicine categories, manufacturers, medicines, a demo pharmacy and inventory, and three demo accounts.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

### Demo accounts (development only)

All seeded accounts share one password, printed by the seed script.

| Role | Email | Password |
|---|---|---|
| Doctor | `doctor@meditrack.com` | `Demo@12345` |
| Pharmacist | `pharmacist@meditrack.com` | `Demo@12345` |
| Admin | `admin@meditrack.com` | `Demo@12345` |

> The `meditrack.com` addresses are seed data from an earlier working name for the project. Never seed or reuse these credentials in production.

### Creating a real admin

```bash
curl -X POST http://localhost:3000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"secret":"<SETUP_ADMIN_SECRET>","email":"you@example.com","password":"a-strong-password","name":"Your Name"}'
```

This works only while no admin exists. After the first admin is created it does nothing.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the code |
| `npx prisma migrate dev` | Apply migrations in development |
| `npx prisma db seed` | Seed demo data |
| `npm run prisma:studio` | Open Prisma Studio to browse data |

---

## Project structure

```
app/
  page.tsx                     Landing page
  auth/                        Login, sign-up, Google profile completion
  doctor/                      Doctor portal
  pharmacist/                  Pharmacist portal
  api/
    auth/                      Register, login, session, reset, Google OAuth, admin bootstrap
    doctor/                    Profile, patients, prescriptions, notifications
    pharmacist/                Profile, prescriptions, orders, inventory, reports, notifications
    medicines/                 Medicine catalogue
    health/                    Health check
components/
  AuthPage.tsx, DoctorPortal.tsx, PharmacistPortal.tsx, PortalLayout.tsx
  ui/                          shadcn/ui primitives
lib/
  auth.ts                      JWT signing, verification, role guards
  googleAuth.ts                Google OAuth helpers
  validationSchemas.ts         Zod schemas
  prisma.ts                    Prisma client
  apiResponse.ts               Consistent JSON responses
middleware.ts                  Role-based route protection (Edge)
prisma/
  schema.prisma                31 models, 8 enums
  migrations/                  SQL migrations
  seed.ts                      Demo data
```

---

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text.
- The JWT secret has no default. Startup fails without it, so a guessable secret can never forge a session.
- The Google OAuth flow sets a random `state` value in an `httpOnly` cookie to guard against CSRF.
- Pharmacist reports and inventory are filtered to the requesting pharmacist's own pharmacy.
- Request bodies are validated with Zod.
- Every response carries HSTS, clickjacking and content-type protection headers.

---

## Known limitations

This is an actively developing project, and these are the gaps as of now:

- **No admin portal yet.** The `ADMIN` role, its profile model and the bootstrap endpoint exist, but there is no admin dashboard or approval endpoint, so there is no way yet to move an account from `PENDING` to `VERIFIED`.
- **Approval status is recorded but not enforced.** A `PENDING` doctor or pharmacist can currently sign in and use their portal. Restricting access until an admin verifies the account is planned.
- **Doctors cannot create prescriptions through the API yet.** The doctor routes are read-only. Prescription data comes from the seed script until a `POST` route is added.
- **No automated tests yet.**
- **Payments and invoices** are modelled in the schema but not yet exposed through the API.
- **Password reset** creates and stores the token, but no email is sent and there is no endpoint yet to redeem it.

---

## Roadmap

- Admin dashboard with doctor and pharmacist approval, and access gating on `VERIFIED` status
- Prescription creation for doctors
- Payment and invoice endpoints
- Email delivery and a token-redemption endpoint for password reset
- Unit and integration tests
- File upload for prescription documents

---

## Team

Kalvium SPE Squad-134.

The UI was ported from a Figma design (`Healthcare_Management_System`) using shadcn/ui and Tailwind CSS.

## License

Add a `LICENSE` file before publishing if you want this code to be reusable.
