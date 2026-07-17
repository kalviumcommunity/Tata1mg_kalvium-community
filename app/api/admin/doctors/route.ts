import { NextResponse } from 'next/server';

const doctors = [
  { id: 'D001', name: 'Dr. Prateek Sharma', specialization: 'Neurology', hospital: 'AIIMS Delhi', status: 'Pending' },
  { id: 'D002', name: 'Dr. Kavita Menon', specialization: 'Dermatology', hospital: 'Amrita Hospital', status: 'Under Review' },
  { id: 'D003', name: 'Dr. Sunil Verma', specialization: 'Orthopedics', hospital: 'Nanavati Hospital', status: 'Verified' },
];

export async function GET() {
  return NextResponse.json({ data: doctors });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In future: validate and persist using Prisma / Postgres
    return NextResponse.json({ ok: true, created: body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
