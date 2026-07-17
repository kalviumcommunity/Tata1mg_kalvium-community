import { NextResponse } from 'next/server';
import { pharmacists } from '@/lib/adminMockData';

export async function GET() {
  return NextResponse.json({ data: pharmacists });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPharmacist = {
      id: `PH${Date.now()}`,
      name: body.name ?? 'Unknown Pharmacist',
      pharmacyLicense: body.pharmacyLicense ?? 'PCI-XXXX-XXXXX',
      regNo: body.regNo ?? 'N/A',
      experience: body.experience ?? '0 years',
      licenseFile: body.licenseFile ?? 'license_new.pdf',
      status: 'Pending' as const,
    };

    pharmacists.push(newPharmacist);
    return NextResponse.json({ data: newPharmacist }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
