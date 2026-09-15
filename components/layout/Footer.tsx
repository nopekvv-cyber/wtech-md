import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { serviceKeys, serviceSlugs } from "@/lib/services";
import { getSite } from "@/lib/settings";
import { Wordmark } from "@/components/ui/Wordmark";
import { LangSwitch } from "./Nav";
import { AuditForm } from "@/components/sections/AuditForm";

export async function Footer() {
  const [t, ts, locale, site] = await Promise.all([
    getTranslations("footer"),
    getTranslations("services.items"),
    getLocale(),
    getSite(),
  ]);
  const { contact } = site;
  return (
    <footer className="hairline mt-[var(--section-y)]">
      <div className="container-x py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark size={28} />
          <p className="text-dim mt-5 max-w-[360px]">{t("tagline")}</p>
          <div className="mt-8 max-w-[420px]">
            <AuditForm compact place="footer" />
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-[15px] text-dim mb-4">{t("services")}</h2>
          <ul className="space-y-3">
            {serviceKeys.map((k) => (
              <li key={k}>
                <Link href={{ pathname: "/servicii/[slug]", params: { slug: serviceSlugs[k][locale as Locale] } }} className="hover:text-ink text-ink/85 transition-colors">
                  {ts(`${k}.name`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-[15px] text-dim mb-4">{t("company")}</h2>
          <ul className="space-y-3">
            <li><Link href="/despre" className="hover:text-ink text-ink/85">{t("about")}</Link></li>
            <li><Link href="/lucrari" className="hover:text-ink text-ink/85">{t("work")}</Link></li>
            <li><Link href="/preturi" className="hover:text-ink text-ink/85">{t("pricing")}</Link></li>
            <li><Link href="/blog" className="hover:text-ink text-ink/85">{t("blog")}</Link></li>
            <li><Link href="/contact" className="hover:text-ink text-ink/85">{t("contact")}</Link></li>
            <li><Link href="/audit" className="hover:text-ink text-ink/85">{t("audit")}</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-[15px] text-dim mb-4">{t("languages")}</h2>
          <LangSwitch current={locale as Locale} />
          <address className="not-italic text-dim text-[14px] mt-8 space-y-1">
            {contact.address ? <div>{contact.address}</div> : null}
            <div><a href={`mailto:${contact.email}`} className="hover:text-ink">{contact.email}</a></div>
            {contact.phone ? <div><a href={`tel:${contact.phoneHref}`} className="hover:text-ink">{contact.phone}</a></div> : null}
          </address>
        </div>
      </div>
      <div className="hairline">
        <div className="container-x py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-[13px] text-dim">
          <span>{t("rights")}</span>
          {contact.idno ? <span>{t("idno", { idno: contact.idno })}</span> : null}
        </div>
      </div>
    </footer>
  );
}
