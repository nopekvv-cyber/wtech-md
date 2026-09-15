import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { BookButton } from "@/components/ui/BookButton";
import { getSite } from "@/lib/settings";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("about.title") }, description: t("about.description"), alternates: alternatesFor("/despre", locale as Locale) };
}

/** Entity page for AI search: plain, quotable sentences about who wtech.md is. */
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const { contact } = await getSite();
  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h1 className="text-[36px] md:text-[52px]">{t("title")}</h1>
          <div className="mt-8 space-y-5 text-[18px] max-w-[640px]">
            <p>{t("p1")}</p>
            <p className="text-dim">{t("p2")}</p>
            <p className="text-dim">{t("p3")}</p>
          </div>
          <h2 className="text-[24px] mt-12">{t("facts")}</h2>
          <ul className="mt-4 border-t border-line divide-y divide-white/10 max-w-[640px]">
            {(["f1", "f2", "f3", "f4"] as const).map((k) => <li key={k} className="py-4">{t(k)}</li>)}
          </ul>
          <div className="mt-10"><BookButton place="about">{t("cta")}</BookButton></div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden border border-line">
            <Image src="/media/contact-abstract.jpg" alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
          {contact.address ? <p className="text-dim text-[14px] mt-4">{contact.address}</p> : null}
        </div>
      </div>
    </section>
  );
}
