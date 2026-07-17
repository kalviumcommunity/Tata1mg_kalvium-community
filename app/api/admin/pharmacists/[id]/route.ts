import { NextResponse } from 'next/server';
import { pharmacists, findPharmacist } from '@/lib/adminMockData';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const pharmacist = findPharmacist(params.id);

  if (!pharmacist) {
    return NextResponse.json({ error: 'Pharmacist not found' }, { status: 404 });
  }

  return NextResponse.json({ data: pharmacist });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const pharmacist = findPharmacist(params.id);
    if (!pharmacist) {
      return NextResponse.json({ error: 'Pharmacist not found' }, { status: 404 });
    }

    const updates = await request.json();
    Object.assign(pharmacist, updates);
    return NextResponse.json({ data: pharmacist });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
