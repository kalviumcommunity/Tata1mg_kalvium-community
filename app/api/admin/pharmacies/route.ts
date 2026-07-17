import { NextResponse } from 'next/server';

const pharmacies = [
  { id: 'PH001', name: 'Apollo Pharmacy', address: 'MG Road, Bangalore', owner: 'Suresh Reddy', status: 'Pending' },
  { id: 'PH002', name: 'MedPlus Stores', address: 'Koramangala, Bangalore', owner: 'Venkat Rao', status: 'Verified' },
];

export async function GET() {
  return NextResponse.json({ data: pharmacies });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ ok: true, created: body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
