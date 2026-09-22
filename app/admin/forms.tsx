"use client";

import { useActionState } from "react";
import type { Field } from "@/lib/settings";
import { login, saveSettings, type ActionState } from "./actions";

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="mt-10 max-w-[420px] grid gap-4" aria-describedby={state.error ? "login-err" : undefined}>
      <label className="grid gap-2 text-[14px] text-dim">
        Parolă
        <input name="password" type="password" autoComplete="current-password" required className="field" />
      </label>
      {state.error ? <p id="login-err" role="alert" className="error-text">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "…" : "Intră în CRM"}</button>
      <p className="text-dim text-[13px]">Folosește parola ADMIN_PASSWORD configurată în Vercel. Cheia nu este afișată sau trimisă către browser.</p>
    </form>
  );
}

export function SettingsForm({ groups, fields, values }: { groups: Array<{ id: Field["group"]; title: string; note?: string }>; fields: Field[]; values: Record<string, string> }) {
  const [state, action, pending] = useActionState(saveSettings, initial);
  return (
    <form action={action} className="mt-8 grid gap-8">
      {groups.map((g) => (
        <fieldset key={g.id} className="rounded-[var(--radius-lg)] border border-line p-6 m-0">
          <legend className="px-2 text-[22px]">{g.title}</legend>
          {g.note ? <p className="text-dim text-[14px] mb-5">{g.note}</p> : null}
          <div className="grid md:grid-cols-2 gap-4">
            {fields.filter((f) => f.group === g.id).map((f) => (
              <label key={f.key} className="grid gap-2 text-[14px] text-dim">
                {f.label}
                <input
                  name={f.key}
                  defaultValue={values[f.key] ?? ""}
                  type={f.type === "number" ? "text" : f.type}
                  inputMode={f.type === "number" || f.type === "tel" ? "numeric" : undefined}
                  placeholder={f.hint}
                  maxLength={f.max ?? 200}
                  className="field"
                />
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Se salvează…" : "Salvează modificările"}</button>
        {state.error ? <p role="alert" className="error-text">{state.error}</p> : null}
        {state.ok ? <p role="status" className="text-[14px] text-dim">Salvat. Site-ul afișează valorile noi la următoarea încărcare.</p> : null}
      </div>
    </form>
  );
}
