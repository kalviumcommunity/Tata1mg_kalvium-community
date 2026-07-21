import { NextRequest } from 'next/server';
import { ApprovalStatus, NotificationType, VerificationEntityType } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UpdateDoctorSchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { email: true, createdAt: true } },
      prescriptions: { select: { id: true }, take: 1 },
    },
  });

  if (!doctor) return jsonError('Doctor not found', 404);
  return jsonSuccess(doctor);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const body = await request.json();
    const parsed = UpdateDoctorSchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.errors[0].message);

    const doctor = await prisma.doctorProfile.findUnique({ where: { id: params.id } });
    if (!doctor) return jsonError('Doctor not found', 404);

    const { status, ...rest } = parsed.data;

    const updated = await prisma.doctorProfile.update({
      where: { id: params.id },
      data: { ...rest, ...(status ? { status: status as ApprovalStatus } : {}) },
    });

    // If status changed, create a VerificationRequest record + Notification
    if (status && status !== doctor.status) {
      const adminProfile = await prisma.adminProfile.findUnique({
        where: { userId: auth.user.userId },
      });

      await prisma.verificationRequest.create({
        data: {
          entityType: VerificationEntityType.DOCTOR,
          entityId: params.id,
          status: status as ApprovalStatus,
          reviewedBy: adminProfile?.id,
          reviewedAt: new Date(),
          remarks: body.remarks || null,
        },
      });

      await prisma.notification.create({
        data: {
          userId: doctor.userId,
          type: status === 'VERIFIED' ? NotificationType.SUCCESS : NotificationType.WARNING,
          title: `Account ${status === 'VERIFIED' ? 'Verified' : status === 'REJECTED' ? 'Rejected' : 'Updated'}`,
          message: `Your doctor profile status has been updated to ${status}.`,
          body: body.remarks || null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.userId,
          action: `UPDATE_DOCTOR_STATUS`,
          details: `Doctor ${params.id} status changed from ${doctor.status} to ${status}`,
        },
      });
    }

    return jsonSuccess(updated);
  } catch (err) {
    console.error('[PATCH /api/admin/doctors/[id]]', err);
    return jsonError('Internal server error', 500);
  }
}
