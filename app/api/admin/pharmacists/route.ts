import { NextRequest, NextResponse } from 'next/server';
import { pharmacists, Pharmacist } from '@/lib/adminMockData';
import { CreatePharmacistSchema, ListQuerySchema } from '@/lib/validationSchemas';
import { filterAndPaginate } from '@/lib/filterUtils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    };

    const parsedQuery = ListQuerySchema.parse(query);
    const result = filterAndPaginate(pharmacists, parsedQuery);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreatePharmacistSchema.parse(body);

    const newPharmacist: Pharmacist = {
      id: `PH${Date.now()}`,
      name: validatedData.name,
      email: validatedData.email,
      licenseNumber: validatedData.licenseNumber,
      phone: validatedData.phone,
      qualifications: validatedData.qualifications,
      licenseFile: 'license_pending.pdf',
      createdAt: new Date().toISOString(),
      status: 'Pending' as const,
    };

    pharmacists.push(newPharmacist);
    return NextResponse.json({ data: newPharmacist }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
