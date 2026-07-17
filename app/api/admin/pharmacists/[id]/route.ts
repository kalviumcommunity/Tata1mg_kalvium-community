import { NextResponse } from 'next/server';
import { pharmacists, findPharmacist } from '@/lib/adminMockData';
import { UpdatePharmacistSchema } from '@/lib/validationSchemas';

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
    const validatedUpdates = UpdatePharmacistSchema.parse(updates);
    Object.assign(pharmacist, validatedUpdates);
    return NextResponse.json({ data: pharmacist });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
