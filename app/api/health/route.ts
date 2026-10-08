import { publicDb } from '@/lib/workspace-db';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET() {
  try {
    const { error } = await publicDb().rpc('wtech_public_settings');
    if (error) throw error;
    return Response.json({ ok: true, database: 'connected' }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ ok: false, database: 'unavailable' }, { status: 503, headers: { 'cache-control': 'no-store' } });
  }
}
