import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'admin-001',
      name: 'Super Admin',
      email: 'admin@meditrack.in',
      role: 'admin',
    },
  });
}
