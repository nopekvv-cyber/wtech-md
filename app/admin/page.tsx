import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { FIELDS, loadSettings } from "@/lib/settings";
import { countLeads } from "@/lib/db";
import { logout } from "./actions";
import { LoginForm, SettingsForm } from "./forms";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <>
        <h1 className="text-[32px] md:text-[40px]">wtech.md admin</h1>
        <p className="text-dim mt-3 max-w-[520px]">Contact channels, proof numbers and socials shown on the site. Changes go live immediately.</p>
        <LoginForm />
      </>
    );
  }
  const [stored, open] = await Promise.all([loadSettings(), countLeads(true)]);
  const groups: Array<{ id: (typeof FIELDS)[number]["group"]; title: string; note?: string }> = [
    { id: "contact", title: "Contact", note: "Empty channels are hidden on the site. Phone numbers are stored as +373…" },
    { id: "proof", title: "Proof numbers", note: "Only real numbers from your own systems. Empty ones are not shown; with all three empty the whole band disappears." },
    { id: "social", title: "Social profiles", note: "Full https:// links. Used for the Organization schema and the footer." },
  ];
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] md:text-[40px]">wtech.md admin</h1>
        <div className="flex items-center gap-3 text-[14px]">
          <Link href="/admin/leads" className="btn btn-primary btn-sm">Leads{open ? ` · ${open} new` : ""}</Link>
          <Link href="/" className="text-dim hover:text-ink" target="_blank" rel="noopener noreferrer">Open the site ↗</Link>
          <form action={logout}><button type="submit" className="btn btn-ghost btn-sm">Sign out</button></form>
        </div>
      </div>
      <SettingsForm groups={groups} fields={FIELDS} values={stored} />
    </>
  );
}
