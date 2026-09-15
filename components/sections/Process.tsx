import Image from "next/image";
import { useTranslations } from "next-intl";

/** The one place a numbered sequence is allowed: it is an actual sequence. */
export function Process() {
  const t = useTranslations("process");
  const steps = [1, 2, 3, 4] as const;
  return (
    <section id="proces" className="relative section overflow-hidden" aria-labelledby="process-title">
      <Image src="/media/bg-process.jpg" alt="" fill sizes="100vw" className="object-cover opacity-90 pointer-events-none" />
      <div className="container-x relative">
        <h2 id="process-title" className="text-[32px] md:text-[44px] max-w-[760px]">{t("title")}</h2>
        <ol className="mt-14 md:mt-20 border-t border-line divide-y divide-white/10 max-w-[900px]">
          {steps.map((n) => (
            <li key={n} className="grid grid-cols-[56px_1fr] md:grid-cols-[96px_1fr] gap-4 py-8 md:py-10">
              <span className="text-dim text-[28px] md:text-[40px] leading-none tnum">{n}</span>
              <div>
                <h3 className="text-[22px] md:text-[28px]">{t(`s${n}`)}</h3>
                <p className="text-dim mt-2 max-w-[520px]">{t(`s${n}d`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
