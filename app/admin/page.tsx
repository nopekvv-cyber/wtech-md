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
        <p className="text-[13px] uppercase tracking-[0.18em] text-dim">wtech.md</p>
        <h1 className="mt-2 text-[32px] md:text-[40px]">WTECH CRM</h1>
        <p className="text-dim mt-3 max-w-[520px]">Acces securizat la leadurile primite prin Ana, formularele website-ului și setările publice.</p>
        <LoginForm />
      </>
    );
  }
  const [stored, open, total] = await Promise.all([loadSettings(), countLeads(true), countLeads(false)]);
  const groups: Array<{ id: (typeof FIELDS)[number]["group"]; title: string; note?: string }> = [
    { id: "contact", title: "Contact", note: "Canalele necompletate sunt ascunse pe site. Numerele sunt salvate în format +373…" },
    { id: "proof", title: "Cifre verificate", note: "Folosește doar cifre reale din sistemele proprii. Câmpurile goale nu sunt afișate." },
    { id: "social", title: "Rețele sociale", note: "Linkuri complete https://, folosite în footer și în datele structurate Google." },
  ];
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[13px] uppercase tracking-[0.18em] text-dim">wtech.md</p>
          <h1 className="mt-1 text-[32px] md:text-[40px]">WTECH CRM</h1>
        </div>
        <div className="flex items-center gap-3 text-[14px]">
          <Link href="/admin/leads" className="btn btn-primary btn-sm">Leaduri{open ? ` · ${open} noi` : ""}</Link>
          <Link href="/" className="text-dim hover:text-ink" target="_blank" rel="noopener noreferrer">Deschide site-ul ↗</Link>
          <form action={logout}><button type="submit" className="btn btn-ghost btn-sm">Ieșire</button></form>
        </div>
      </div>
      <section className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Rezumat CRM">
        <Link href="/admin/leads" className="rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:border-ink/35">
          <span className="text-[13px] uppercase tracking-[0.12em] text-dim">Necesită răspuns</span>
          <strong className="mt-2 block text-[34px] font-medium">{open}</strong>
          <span className="text-[14px] text-dim">Leaduri noi din Ana și formularele site-ului</span>
        </Link>
        <Link href="/admin/leads?all=1" className="rounded-[var(--radius-lg)] border border-line p-5 transition-colors hover:border-ink/35">
          <span className="text-[13px] uppercase tracking-[0.12em] text-dim">Istoric CRM</span>
          <strong className="mt-2 block text-[34px] font-medium">{total}</strong>
          <span className="text-[14px] text-dim">Toate leadurile salvate în baza de date</span>
        </Link>
      </section>
      <h2 className="mt-12 text-[24px]">Setările website-ului</h2>
      <p className="text-dim mt-2 text-[14px]">Canalele de contact, cifrele și profilurile sociale se actualizează pe site după salvare.</p>
      <SettingsForm groups={groups} fields={FIELDS} values={stored} />
    </>
  );
}
