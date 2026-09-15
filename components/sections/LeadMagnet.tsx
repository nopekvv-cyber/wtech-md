import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { AuditForm } from "./AuditForm";

export function LeadMagnet() {
  const t = useTranslations("audit");
  return (
    <section id="audit" className="section" aria-labelledby="audit-title">
      <div className="container-x">
        <div className="hairline pt-14 md:pt-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 id="audit-title" className="text-[32px] md:text-[40px]">{t("title")}</h2>
            <p className="text-dim mt-4 text-lg">{t("sub")}</p>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={null}><AuditForm place="lead-magnet" /></Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
