"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Branded 500 for the locale segment; the error itself only goes to the server/console log. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errorPage");
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="min-h-[100dvh] grid place-items-center" style={{ paddingTop: "var(--nav-h)" }}>
      <div className="container-x">
        <div className="max-w-[540px]">
          <h1 className="text-[36px] md:text-[52px]">{t("title")}</h1>
          <p className="text-dim mt-4 text-lg">{t("sub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={reset}>{t("retry")}</button>
            <Link href="/" className="btn btn-ghost">{t("home")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
