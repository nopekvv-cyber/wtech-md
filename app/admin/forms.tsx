"use client";

import { useActionState } from "react";
import { login, type ActionState } from "./actions";

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form
      action={action}
      className="mt-10 max-w-[420px] grid gap-4"
      aria-describedby={state.error ? "login-err" : undefined}
    >
      <label className="grid gap-2 text-[16px] text-dim">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="field"
        />
      </label>
      <label className="grid gap-2 text-[16px] text-dim">
        Parolă
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </label>
      {state.error ? (
        <p id="login-err" role="alert" className="error-text">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "…" : "Intră în workspace"}
      </button>
      <p className="text-dim text-[13px]">
        Folosește contul Supabase autorizat de owner. Nu există înscriere
        publică.
      </p>
    </form>
  );
}
