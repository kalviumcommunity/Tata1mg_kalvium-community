# Backend stubs (for frontend integration)

This folder contains simple API stubs that return mock data for frontend development.

- These endpoints are intentionally mock-only and DO NOT connect to PostgreSQL or Prisma.
- Database integration is skipped per the team's request; another member will handle Postgres/Prisma.
- This project does not use a separate Express/Node backend server. The backend layer lives inside the same Next.js app under the app/api routes.

Available endpoints (app router):

- `GET /api/health` — service health check for smoke testing
- `GET /api/admin/doctors` — list doctors
- `POST /api/admin/doctors` — create doctor (mock)
- `GET /api/admin/doctors/[id]` — get doctor details
- `PATCH /api/admin/doctors/[id]` — update doctor status/details
- `POST /api/admin/doctors/[id]/license` — upload a doctor license document
- `GET /api/admin/pharmacists` — list pharmacists
- `POST /api/admin/pharmacists` — create pharmacist (mock)
- `GET /api/admin/pharmacists/[id]` — get pharmacist details
- `PATCH /api/admin/pharmacists/[id]` — update pharmacist status/details
- `POST /api/admin/pharmacists/[id]/license` — upload a pharmacist license document
- `GET /api/admin/pharmacies` — list pharmacies
- `POST /api/admin/pharmacies` — create pharmacy (mock)
- `GET /api/admin/pharmacies/[id]` — get pharmacy details
- `PATCH /api/admin/pharmacies/[id]` — update pharmacy status/details
- `POST /api/admin/pharmacies/[id]/license` — upload a pharmacy license document
- `GET /api/admin/notifications` — list notifications
- `POST /api/admin/notifications` — create notification or mark all read
- `GET /api/admin/metrics` — dashboard metrics
- `GET /api/auth/session` — mock current user session
- `POST /api/auth/login` — mock login endpoint

Next steps for backend developer assigned to this branch:

1. Replace mock data with real DB queries (Prisma) when ready.
2. Add authentication/authorization for protected endpoints.
3. Connect file uploads to persistent storage once the storage layer is ready.
