import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/components/site/MarketLink";
import { type Locale } from "@/i18n/routing";
import { serviceKeys, serviceSlugs } from "@/lib/services";
import { getSite } from "@/lib/settings";
import { Wordmark } from "@/components/ui/Wordmark";
import { LangSwitch } from "./Nav";
import { AuditForm } from "@/components/sections/AuditForm";
import { CookieSettingsButton } from "@/components/privacy/CookieSettingsButton";

export async function Footer({ showLanguages = true, showBlog = true }: { showLanguages?: boolean; showBlog?: boolean }) {
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
            {showBlog ? <li><Link href="/blog" className="hover:text-ink text-ink/85">{t("blog")}</Link></li> : null}
            <li><Link href="/contact" className="hover:text-ink text-ink/85">{t("contact")}</Link></li>
            <li><Link href="/audit" className="hover:text-ink text-ink/85">{t("audit")}</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-[15px] text-dim mb-4">{t("languages")}</h2>
          {showLanguages ? <LangSwitch current={locale as Locale} /> : <p className="text-[13px] leading-relaxed text-dim">USA · Canada<br />Australia · Europe</p>}
          <address className="not-italic text-dim text-[14px] mt-8 space-y-1">
            {contact.legalName ? <div>{contact.legalName}</div> : null}
            {contact.address ? <div>{contact.address}</div> : null}
            <div><a href={`mailto:${contact.email}`} className="hover:text-ink">{contact.email}</a></div>
            {contact.phone ? <div><a href={`tel:${contact.phoneHref}`} className="hover:text-ink">{contact.phone}</a></div> : null}
          </address>
        </div>
      </div>
      <div className="hairline">
        <div className="container-x py-6 grid gap-4 text-[13px] text-dim">
          <nav aria-label={t("legal")} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/legal-privacy" className="hover:text-ink">{t("privacy")}</Link>
            <Link href="/legal-terms" className="hover:text-ink">{t("terms")}</Link>
            <Link href="/legal-cookies" className="hover:text-ink">{t("cookies")}</Link>
            <Link href="/legal-refunds" className="hover:text-ink">{t("refunds")}</Link>
            <Link href="/legal-sms-consent" className="hover:text-ink">{t("sms")}</Link>
            <CookieSettingsButton className="hover:text-ink text-left" />
          </nav>
          <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <span>{t("rights")}</span>
            {contact.idno ? <span>{t("idno", { idno: contact.idno })}</span> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
