import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTokenFromRequest, SESSION_COOKIE_NAME } from '@/lib/auth';

/** GET — validate current session and return user info */
export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Validate session in DB
  const session = await prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: {
      user: {
        include: {
          doctorProfile: true,
          pharmacistProfile: true,
          adminProfile: true,
        },
      },
    },
  });

  if (!session || session.user.deletedAt) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { user } = session;
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

  return NextResponse.json({
    authenticated: true,
    user: { id: user.id, name, email: user.email, role: user.role, profileId, approvalStatus },
  });
}

/** DELETE — logout: destroy session in DB and clear cookie */
export async function DELETE(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {});
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}
