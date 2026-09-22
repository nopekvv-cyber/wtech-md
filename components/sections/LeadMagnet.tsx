import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { AuditForm } from "./AuditForm";
import { BundleShell } from "@/components/ui/BundleShell";

export function LeadMagnet() {
  const t = useTranslations("audit");
  return (
    <section id="audit" className="section" aria-labelledby="audit-title">
      <div className="container-x">
        <BundleShell accent="violet" interactive className="p-7 md:p-12 lg:p-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="bundle-kicker">WTECH audit bundle</p>
              <h2 id="audit-title" className="text-[32px] md:text-[42px] mt-4">{t("title")}</h2>
              <p className="text-dim mt-4 text-lg">{t("sub")}</p>
            </div>
            <div className="lg:col-span-7">
              <Suspense fallback={null}><AuditForm place="lead-magnet" /></Suspense>
            </div>
          </div>
        </BundleShell>
      </div>
    </section>
  );
}
