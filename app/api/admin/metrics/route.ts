import { NextResponse } from 'next/server';
import { metrics } from '@/lib/adminMockData';
export async function GET() {
  return NextResponse.json({ data: metrics });
}
