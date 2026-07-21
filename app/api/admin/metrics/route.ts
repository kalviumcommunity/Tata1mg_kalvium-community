import { metrics } from '@/lib/adminMockData';
import { jsonSuccess } from '@/lib/apiResponse';

export async function GET() {
  return jsonSuccess(metrics);
}
