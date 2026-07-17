import { NextResponse } from 'next/server';
import { doctors, findDoctor } from '@/lib/adminMockData';
import { UpdateDoctorSchema } from '@/lib/validationSchemas';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const doctor = findDoctor(params.id);

  if (!doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  }

  return NextResponse.json({ data: doctor });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = findDoctor(params.id);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const updates = await request.json();
    const validatedUpdates = UpdateDoctorSchema.parse(updates);
    Object.assign(doctor, validatedUpdates);
    return NextResponse.json({ data: doctor });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
