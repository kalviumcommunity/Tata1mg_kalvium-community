import { findDoctor } from '@/lib/adminMockData';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = findDoctor(params.id);
    if (!doctor) {
      return jsonError('Doctor not found', 404);
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

    const fileName = `doctor_${params.id}_license_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
    const filePath = `/uploads/licenses/doctors/${fileName}`;

    // In mock mode, just update the doctor record with file path
    doctor.licenseFile = filePath;

    return jsonSuccess(
      {
        message: 'License uploaded successfully',
        filePath,
        fileName,
        fileSize: file.size,
        doctor: {
          id: doctor.id,
          name: doctor.name,
          licenseFile: doctor.licenseFile,
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
