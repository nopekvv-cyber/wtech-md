import Image from "next/image";
import { useTranslations } from "next-intl";
import { BundleShell } from "@/components/ui/BundleShell";

/** Up to three true numbers from the CMS. A number that is not set is not shown; nothing is invented. */
export function Proof() {
  const t = useTranslations("proof");
  const items = [
    { n: t("n1"), l: t("l1") },
    { n: t("n2"), l: t("l2") },
    { n: t("n3"), l: t("l3") },
  ].filter((it) => it.n.trim() !== "");
  if (items.length === 0) return null;
  return (
    <section className="relative section overflow-hidden" aria-label={t("sentence")}>
      <Image src="/media/bg-proof.jpg" alt="" fill sizes="100vw" className="object-cover opacity-90 pointer-events-none" />
      <div className="container-x relative">
        <BundleShell accent="cyan" className="p-7 md:p-12 lg:p-14">
          <p className="bundle-kicker">WTECH proof</p>
          <dl className={`grid gap-10 md:gap-6 mt-10 ${items.length === 1 ? "" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {items.map((it, i) => (
              <div key={i} className={`${i > 0 ? "md:border-l md:border-line md:pl-6" : ""}`}>
                <dd className="text-[56px] md:text-[72px] leading-none font-medium tracking-[-0.03em] tnum">{it.n}</dd>
                <dt className="text-dim mt-3 max-w-[280px]">{it.l}</dt>
              </div>
            ))}
          </dl>
          <p className="text-dim mt-12 max-w-[520px]">{t("sentence")}</p>
        </BundleShell>
      </div>
    </section>
  );
}
