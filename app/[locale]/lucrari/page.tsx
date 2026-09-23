import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { BookButton } from "@/components/ui/BookButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("work.title") }, description: t("work.description"), alternates: await alternatesFor("/lucrari", locale as Locale) };
}

const ITEMS = [
  { k: "w1", img: "/media/work-1.jpg" },
  { k: "w2", img: "/media/work-2.jpg" },
  { k: "w3", img: "/media/work-3.jpg" },
] as const;

export default async function Work({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "work" });
  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x">
        <h1 className="text-[36px] md:text-[52px]">{t("title")}</h1>
        <p className="text-dim mt-4 text-lg max-w-[620px]">{t("sub")}</p>
        <ul className="mt-14 border-t border-line divide-y divide-white/10">
          {ITEMS.map((it, i) => (
            <li key={it.k} className="py-12 grid lg:grid-cols-12 gap-8 items-center">
              <div className={`lg:col-span-7 ${i % 2 ? "lg:order-2" : ""} rounded-[var(--radius-lg)] overflow-hidden border border-line`}>
                <Image src={it.img} alt={t(it.k)} width={1344} height={752} sizes="(min-width:1024px) 60vw, 100vw" className="w-full h-auto" priority={i === 0} />
              </div>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
                <div className="text-dim text-[14px]">{t("concept")}</div>
                <h2 className="text-[26px] md:text-[32px] mt-2">{t(it.k)}</h2>
                <p className="text-dim mt-3 max-w-[460px]">{t(`${it.k}d`)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12"><BookButton place="work">{t("cta")}</BookButton></div>
      </div>
    </section>
  );
}
