import { NextRequest } from 'next/server';
import { ApprovalStatus, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { CreatePharmacySchema, ListQuerySchema } from '@/lib/validationSchemas';
import { jsonError, jsonSuccess } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = ListQuerySchema.safeParse({
      page: sp.get('page') || undefined,
      limit: sp.get('limit') || undefined,
      search: sp.get('search') || undefined,
      status: sp.get('status') || undefined,
      sortBy: sp.get('sortBy') || undefined,
      sortOrder: sp.get('sortOrder') || undefined,
    });
    if (!parsed.success) return jsonError(parsed.error.errors[0].message);

    const { page = 1, limit = 10, search, status, sortBy = 'date', sortOrder = 'desc' } = parsed.data;

    const where: Prisma.PharmacyWhereInput = {};
    if (status) where.status = status as ApprovalStatus;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.PharmacyOrderByWithRelationInput =
      sortBy === 'name' ? { name: sortOrder } :
      sortBy === 'status' ? { status: sortOrder } :
      { createdAt: sortOrder };

    const [data, total] = await Promise.all([
      prisma.pharmacy.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { address: true, manager: true },
      }),
      prisma.pharmacy.count({ where }),
    ]);

    // Format output to match frontend contract expectations
    const formattedData = data.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      address: p.address ? `${p.address.line1}, ${p.address.city}` : '',
      city: p.address?.city || '',
      licenseNumber: p.licenseNumber,
      status: p.status,
      drugLicense: p.drugLicense,
      gst: p.gst,
      owner: p.ownerName,
      createdAt: p.createdAt.toISOString(),
    }));

    return jsonSuccess({
      data: formattedData,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[GET /api/admin/pharmacies]', err);
    return jsonError('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireRole(request, 'ADMIN');
  if (auth.error) return jsonError(auth.error, auth.error === 'Unauthorized' ? 401 : 403);

  try {
    const body = await request.json();
    const parsed = CreatePharmacySchema.safeParse(body);
    if (!parsed.success) return jsonError(parsed.error.errors[0].message);

    const { name, email, phone, address, city, licenseNumber } = parsed.data;

    const existing = await prisma.pharmacy.findUnique({ where: { email } });
    if (existing) return jsonError('A pharmacy with this email already exists', 409);

    // Find first verified pharmacist or default manager
    let manager = await prisma.pharmacistProfile.findFirst({ where: { status: 'VERIFIED' } });
    if (!manager) {
      manager = await prisma.pharmacistProfile.findFirst();
    }
    if (!manager) {
      return jsonError('Cannot create pharmacy: No pharmacist profile exists to assign as manager.', 400);
    }

    const pharmacy = await prisma.pharmacy.create({
      data: {
        name,
        email,
        phone,
        licenseNumber,
        status: 'PENDING',
        manager: { connect: { id: manager.id } },
        address: {
          create: {
            line1: address,
            city: city,
            state: 'Default',
            country: 'India',
            postalCode: '000000',
          },
        },
      },
      include: { address: true },
    });

    await prisma.auditLog.create({
      data: { userId: auth.user.userId, action: 'CREATE_PHARMACY', details: `Created pharmacy ${name} (${email})` },
    });

    return jsonSuccess(
      {
        id: pharmacy.id,
        name: pharmacy.name,
        email: pharmacy.email,
        phone: pharmacy.phone,
        address: `${pharmacy.address.line1}, ${pharmacy.address.city}`,
        city: pharmacy.address.city,
        licenseNumber: pharmacy.licenseNumber,
        status: pharmacy.status,
        createdAt: pharmacy.createdAt.toISOString(),
      },
      201,
    );
  } catch (err) {
    console.error('[POST /api/admin/pharmacies]', err);
    return jsonError('Internal server error', 500);
  }
}
