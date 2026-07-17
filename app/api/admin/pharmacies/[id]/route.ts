import { NextResponse } from 'next/server';
import { findPharmacy } from '@/lib/adminMockData';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const pharmacy = findPharmacy(params.id);

  if (!pharmacy) {
    return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  return NextResponse.json({ data: pharmacy });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const pharmacy = findPharmacy(params.id);
    if (!pharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    const updates = await request.json();
    Object.assign(pharmacy, updates);
    return NextResponse.json({ data: pharmacy });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
