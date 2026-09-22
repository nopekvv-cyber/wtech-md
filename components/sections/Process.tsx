import Image from "next/image";
import { useTranslations } from "next-intl";
import { BundleShell } from "@/components/ui/BundleShell";

/** The one place a numbered sequence is allowed: it is an actual sequence. */
export function Process() {
  const t = useTranslations("process");
  const steps = [1, 2, 3, 4] as const;
  return (
    <section id="proces" className="relative section overflow-hidden" aria-labelledby="process-title">
      <Image src="/media/bg-process.jpg" alt="" fill sizes="100vw" className="object-cover opacity-90 pointer-events-none" />
      <div className="container-x relative">
        <BundleShell accent="coral" className="p-7 md:p-12 lg:p-14">
          <p className="bundle-kicker">WTECH delivery bundle</p>
          <h2 id="process-title" className="text-[32px] md:text-[46px] max-w-[760px] mt-4">{t("title")}</h2>
          <ol className="process-bundle-steps mt-12 md:mt-16">
            {steps.map((n) => (
              <li key={n} className="process-bundle-step">
                <span className="text-dim text-[28px] md:text-[40px] leading-none tnum">0{n}</span>
                <div>
                  <h3 className="text-[22px] md:text-[28px]">{t(`s${n}`)}</h3>
                  <p className="text-dim mt-3 max-w-[520px]">{t(`s${n}d`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </BundleShell>
      </div>
    </section>
  );
}
