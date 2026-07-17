import { NextRequest } from 'next/server';
import { notifications, Notification } from '@/lib/adminMockData';
import { CreateNotificationSchema, ListQuerySchema } from '@/lib/validationSchemas';
import { filterAndPaginate } from '@/lib/filterUtils';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    };

    const parsedQuery = ListQuerySchema.parse(query);
    const result = filterAndPaginate(notifications as any[], parsedQuery);
    return jsonSuccess(result);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid query parameters');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'markAllRead') {
      notifications.forEach((item) => { item.read = true; });
      return jsonSuccess(notifications);
    }

    const validatedData = CreateNotificationSchema.parse(body);
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      userId: validatedData.userId,
      message: validatedData.message,
      type: validatedData.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.unshift(newNotification);
    return jsonSuccess(newNotification, 201);
  } catch (error) {
    if (error instanceof Error) {
      return jsonError(error.message);
    }
    return jsonError('Invalid request body');
  }
}
