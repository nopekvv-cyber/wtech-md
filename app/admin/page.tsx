import { getActor } from "@/lib/admin-auth";
import { LeadWorkspace } from "@/components/admin/LeadWorkspace";
import { LoginForm } from "./forms";
import type { WorkspaceLead, LeadNote } from "@/lib/workspace-types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REFRESH_COOKIE } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const actor = await getActor();
  if (!actor) {
    if ((await cookies()).has(REFRESH_COOKIE)) redirect("/admin/refresh");
    return (
      <section className="owner-login">
        <strong>WTECH</strong>
        <h1>Workspace privat</h1>
        <p>
          Autentificare pentru conturile autorizate. Accesul este verificat pe
          server.
        </p>
        <LoginForm />
      </section>
    );
  }
  const [leads, records, audit] = await Promise.all([
    actor.db
      .from("leads")
      .select("*")
      .order("id", { ascending: false })
      .limit(200),
    actor.db
      .from("wtech_records")
      .select(
        "id,title,status,lead_id,due_at,payload,version,created_at,updated_at",
      )
      .eq("module", "tasks")
      .order("updated_at", { ascending: false })
      .limit(500),
    actor.role === "owner"
      ? actor.db
          .from("wtech_audit")
          .select("id,entity,entity_id,action,created_at")
          .order("id", { ascending: false })
          .limit(200)
      : Promise.resolve({ data: [] }),
  ]);
  if (records.error)
    return (
      <section className="owner-login">
        <h1>Workspace indisponibil</h1>
        <p>
          Schema sau conexiunea nu este disponibilă. Datele nu au fost înlocuite
          cu un demo.
        </p>
      </section>
    );
  return (
    <LeadWorkspace
      email={actor.email || ""}
      initial={{
        role: actor.role,
        leads: (leads.data || []) as WorkspaceLead[],
        notes: (records.data || []) as LeadNote[],
        audit: audit.data || [],
      }}
    />
  );
}
