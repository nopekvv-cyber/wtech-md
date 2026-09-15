import { isAdmin } from "@/lib/admin-auth";
import { leadsCsv } from "@/lib/db";

export const dynamic = "force-dynamic";

/** CSV of every lead, admin session required. */
export async function GET() {
  if (!(await isAdmin())) return new Response("unauthorized", { status: 401 });
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(await leadsCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="wtech-leads-${stamp}.csv"`,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
