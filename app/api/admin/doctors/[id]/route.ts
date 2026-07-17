import { NextResponse } from 'next/server';
import { doctors, findDoctor } from '@/lib/adminMockData';

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
    Object.assign(doctor, updates);
    return NextResponse.json({ data: doctor });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
