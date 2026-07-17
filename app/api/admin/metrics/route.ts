import { NextResponse } from 'next/server';

const metrics = {
  dailyPrescriptions: [
    { date: 'Jan 10', count: 245 }, { date: 'Jan 11', count: 312 }, { date: 'Jan 12', count: 289 }
  ],
  monthlyRevenue: [
    { month: 'Aug', revenue: 1450000 }, { month: 'Sep', revenue: 1620000 }
  ],
};

export async function GET() {
  return NextResponse.json({ data: metrics });
}
