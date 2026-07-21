import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';
import { LoginSchema } from '@/lib/validationSchemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Fetch user with all profiles
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        pharmacistProfile: true,
        adminProfile: true,
      },
    });

    if (!user || user.deletedAt) {
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Resolve profile info
    let name = '';
    let profileId = '';
    let approvalStatus: string | null = null;

    if (user.role === 'DOCTOR' && user.doctorProfile) {
      name = user.doctorProfile.name;
      profileId = user.doctorProfile.id;
      approvalStatus = user.doctorProfile.status;
    } else if (user.role === 'PHARMACIST' && user.pharmacistProfile) {
      name = user.pharmacistProfile.name;
      profileId = user.pharmacistProfile.id;
      approvalStatus = user.pharmacistProfile.status;
    } else if (user.role === 'ADMIN' && user.adminProfile) {
      name = user.adminProfile.name;
      profileId = user.adminProfile.id;
    }

    // Sign JWT
    const token = signToken({ userId: user.id, role: user.role, profileId });

    // Persist session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: { userId: user.id, action: 'LOGIN', details: `Login from ${email}` },
    });

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, name, email: user.email, role: user.role, profileId, approvalStatus },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
