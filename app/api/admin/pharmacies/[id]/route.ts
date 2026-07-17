import { findPharmacy } from '@/lib/adminMockData';
import { UpdatePharmacySchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const pharmacy = findPharmacy(params.id);

  if (!pharmacy) {
    return jsonError('Pharmacy not found', 404);
  }

  return jsonSuccess(pharmacy);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const pharmacy = findPharmacy(params.id);
    if (!pharmacy) {
      return jsonError('Pharmacy not found', 404);
    }

    const updates = await request.json();
    const validatedUpdates = UpdatePharmacySchema.parse(updates);
    Object.assign(pharmacy, validatedUpdates);
    return jsonSuccess(pharmacy);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid request body');
  }
}
