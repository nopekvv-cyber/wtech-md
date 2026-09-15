import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="relative min-h-[100dvh] grid place-items-center overflow-hidden">
      <Image src="/media/not-found.jpg" alt="" fill sizes="100vw" className="object-cover opacity-70" priority />
      <div className="container-x relative">
        <div className="max-w-[540px]">
          <h1 className="text-[40px] md:text-[56px]">{t("title")}</h1>
          <p className="text-dim mt-4 text-lg">{t("sub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">{t("home")}</Link>
            <Link href="/contact" className="btn btn-ghost">{t("contact")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
