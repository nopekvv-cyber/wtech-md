import { getTranslations, setRequestLocale } from "next-intl/server";
import { legalDocuments, type LegalDocumentKey } from "@/content/legal";
import type { Locale } from "@/i18n/routing";
import { getSite } from "@/lib/settings";

export async function LegalPage({ locale, document }: { locale: Locale; document: LegalDocumentKey }) {
  setRequestLocale(locale);
  const [t, site] = await Promise.all([getTranslations({ locale, namespace: "legal" }), getSite()]);
  const copy = legalDocuments[locale][document];
  const { contact } = site;
  return (
    <article className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x max-w-[860px]">
        <p className="text-cyan text-[13px] uppercase tracking-[0.14em]">{t("updated", { date: copy.updated })}</p>
        <h1 className="text-[38px] md:text-[58px] mt-4">{copy.title}</h1>
        <p className="text-dim text-lg md:text-xl mt-5 max-w-[760px]">{copy.summary}</p>
        <div className="mt-14 space-y-11 text-[16px] md:text-[17px] leading-[1.75]">
          {copy.sections.map((section) => (
            <section key={section.title} aria-labelledby={`${document}-${section.title.replace(/\W+/g, "-").toLowerCase()}`}>
              <h2 id={`${document}-${section.title.replace(/\W+/g, "-").toLowerCase()}`} className="text-[24px] md:text-[28px] mb-4">{section.title}</h2>
              {section.paragraphs?.map((p) => <p key={p} className="text-ink/85 mb-4">{p}</p>)}
              {section.bullets ? <ul className="list-disc pl-6 space-y-3 text-ink/85">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            </section>
          ))}
        </div>
        <section className="mt-16 rounded-[var(--radius-lg)] border border-line bg-white/[0.025] p-6 md:p-8" aria-labelledby="business-details">
          <h2 id="business-details" className="text-[24px]">{t("businessDetails")}</h2>
          <dl className="mt-5 grid gap-3 text-[15px]">
            <div><dt className="text-dim inline">{t("tradeName")}: </dt><dd className="inline">wtech.md</dd></div>
            {contact.legalName ? <div><dt className="text-dim inline">{t("legalName")}: </dt><dd className="inline">{contact.legalName}</dd></div> : null}
            {contact.address ? <div><dt className="text-dim inline">{t("address")}: </dt><dd className="inline">{contact.address}</dd></div> : null}
            {contact.idno ? <div><dt className="text-dim inline">{t("registration")}: </dt><dd className="inline">{contact.idno}</dd></div> : null}
            <div><dt className="text-dim inline">{t("email")}: </dt><dd className="inline"><a className="link-inline" href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
            {contact.phone ? <div><dt className="text-dim inline">{t("phone")}: </dt><dd className="inline"><a className="link-inline" href={`tel:${contact.phoneHref}`}>{contact.phone}</a></dd></div> : null}
          </dl>
        </section>
      </div>
    </article>
  );
}
