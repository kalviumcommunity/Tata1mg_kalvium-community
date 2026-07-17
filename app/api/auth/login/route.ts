import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: 'admin-001',
        name: 'Super Admin',
        email: body.email,
        role: body.email.includes('admin') ? 'admin' : 'doctor',
      },
      token: 'mock-session-token',
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
