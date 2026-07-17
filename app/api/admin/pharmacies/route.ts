import { NextResponse } from 'next/server';
import { pharmacies } from '@/lib/adminMockData';

export async function GET() {
  return NextResponse.json({ data: pharmacies });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPharmacy = {
      id: `PH${Date.now()}`,
      name: body.name ?? 'Unknown Pharmacy',
      drugLicense: body.drugLicense ?? 'DL-XXXX-XXXXX',
      gst: body.gst ?? 'GSTXXXXX',
      address: body.address ?? 'Unknown Address',
      owner: body.owner ?? 'Unknown Owner',
      status: 'Pending' as const,
    };

    pharmacies.push(newPharmacy);
    return NextResponse.json({ data: newPharmacy }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
