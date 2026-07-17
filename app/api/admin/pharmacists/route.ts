import { NextResponse } from 'next/server';

const pharmacists = [
  { id: 'PH001', name: 'Rahul Mehta', experience: '6 years', status: 'Pending' },
  { id: 'PH002', name: 'Sunita Nair', experience: '9 years', status: 'Under Review' },
  { id: 'PH003', name: 'Ajay Patel', experience: '4 years', status: 'Verified' },
];

export async function GET() {
  return NextResponse.json({ data: pharmacists });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ ok: true, created: body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
