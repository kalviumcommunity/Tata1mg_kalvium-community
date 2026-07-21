import { NextRequest } from 'next/server';
import { ApprovalStatus, NotificationType, VerificationEntityType } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UpdatePharmacistSchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  const pharmacist = await prisma.pharmacistProfile.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true, createdAt: true } }, pharmacies: { select: { id: true, name: true } } },
  });
  if (!pharmacist) return jsonError('Pharmacist not found', 404);
  return jsonSuccess(pharmacist);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const body = await request.json();
    const parsed = UpdatePharmacistSchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.errors[0].message);

    const pharmacist = await prisma.pharmacistProfile.findUnique({ where: { id: params.id } });
    if (!pharmacist) return jsonError('Pharmacist not found', 404);

    const { status, ...rest } = parsed.data;
    const updated = await prisma.pharmacistProfile.update({
      where: { id: params.id },
      data: { ...rest, ...(status ? { status: status as ApprovalStatus } : {}) },
    });

    if (status && status !== pharmacist.status) {
      const adminProfile = await prisma.adminProfile.findUnique({ where: { userId: auth.user.userId } });
      await prisma.verificationRequest.create({
        data: {
          entityType: VerificationEntityType.PHARMACIST,
          entityId: params.id,
          status: status as ApprovalStatus,
          reviewedBy: adminProfile?.id,
          reviewedAt: new Date(),
          remarks: body.remarks || null,
        },
      });
      await prisma.notification.create({
        data: {
          userId: pharmacist.userId,
          type: status === 'VERIFIED' ? NotificationType.SUCCESS : NotificationType.WARNING,
          title: `Account ${status === 'VERIFIED' ? 'Verified' : 'Updated'}`,
          message: `Your pharmacist profile status has been updated to ${status}.`,
        },
      });
      await prisma.auditLog.create({
        data: { userId: auth.user.userId, action: 'UPDATE_PHARMACIST_STATUS', details: `Pharmacist ${params.id}: ${pharmacist.status} → ${status}` },
      });
    }

    return jsonSuccess(updated);
  } catch (err) {
    console.error('[PATCH /api/admin/pharmacists/[id]]', err);
    return jsonError('Internal server error', 500);
  }
}
