"use client";

/** Last-resort error page outside the locale layout: no translations available, brand colours only. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, background: "#000", color: "#F5F1EA", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ maxWidth: 540 }}>
            <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em" }}>A apărut o eroare. / Произошла ошибка. / Something went wrong.</h1>
            <button type="button" onClick={reset} style={{ marginTop: 24, background: "#F5F1EA", color: "#000", padding: "12px 24px", borderRadius: 999, border: 0, fontWeight: 500, cursor: "pointer" }}>
              Reîncearcă · Повторить · Retry
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
