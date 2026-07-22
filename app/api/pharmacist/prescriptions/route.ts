import { NextRequest } from 'next/server';
import { Prisma, PrescriptionStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'PHARMACIST');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const sp = request.nextUrl.searchParams;
    const statusParam = sp.get('status');

    const where: Prisma.PrescriptionWhereInput = {};
    if (statusParam) {
      where.status = statusParam.toUpperCase() as PrescriptionStatus;
    }

    const prescriptions = await prisma.prescription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        doctor: true,
        items: { include: { medicine: true } },
      },
    });

    const formatted = prescriptions.map((rx) => ({
      id: rx.id,
      patient: rx.patient.name,
      doctor: rx.doctor.name,
      receivedAt: rx.createdAt.toLocaleString(),
      medicines: rx.items.map((i) => `${i.medicine.name} (${i.dosage})`),
      total: `₹${rx.items.length * 150}`,
      status: rx.status === 'PENDING' ? 'Pending' : rx.status === 'VERIFIED' ? 'Verified' : rx.status,
    }));

    return jsonSuccess(formatted);
  } catch (err) {
    console.error('[GET /api/pharmacist/prescriptions]', err);
    return jsonError('Internal server error', 500);
  }
}
