"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, RefreshCw, ArrowRight, Search } from "lucide-react";
import {
  stages,
  stageLabels,
  type WorkspaceLead,
  type LeadNote,
  type Role,
} from "@/lib/workspace-types";
import { logout } from "@/app/admin/actions";
type Audit = {
  id: number;
  entity: string;
  entity_id: string;
  action: string;
  created_at: string;
};
type Data = {
  leads: WorkspaceLead[];
  notes: LeadNote[];
  audit: Audit[];
  role: Role;
};
export function LeadWorkspace({
  initial,
  email,
}: {
  initial: Data;
  email: string;
}) {
  const [data, setData] = useState(initial);
  const [view, setView] = useState("today");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [board, setBoard] = useState(true);
  const [detail, setDetail] = useState<WorkspaceLead | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  useEffect(() => {
    const params = new URL(location.href).searchParams;
    setView(params.get("view") || "today");
    const id = Number(params.get("lead"));
    if (id) setDetail(initial.leads.find((l) => l.id === id) || null);
  }, [initial.leads]);
  function nav(v: string, f = "all") {
    setView(v);
    setFilter(f);
    setDetail(null);
    history.pushState(null, "", `/admin?view=${v}`);
  }
  function open(l: WorkspaceLead) {
    setDetail(l);
    history.pushState(null, "", `/admin?view=${view}&lead=${l.id}`);
  }
  async function refresh() {
    const r = await fetch("/admin/api", { cache: "no-store" });
    if (r.status === 401) {
      location.assign("/admin/refresh");
      throw Error("Sesiunea a expirat.");
    }
    if (!r.ok) throw Error("Datele nu sunt disponibile.");
    const next: Data = await r.json();
    setData(next);
    if (detail) setDetail(next.leads.find((l) => l.id === detail.id) || null);
  }
  async function send(action: string, value: unknown) {
    if (busy) return false;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/admin/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data: value }),
      });
      const d = await r.json();
      if (!r.ok)
        throw Error(
          d.error === "edit_conflict"
            ? "Înregistrarea s-a modificat. Reîncarcă înainte de salvare."
            : "Salvarea nu a reușit. Datele introduse sunt păstrate.",
        );
      await refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Salvare nereușită.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  const now = Date.now();
  const overdue = (l: WorkspaceLead) =>
    !!l.follow_up_at && new Date(l.follow_up_at).getTime() < now && !l.handled;
  const visible = data.leads.filter(
    (l) =>
      [l.name, l.company, l.email, l.phone, l.interest]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "new" && l.stage === "new") ||
        (filter === "unassigned" && !l.owner_id) ||
        (filter === "overdue" && overdue(l))),
  );
  async function saveLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!detail) return;
    const f = new FormData(e.currentTarget);
    const ok = await send("lead", {
      id: detail.id,
      version: detail.version,
      stage: f.get("stage"),
      next_action: String(f.get("next_action") || "") || null,
      follow_up_at: f.get("follow_up_at")
        ? new Date(String(f.get("follow_up_at"))).toISOString()
        : null,
      value: Number(f.get("value")),
      currency: f.get("currency"),
      handled: f.get("handled") === "on",
      assign: f.get("assign") === "on",
    });
    if (ok) setError("");
  }
  const leadButton = (l: WorkspaceLead) => (
    <button className="record-line" key={l.id} onClick={() => open(l)}>
      <strong>{l.name || `Cerere #${l.id}`}</strong>
      <span>
        {l.company || l.interest || "Fără companie"} · {stageLabels[l.stage]}
      </span>
      <span>{l.next_action || "Stabilește următoarea acțiune"}</span>
    </button>
  );
  return (
    <div className="workspace">
      <header className="workspace-header">
        <Link href="/admin" className="workspace-brand">
          WTECH <span>Workspace</span>
        </Link>
        <div>
          <span>
            {email} · {data.role}
          </span>
          <form action={logout}>
            <button className="btn btn-ghost">Ieșire</button>
          </form>
        </div>
      </header>
      <div className="workspace-layout">
        <nav className="workspace-nav" aria-label="Administrare leaduri">
          {[
            ["today", "Overview"],
            ["inbox", "Inbox / Leads"],
            ["pipeline", "Pipeline"],
            ["followup", "Follow-up"],
            ["history", "Istoric"],
          ].map(([v, label]) => (
            <button
              key={v}
              aria-current={view === v ? "page" : undefined}
              onClick={() => nav(v!)}
            >
              {label}
            </button>
          ))}
          <Link href="/" target="_blank">
            Website ↗
          </Link>
          <a href="/admin/leads.csv">Export CSV</a>
        </nav>
        <section className="workspace-main">
          <div className="workspace-toolbar">
            <h1>
              {detail
                ? detail.name || `Cerere #${detail.id}`
                : (
                    {
                      today: "Overview",
                      inbox: "Inbox / Leads",
                      pipeline: "Pipeline",
                      followup: "Follow-up",
                      history: "Istoric",
                    } as Record<string, string>
                  )[view] || "Overview"}
            </h1>
            <button
              className="w-icon-button"
              aria-label="Reîncarcă datele"
              onClick={() => refresh().catch((e) => setError(e.message))}
            >
              <RefreshCw size={18} />
            </button>
          </div>
          {error ? (
            <p className="workspace-error" role="alert">
              {error}
            </p>
          ) : null}
          {detail ? (
            <div className="lead-detail">
              <button className="btn btn-ghost" onClick={() => nav(view)}>
                Înapoi
              </button>
              <div className="detail-grid">
                <article>
                  <h2>Cererea originală</h2>
                  <p>{detail.message || "Fără mesaj suplimentar."}</p>
                  <dl>
                    {[
                      ["Companie", detail.company],
                      ["Email", detail.email],
                      ["Telefon", detail.phone],
                      ["Canal preferat", detail.channel],
                      ["Interes", detail.interest],
                      ["Sursă", detail.source],
                      [
                        "Primită",
                        new Date(detail.created_at).toLocaleString("ro-RO"),
                      ],
                      [
                        "Notificare",
                        detail.delivered
                          ? "Livrată"
                          : "Salvată în inbox; livrare externă neconfirmată",
                      ],
                      ["Politică", detail.privacy_version],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v || "Nespecificat / cerere existentă"}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
                <form key={detail.version} onSubmit={saveLead}>
                  <label>
                    Etapă
                    <select name="stage" defaultValue={detail.stage}>
                      {stages.map((s) => (
                        <option key={s} value={s}>
                          {stageLabels[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Următoarea acțiune
                    <textarea
                      name="next_action"
                      maxLength={500}
                      defaultValue={detail.next_action || ""}
                    />
                  </label>
                  <label>
                    Follow-up
                    <input
                      name="follow_up_at"
                      type="datetime-local"
                      defaultValue={
                        detail.follow_up_at
                          ? new Date(
                              new Date(detail.follow_up_at).getTime() -
                                new Date().getTimezoneOffset() * 60000,
                            )
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                    />
                  </label>
                  <div className="editor-grid">
                    <label>
                      Valoare pipeline
                      <input
                        name="value"
                        type="number"
                        min="0"
                        step=".01"
                        defaultValue={detail.value}
                      />
                    </label>
                    <label>
                      Monedă
                      <input
                        name="currency"
                        pattern="[A-Z]{3}"
                        defaultValue={detail.currency}
                      />
                    </label>
                  </div>
                  <label className="check-label">
                    <input name="assign" type="checkbox" />
                    Atribuie-mi cererea
                  </label>
                  <label className="check-label">
                    <input
                      name="handled"
                      type="checkbox"
                      defaultChecked={detail.handled}
                    />
                    Procesată
                  </label>
                  <p>
                    Etapa Câștigat marchează decizia comercială. Valoarea
                    pipeline-ului nu reprezintă o încasare.
                  </p>
                  <button className="btn btn-primary" disabled={busy}>
                    {busy ? "Salvăm…" : "Salvează"}
                  </button>
                </form>
              </div>
              <h2>Notițe și follow-up</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const ok = await send("note", {
                    lead_id: detail.id,
                    title: "Notă / follow-up",
                    notes: note,
                    status: "open",
                    due_at: f.get("due")
                      ? new Date(String(f.get("due"))).toISOString()
                      : null,
                  });
                  if (ok) setNote("");
                }}
              >
                <label>
                  Notă nouă
                  <textarea
                    required
                    maxLength={4000}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </label>
                <label>
                  Termen (opțional)
                  <input name="due" type="datetime-local" />
                </label>
                <button
                  className="btn btn-ghost"
                  disabled={busy || !note.trim()}
                >
                  Salvează nota
                </button>
              </form>
              {data.notes
                .filter((n) => n.lead_id === detail.id)
                .map((n) => (
                  <article className="lead-note" key={n.id}>
                    <p>{n.payload.notes}</p>
                    <small>
                      {new Date(n.created_at).toLocaleString("ro-RO")}
                      {n.due_at
                        ? ` · Termen ${new Date(n.due_at).toLocaleString("ro-RO")}`
                        : ""}{" "}
                      · {n.status}
                    </small>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={busy}
                      onClick={() =>
                        send("note", {
                          id: n.id,
                          version: n.version,
                          lead_id: detail.id,
                          title: n.title,
                          notes: n.payload.notes || n.title,
                          status: n.status === "done" ? "open" : "done",
                          due_at: n.due_at,
                        })
                      }
                    >
                      {n.status === "done" ? "Redeschide" : "Finalizat"}
                    </button>
                  </article>
                ))}
              <h2>Istoric</h2>
              {data.audit
                .filter(
                  (a) =>
                    a.entity === "leads" && a.entity_id === String(detail.id),
                )
                .map((a) => (
                  <p key={a.id}>
                    {new Date(a.created_at).toLocaleString("ro-RO")} ·{" "}
                    {a.action}
                  </p>
                ))}
            </div>
          ) : null}
          {!detail && view === "today" ? (
            <>
              <p className="workspace-intro">
                Cererile primite, responsabilul și următoarea acțiune. Date
                persistente, fără înregistrări demonstrative.
              </p>
              <div className="today-grid">
                {[
                  [
                    "Cereri noi",
                    data.leads.filter((l) => l.stage === "new").length,
                    "new",
                  ],
                  [
                    "Neatribuite",
                    data.leads.filter((l) => !l.owner_id).length,
                    "unassigned",
                  ],
                  [
                    "Follow-up restant",
                    data.leads.filter(overdue).length,
                    "overdue",
                  ],
                ].map(([label, count, f]) => (
                  <button
                    className="today-tile"
                    key={label}
                    onClick={() => nav("inbox", String(f))}
                  >
                    <span>{label}</span>
                    <strong>{count}</strong>
                    <ArrowRight size={18} />
                  </button>
                ))}
              </div>
              <h2>Următorii pași</h2>
              {data.leads
                .filter((l) => l.next_action && !l.handled)
                .slice(0, 10)
                .map(leadButton)}
              {!data.leads.length ? (
                <p className="empty-state">
                  Nu există cereri. Cererile website-ului vor apărea aici.
                </p>
              ) : null}
            </>
          ) : null}
          {!detail && ["inbox", "pipeline", "followup"].includes(view) ? (
            <>
              <label className="workspace-search">
                <Search size={18} />
                <input
                  aria-label="Caută leaduri"
                  placeholder="Caută nume, companie sau contact…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="record-actions">
                <select
                  aria-label="Filtrează cereri"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Toate</option>
                  <option value="new">Noi</option>
                  <option value="unassigned">Neatribuite</option>
                  <option value="overdue">Follow-up restant</option>
                </select>
                {view === "pipeline" ? (
                  <button
                    className="btn btn-ghost"
                    onClick={() => setBoard((v) => !v)}
                  >
                    {board ? <List size={18} /> : <LayoutGrid size={18} />}
                    {board ? "Listă" : "Board"}
                  </button>
                ) : null}
              </div>
              {view === "pipeline" && board ? (
                <div className="pipeline-board">
                  {stages.map((stage) => (
                    <div key={stage} className="pipeline-column">
                      <h2>
                        {stageLabels[stage]}{" "}
                        <span>
                          {visible.filter((l) => l.stage === stage).length}
                        </span>
                      </h2>
                      {visible
                        .filter((l) => l.stage === stage)
                        .map((l) => (
                          <button
                            className="pipeline-card"
                            key={l.id}
                            onClick={() => open(l)}
                          >
                            <strong>{l.name || `Cerere #${l.id}`}</strong>
                            <span>{l.company || l.interest}</span>
                            <span>
                              {l.value
                                ? `${l.value} ${l.currency}`
                                : "Valoare neconfirmată"}
                            </span>
                            <small>
                              {l.next_action || "Stabilește următoarea acțiune"}
                            </small>
                          </button>
                        ))}
                    </div>
                  ))}
                </div>
              ) : (
                visible
                  .filter((l) => view !== "followup" || l.follow_up_at)
                  .map(leadButton)
              )}
              {view === "followup"
                ? data.notes
                    .filter((n) => n.status !== "done" && n.due_at)
                    .map((n) => (
                      <button
                        className="record-line"
                        key={n.id}
                        onClick={() => {
                          const l = data.leads.find((l) => l.id === n.lead_id);
                          if (l) open(l);
                        }}
                      >
                        <strong>{n.payload.notes}</strong>
                        <span>
                          {new Date(n.due_at!).toLocaleString("ro-RO")}
                        </span>
                      </button>
                    ))
                : null}
              {!visible.length ? (
                <p className="empty-state">Nicio cerere pentru filtrul ales.</p>
              ) : null}
            </>
          ) : null}
          {!detail && view === "history" ? (
            <>
              <p className="workspace-intro">
                Schimbări persistente asupra cererilor și notițelor. Nicio
                ștergere permanentă din interfață.
              </p>
              {data.audit.map((a) => (
                <p className="record-line" key={a.id}>
                  <span>{new Date(a.created_at).toLocaleString("ro-RO")}</span>
                  <strong>
                    {a.entity} #{a.entity_id}
                  </strong>
                  <span>{a.action}</span>
                </p>
              ))}
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
