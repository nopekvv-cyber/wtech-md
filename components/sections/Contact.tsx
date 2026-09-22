import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Phone, MessageCircle, Send, MapPin, Clock } from "lucide-react";
import { whatsappHref, telegramHref, viberHref } from "@/lib/site";
import { getSite } from "@/lib/settings";
import type { Locale } from "@/i18n/routing";
import { ContactForm } from "./ContactForm";
import { BookButton } from "@/components/ui/BookButton";
import { BundleShell } from "@/components/ui/BundleShell";

export async function Contact({ standalone = false }: { standalone?: boolean }) {
  const [t, locale, site] = await Promise.all([getTranslations("contact"), getLocale(), getSite()]);
  const { contact } = site;
  const Title = standalone ? "h1" : "h2";
  return (
    <section id="contact" className="relative section overflow-hidden" aria-labelledby="contact-title">
      <Image src="/media/bg-contact.jpg" alt="" fill sizes="100vw" className="object-cover opacity-60 pointer-events-none" />
      <div className="container-x relative">
        <BundleShell accent="cyan" className="p-7 md:p-12 lg:p-14">
          <p className="bundle-kicker">WTECH contact bundle</p>
          <Title id="contact-title" className={standalone ? "text-[36px] md:text-[54px] max-w-[760px] mt-4" : "text-[32px] md:text-[46px] max-w-[760px] mt-4"}>{t("title")}</Title>
          <p className="text-dim mt-4 text-lg max-w-[560px]">{t("sub")}</p>
          <div className="mt-14 md:mt-20 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7"><ContactForm /></div>
            <aside className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-line">
            <h3 className="text-dim text-[13px]">{t("aside.channels")}</h3>
            <ul className="mt-4 divide-y divide-white/10 border-t border-line text-[15px]">
              {contact.phone ? <li className="py-3.5 flex items-center gap-3"><Phone size={16} className="text-dim" aria-hidden="true" /><a href={`tel:${contact.phoneHref}`} className="hover:text-ink">{contact.phone}</a></li> : null}
              {contact.whatsapp ? <li className="py-3.5 flex items-center gap-3"><MessageCircle size={16} className="text-dim" aria-hidden="true" /><a href={whatsappHref(locale as Locale, contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{t("aside.whatsapp")}</a></li> : null}
              {contact.telegram ? <li className="py-3.5 flex items-center gap-3"><Send size={16} className="text-dim" aria-hidden="true" /><a href={telegramHref(contact.telegram)} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{t("aside.telegram")}</a></li> : null}
              {contact.viber ? <li className="py-3.5 flex items-center gap-3"><MessageCircle size={16} className="text-dim" aria-hidden="true" /><a href={viberHref(contact.viber)} className="hover:text-ink">{t("aside.viber")}</a></li> : null}
              <li className="py-3.5 flex items-center gap-3"><MapPin size={16} className="text-dim" aria-hidden="true" /><a href={`mailto:${contact.email}`} className="hover:text-ink">{contact.email}</a></li>
              {contact.address ? <li className="py-3.5 flex items-start gap-3"><MapPin size={16} className="text-dim mt-1" aria-hidden="true" /><span>{contact.address}</span></li> : null}
              <li className="py-3.5 flex items-start gap-3"><Clock size={16} className="text-dim mt-1" aria-hidden="true" /><span>{t("aside.hours")}<br /><span className="text-dim">{t("aside.reply")}</span></span></li>
            </ul>
            <BookButton className="btn btn-ghost mt-8" place="contact">{t("aside.book")}</BookButton>
            </aside>
          </div>
        </BundleShell>
      </div>
    </section>
  );
}
