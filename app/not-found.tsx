import Link from "next/link";
import Image from "next/image";

// Root not-found for paths outside the [locale] segment (e.g. unknown locale prefixes)
export default function RootNotFound() {
  return (
    <html lang="ro">
      <body style={{ background: "#000", color: "#F5F1EA", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24, position: "relative" }}>
          <Image src="/media/not-found.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.6 }} priority />
          <div style={{ position: "relative", maxWidth: 540 }}>
            <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.02em" }}>Pagina asta nu există.</h1>
            <p style={{ opacity: 0.6, marginTop: 12 }}>Dar sistemul tău poate exista.</p>
            <Link href="/" style={{ display: "inline-block", marginTop: 24, background: "#F5F1EA", color: "#000", padding: "12px 24px", borderRadius: 999, textDecoration: "none", fontWeight: 500 }}>
              wtech.md
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
