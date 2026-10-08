import { getActor } from "@/lib/admin-auth";
export async function GET() {
  const actor = await getActor();
  if (!actor || !["owner", "sales"].includes(actor.role))
    return Response.json({ error: "unauthorized" }, { status: 401 });
  const { data, error } = await actor.db
    .from("leads")
    .select(
      "id,created_at,name,company,phone,email,channel,interest,stage,next_action,follow_up_at",
    )
    .limit(10000);
  if (error) return Response.json({ error: "unavailable" }, { status: 503 });
  const rows = data || [];
  const columns = Object.keys(rows[0] || { id: "" });
  const cell = (v: unknown) =>
    '"' +
    String(v ?? "")
      .replace(/^[=+\-@\t\r]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  await actor.db
    .from("wtech_audit")
    .insert({
      actor_id: actor.id,
      entity: "leads",
      entity_id: "export",
      action: "CSV_EXPORT",
      after_data: { count: rows.length },
    });
  return new Response(
    "\ufeff" +
      [
        columns.join(","),
        ...rows.map((r) =>
          columns.map((k) => cell((r as Record<string, unknown>)[k])).join(","),
        ),
      ].join("\r\n"),
    {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": 'attachment; filename="wtech-leads.csv"',
        "Cache-Control": "no-store",
      },
    },
  );
}
