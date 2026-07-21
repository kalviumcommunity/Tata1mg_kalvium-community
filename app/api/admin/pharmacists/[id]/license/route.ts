import { findPharmacist } from '@/lib/adminMockData';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const pharmacist = findPharmacist(params.id);
    if (!pharmacist) {
      return jsonError('Pharmacist not found', 404);
    }

    const formData = await request.formData();
    const file = formData.get('license') as File;

    if (!file) {
      return jsonError('No file provided');
    }

    const validMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validMimeTypes.includes(file.type)) {
      return jsonError('Invalid file type. Accepted: PDF, JPG, PNG');
    }

    if (file.size > 5 * 1024 * 1024) {
      return jsonError('File size must be less than 5MB');
    }

    const fileName = `pharmacist_${params.id}_license_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
    const filePath = `/uploads/licenses/pharmacists/${fileName}`;

    // In mock mode, just update the pharmacist record with file path
    pharmacist.licenseFile = filePath;

    return jsonSuccess(
      {
        message: 'License uploaded successfully',
        filePath,
        fileName,
        fileSize: file.size,
        pharmacist: {
          id: pharmacist.id,
          name: pharmacist.name,
          licenseFile: pharmacist.licenseFile,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Failed to upload file');
  }
}
