import { NextResponse } from 'next/server';
import { doctors } from '@/lib/adminMockData';

export async function GET() {
  return NextResponse.json({ data: doctors });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDoctor = {
      id: `D${Date.now()}`,
      name: body.name ?? 'Unknown Doctor',
      regNo: body.regNo ?? 'N/A',
      hospital: body.hospital ?? 'Unknown Hospital',
      specialization: body.specialization ?? 'General',
      licenseFile: body.licenseFile ?? 'license_new.pdf',
      status: 'Pending' as const,
    };

    doctors.push(newDoctor);
    return NextResponse.json({ data: newDoctor }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
