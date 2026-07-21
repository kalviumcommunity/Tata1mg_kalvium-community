# PrescripTrack

Prescription-to-Order Tracking & Fulfillment Platform — Kalvium SPE Squad-134.

This is **Phase 1: UX/UI**, ported pixel-for-pixel from the Figma
(`Healthcare_Management_System`) export into the PRD's required stack:

- **Next.js 14 (App Router)** + React 18 + TypeScript
- **Tailwind CSS v4**
- shadcn/ui component set (Radix primitives)
- **Recharts** for the analytics dashboards
- Deployment target: **Vercel**


> Auth (Auth.js/JWT), Prisma + Neon PostgreSQL, and Zod validation are
> scaffolded (see `.env.example`, `package.json`) but not yet wired up —
> that's  Phase 2.


## Routes

| Route          | Screen                          |
| -------------- | -------------------------------- |
| `/`            | Landing page                     |
| `/auth`        | Login / Signup (role-aware)      |
| `/doctor`      | Doctor portal                    |
| `/pharmacist`  | Pharmacist portal                |
| `/admin`       | Admin portal                     |

Navigation between these mirrors the original single-page prototype's
view-state logic, translated into real Next.js routes with `next/navigation`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx          # root layout, fonts, globals.css, Toaster
  globals.css          # Tailwind v4 + design tokens (from Figma theme.css)
  page.tsx              # Landing
  auth/page.tsx          # Auth
  doctor/page.tsx        # Doctor portal
  pharmacist/page.tsx    # Pharmacist portal
  admin/page.tsx         # Admin portal
components/
  LandingPage.tsx
  AuthPage.tsx
  DoctorPortal.tsx
  PharmacistPortal.tsx
  AdminPortal.tsx
  ui/                    # shadcn/ui primitives (button, card, table, chart, sidebar, etc.)
  figma/ImageWithFallback.tsx
prisma/                  # schema goes here in Phase 2
```

## Build

```bash
npm run build
```

Verified: builds cleanly, all 5 routes prerender as static content.
