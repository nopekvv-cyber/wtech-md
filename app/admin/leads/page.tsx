import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { listLeads, countLeads } from "@/lib/db";
import { toggleHandled, logout } from "../actions";

export const dynamic = "force-dynamic";

const PAGE = 50;
const KIND: Record<string, string> = { contact: "Contact form", call: "Call request", audit: "Audit request", chat: "Ana chat" };

function when(iso: string) {
  try { return new Intl.DateTimeFormat("ro-MD", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Chisinau" }).format(new Date(iso)); } catch { return iso; }
}

/** Every lead the site collected (forms, booking, audit, Ana), newest first. Telegram/SMTP are optional extras. */
export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ all?: string; p?: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const sp = await searchParams;
  const all = sp.all === "1";
  const page = Math.max(1, Number(sp.p) || 1);
  const [total, leads] = await Promise.all([
    countLeads(!all),
    listLeads({ open: !all, limit: PAGE, offset: (page - 1) * PAGE }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const back = `/admin/leads${all ? "?all=1" : ""}${page > 1 ? `${all ? "&" : "?"}p=${page}` : ""}`;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] md:text-[40px]">Leads</h1>
          <p className="text-dim text-[14px] mt-1">{all ? `${total} in total` : `${total} new`} · saved the moment a visitor submits, whether or not Telegram or e-mail is configured.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[14px]">
          <Link href="/admin" className="text-dim hover:text-ink">← Settings</Link>
          <Link href={all ? "/admin/leads" : "/admin/leads?all=1"} className="btn btn-ghost btn-sm">{all ? "Show new only" : "Show all"}</Link>
          <a href="/admin/leads.csv" className="btn btn-ghost btn-sm">Download CSV</a>
          <form action={logout}><button type="submit" className="btn btn-ghost btn-sm">Sign out</button></form>
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="text-dim mt-12">{all ? "No leads yet." : "Nothing new. Everything is handled."}</p>
      ) : (
        <ol className="mt-8 grid gap-3">
          {leads.map((l) => (
            <li key={l.id} className={`rounded-[var(--radius-lg)] border border-line p-5 ${l.handled ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-dim">
                <span><span className="text-ink">{KIND[l.kind] ?? l.kind}</span> · {when(l.created_at)} · {l.locale.toUpperCase()} · #{l.id}</span>
                <form action={toggleHandled} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="handled" value={l.handled ? "0" : "1"} />
                  <input type="hidden" name="back" value={back} />
                  <button type="submit" className="btn btn-ghost btn-sm">{l.handled ? "Mark as new" : "Mark handled"}</button>
                </form>
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-x-8 gap-y-1 text-[15px]">
                {l.name ? <div><span className="text-dim">Name </span>{l.name}</div> : null}
                {l.company ? <div><span className="text-dim">Company </span>{l.company}</div> : null}
                {l.phone ? <div><span className="text-dim">Phone </span><a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a></div> : null}
                {l.email ? <div><span className="text-dim">E-mail </span><a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a></div> : null}
                {l.url ? <div><span className="text-dim">Site </span>{l.url}</div> : null}
                {l.interest ? <div><span className="text-dim">Interest </span>{l.interest}</div> : null}
              </div>
              {l.message ? <p className="mt-3 text-[15px] whitespace-pre-wrap">{l.message}</p> : null}
              {!l.delivered && (process.env.TELEGRAM_BOT_TOKEN || process.env.SMTP_HOST) ? <p className="mt-2 text-[12px] text-dim">Notification was not delivered; the lead is safe here.</p> : null}
            </li>
          ))}
        </ol>
      )}

      {pages > 1 ? (
        <nav className="mt-8 flex items-center gap-3 text-[14px]" aria-label="Pages">
          {page > 1 ? <Link href={`/admin/leads?${all ? "all=1&" : ""}p=${page - 1}`} className="btn btn-ghost btn-sm">← Newer</Link> : null}
          <span className="text-dim">Page {page} of {pages}</span>
          {page < pages ? <Link href={`/admin/leads?${all ? "all=1&" : ""}p=${page + 1}`} className="btn btn-ghost btn-sm">Older →</Link> : null}
        </nav>
      ) : null}
    </>
  );
}
