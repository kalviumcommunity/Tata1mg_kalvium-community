import { NextRequest } from 'next/server';
import { pharmacists, Pharmacist } from '@/lib/adminMockData';
import { CreatePharmacistSchema, ListQuerySchema } from '@/lib/validationSchemas';
import { filterAndPaginate } from '@/lib/filterUtils';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

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
    return jsonSuccess(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid query parameters');
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
    return jsonSuccess(newPharmacist, 201);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid request body');
  }
}
