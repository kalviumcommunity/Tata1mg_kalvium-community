import { findPharmacist } from '@/lib/adminMockData';
import { UpdatePharmacistSchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const pharmacist = findPharmacist(params.id);

  if (!pharmacist) {
    return jsonError('Pharmacist not found', 404);
  }

  return jsonSuccess(pharmacist);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const pharmacist = findPharmacist(params.id);
    if (!pharmacist) {
      return jsonError('Pharmacist not found', 404);
    }

    const updates = await request.json();
    const validatedUpdates = UpdatePharmacistSchema.parse(updates);
    Object.assign(pharmacist, validatedUpdates);
    return jsonSuccess(pharmacist);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid request body');
  }
}
