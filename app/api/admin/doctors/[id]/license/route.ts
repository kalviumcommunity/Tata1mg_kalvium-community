import { NextResponse } from 'next/server';
import { findDoctor } from '@/lib/adminMockData';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = findDoctor(params.id);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('license') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Accepted: PDF, JPG, PNG' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const fileName = `doctor_${params.id}_license_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
    const filePath = `/uploads/licenses/doctors/${fileName}`;

    // In mock mode, just update the doctor record with file path
    doctor.licenseFile = filePath;

    return NextResponse.json(
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
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 400 });
  }
}
