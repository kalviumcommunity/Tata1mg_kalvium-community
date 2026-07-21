import { findDoctor } from '@/lib/adminMockData';
import { UpdateDoctorSchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const doctor = findDoctor(params.id);

  if (!doctor) {
    return jsonError('Doctor not found', 404);
  }

  return jsonSuccess(doctor);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = findDoctor(params.id);
    if (!doctor) {
      return jsonError('Doctor not found', 404);
    }

    const updates = await request.json();
    const validatedUpdates = UpdateDoctorSchema.parse(updates);
    Object.assign(doctor, validatedUpdates);
    return jsonSuccess(doctor);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid request body');
  }
}
