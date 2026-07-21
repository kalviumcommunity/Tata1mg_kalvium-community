import { NextRequest } from 'next/server';
import { ApprovalStatus, NotificationType, VerificationEntityType } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UpdatePharmacySchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id: params.id },
    include: { address: true, manager: true },
  });
  if (!pharmacy) return jsonError('Pharmacy not found', 404);

  return jsonSuccess({
    id: pharmacy.id,
    name: pharmacy.name,
    email: pharmacy.email,
    phone: pharmacy.phone,
    address: pharmacy.address ? `${pharmacy.address.line1}, ${pharmacy.address.city}` : '',
    city: pharmacy.address?.city || '',
    licenseNumber: pharmacy.licenseNumber,
    status: pharmacy.status,
    drugLicense: pharmacy.drugLicense,
    gst: pharmacy.gst,
    owner: pharmacy.ownerName,
    createdAt: pharmacy.createdAt.toISOString(),
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const body = await request.json();
    const parsed = UpdatePharmacySchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.errors[0].message);

    const pharmacy = await prisma.pharmacy.findUnique({ where: { id: params.id }, include: { manager: true } });
    if (!pharmacy) return jsonError('Pharmacy not found', 404);

    const { status, address, city, ...rest } = parsed.data;

    const updated = await prisma.pharmacy.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(status ? { status: status as ApprovalStatus } : {}),
        ...(address || city
          ? {
              address: {
                update: {
                  ...(address ? { line1: address } : {}),
                  ...(city ? { city } : {}),
                },
              },
            }
          : {}),
      },
      include: { address: true },
    });

    if (status && status !== pharmacy.status) {
      const adminProfile = await prisma.adminProfile.findUnique({ where: { userId: auth.user.userId } });

      await prisma.verificationRequest.create({
        data: {
          entityType: VerificationEntityType.PHARMACY,
          entityId: params.id,
          status: status as ApprovalStatus,
          reviewedBy: adminProfile?.id,
          reviewedAt: new Date(),
          remarks: body.remarks || null,
        },
      });

      if (pharmacy.manager?.userId) {
        await prisma.notification.create({
          data: {
            userId: pharmacy.manager.userId,
            type: status === 'VERIFIED' ? NotificationType.SUCCESS : NotificationType.WARNING,
            title: `Pharmacy ${status === 'VERIFIED' ? 'Verified' : 'Updated'}`,
            message: `Pharmacy '${pharmacy.name}' status updated to ${status}.`,
          },
        });
      }

      await prisma.auditLog.create({
        data: { userId: auth.user.userId, action: 'UPDATE_PHARMACY_STATUS', details: `Pharmacy ${params.id}: ${pharmacy.status} → ${status}` },
      });
    }

    return jsonSuccess({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address ? `${updated.address.line1}, ${updated.address.city}` : '',
      city: updated.address?.city || '',
      licenseNumber: updated.licenseNumber,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (err) {
    console.error('[PATCH /api/admin/pharmacies/[id]]', err);
    return jsonError('Internal server error', 500);
  }
}
