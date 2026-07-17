# Backend stubs (for frontend integration)

This folder contains simple API stubs that return mock data for frontend development.

- These endpoints are intentionally mock-only and DO NOT connect to PostgreSQL or Prisma.
- Database integration is skipped per the team's request; another member will handle Postgres/Prisma.

Available endpoints (app router):

- `GET /api/admin/doctors` — list doctors
- `POST /api/admin/doctors` — create doctor (mock)
- `GET /api/admin/pharmacists` — list pharmacists
- `GET /api/admin/pharmacies` — list pharmacies
- `GET /api/admin/notifications` — list notifications
- `GET /api/admin/metrics` — dashboard metrics

Next steps for backend developer assigned to this branch:

1. Replace mock data with real DB queries (Prisma) when ready.
2. Add authentication/authorization for protected endpoints.
3. Implement file upload endpoints for license documents.
