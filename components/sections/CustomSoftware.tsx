"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceSlugs } from "@/lib/services";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { BundleShell } from "@/components/ui/BundleShell";

export function CustomSoftware() {
  const t = useTranslations("software");
  const locale = useLocale() as Locale;
  return (
    <section id="software" className="section" aria-labelledby="sw-title">
      <div className="container-x">
        <BundleShell accent="cyan" interactive>
          <div className="relative aspect-[16/9] max-h-[680px] overflow-hidden border-b border-line">
            <LoopVideo base="custom-software" alt={t("alt")} aspect="16 / 9" className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none" aria-hidden="true" />
          </div>
          <div className="p-7 md:p-12 lg:p-14">
            <p className="bundle-kicker">WTECH custom bundle</p>
            <h2 id="sw-title" className="text-[32px] md:text-[46px] max-w-[760px] mt-4">{t("title")}</h2>
            <p className="text-dim mt-5 text-lg max-w-[620px]">{t("p")}</p>
            <Link href={{ pathname: "/servicii/[slug]", params: { slug: serviceSlugs.software[locale] } }} className="link-inline mt-7">
              {t("cta")} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </BundleShell>
      </div>
    </section>
  );
}
