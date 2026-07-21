import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'prescriptrack-backend',
    mode: 'mock',
    database: 'PostgreSQL integration pending',
    availableRoutes: [
      '/api/admin/doctors',
      '/api/admin/pharmacists',
      '/api/admin/pharmacies',
      '/api/admin/notifications',
      '/api/admin/metrics',
      '/api/auth/login',
      '/api/auth/session',
    ],
  });
}
