import { NextResponse } from 'next/server';
import { notifications } from '@/lib/adminMockData';

export async function GET() {
  return NextResponse.json({ data: notifications });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'markAllRead') {
      notifications.forEach((item) => { item.read = true; });
      return NextResponse.json({ ok: true, data: notifications });
    }

    const newNotification = {
      id: Date.now(),
      title: body.title ?? 'New Notification',
      body: body.body ?? 'No details provided',
      time: body.time ?? 'Just now',
      read: false,
    };

    notifications.unshift(newNotification);
    return NextResponse.json({ data: newNotification }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
