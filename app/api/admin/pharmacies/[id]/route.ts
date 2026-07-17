import { NextResponse } from 'next/server';
import { findPharmacy } from '@/lib/adminMockData';
import { UpdatePharmacySchema } from '@/lib/validationSchemas';

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
    const validatedUpdates = UpdatePharmacySchema.parse(updates);
    Object.assign(pharmacy, validatedUpdates);
    return NextResponse.json({ data: pharmacy });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
