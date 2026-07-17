import { NextResponse } from 'next/server';

const notifications = [
  { id: 1, title: 'New Doctor Registration', body: 'Dr. Prateek Sharma submitted documents', time: '10 min ago', read: false },
  { id: 2, title: 'License Expiry', body: 'Apollo Pharmacy license expires in 30 days', time: '1 hour ago', read: false },
];

export async function GET() {
  return NextResponse.json({ data: notifications });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ ok: true, created: body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
