"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceSlugs } from "@/lib/services";
import { LoopVideo } from "@/components/ui/LoopVideo";

export function CustomSoftware() {
  const t = useTranslations("software");
  const locale = useLocale() as Locale;
  return (
    <section id="software" className="section pt-0" aria-labelledby="sw-title">
      <div className="relative w-full aspect-[16/9] max-h-[80vh] overflow-hidden">
        <LoopVideo base="custom-software" alt={t("alt")} aspect="16 / 9" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" aria-hidden="true" />
      </div>
      <div className="container-x -mt-24 md:-mt-40 relative">
        <h2 id="sw-title" className="text-[32px] md:text-[44px] max-w-[760px]">{t("title")}</h2>
        <p className="text-dim mt-5 text-lg max-w-[620px]">{t("p")}</p>
        <Link href={{ pathname: "/servicii/[slug]", params: { slug: serviceSlugs.software[locale] } }} className="link-inline mt-7">
          {t("cta")} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
