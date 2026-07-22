import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'DOCTOR');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  const notifications = await prisma.notification.findMany({
    where: { userId: auth.user.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const formatted = notifications.map((n) => ({
    id: n.id,
    type: 'prescription',
    title: n.title || 'Notification',
    body: n.body || n.message,
    time: n.createdAt.toISOString(),
    read: n.read,
    color: '#FF6B6B',
  }));

  return jsonSuccess(formatted);
}
