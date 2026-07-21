import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validationSchemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    const { name, email, password, role, specialization, licenseNumber, phone, qualifications } =
      parsed.data;

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user + profile in one transaction
    let profileId = '';

    if (role === 'DOCTOR') {
      if (!specialization || !licenseNumber || !phone) {
        return NextResponse.json(
          { ok: false, error: 'Doctors require specialization, licenseNumber, and phone' },
          { status: 400 },
        );
      }
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'DOCTOR',
          doctorProfile: {
            create: {
              name,
              email,
              specialization,
              licenseNumber,
              phone,
              status: 'PENDING',
            },
          },
        },
        include: { doctorProfile: true },
      });
      profileId = user.doctorProfile!.id;

      const token = signToken({ userId: user.id, role: user.role, profileId });
      await prisma.session.create({
        data: { userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000) },
      });

      const response = NextResponse.json({
        ok: true,
        user: { id: user.id, name, email, role: user.role, profileId, approvalStatus: 'PENDING' },
      });
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      });
      return response;
    }

    // PHARMACIST
    if (!qualifications || !licenseNumber || !phone) {
      return NextResponse.json(
        { ok: false, error: 'Pharmacists require qualifications, licenseNumber, and phone' },
        { status: 400 },
      );
    }
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'PHARMACIST',
        pharmacistProfile: {
          create: {
            name,
            email,
            licenseNumber,
            phone,
            qualifications,
            status: 'PENDING',
          },
        },
      },
      include: { pharmacistProfile: true },
    });
    profileId = user.pharmacistProfile!.id;

    const token = signToken({ userId: user.id, role: user.role, profileId });
    await prisma.session.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000) },
    });

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, name, email, role: user.role, profileId, approvalStatus: 'PENDING' },
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
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
