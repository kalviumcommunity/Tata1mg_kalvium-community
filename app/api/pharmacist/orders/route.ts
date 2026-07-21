import { NextRequest } from 'next/server';
import { OrderStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'PHARMACIST');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        prescription: true,
        address: true,
      },
    });

    const formatted = orders.map((ord) => ({
      id: ord.id,
      patient: ord.patient.name,
      rx: ord.prescriptionId,
      date: ord.createdAt.toLocaleDateString(),
      total: `₹${ord.totalCost}`,
      status: ord.status,
      address: ord.address ? `${ord.address.line1}, ${ord.address.city}` : '',
    }));

    return jsonSuccess(formatted);
  } catch (err) {
    console.error('[GET /api/pharmacist/orders]', err);
    return jsonError('Internal server error', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireRole(request, 'PHARMACIST');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const body = await request.json();
    if (!body.orderId || !body.status) {
      return jsonError('orderId and status required', 400);
    }

    const updated = await prisma.order.update({
      where: { id: body.orderId },
      data: { status: body.status as OrderStatus },
    });

    return jsonSuccess(updated);
  } catch (err) {
    console.error('[PATCH /api/pharmacist/orders]', err);
    return jsonError('Internal server error', 500);
  }
}
