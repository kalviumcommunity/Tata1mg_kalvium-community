import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'PHARMACIST');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  const profile = await prisma.pharmacistProfile.findUnique({
    where: { id: auth.user.profileId },
    include: {
      user: { select: { email: true, createdAt: true } },
      pharmacies: { include: { address: true } },
    },
  });

  if (!profile) return jsonError('Pharmacist profile not found', 404);
  return jsonSuccess(profile);
}
