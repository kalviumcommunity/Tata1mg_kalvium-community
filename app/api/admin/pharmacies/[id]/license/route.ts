import { NextResponse } from 'next/server';
import { findPharmacy } from '@/lib/adminMockData';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const pharmacy = findPharmacy(params.id);
    if (!pharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
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

    const fileName = `pharmacy_${params.id}_license_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
    const filePath = `/uploads/licenses/pharmacies/${fileName}`;

    // In mock mode, just update the pharmacy record with file path
    pharmacy.licenseFile = filePath;

    return NextResponse.json(
      {
        message: 'License uploaded successfully',
        filePath,
        fileName,
        fileSize: file.size,
        pharmacy: {
          id: pharmacy.id,
          name: pharmacy.name,
          licenseFile: pharmacy.licenseFile,
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
