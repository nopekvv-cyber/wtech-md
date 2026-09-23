import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { blogSlugs, blogMeta } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ href: "/blog", locale: locale as Locale, title: t("blog.title"), description: t("blog.description"), index: false });
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x">
        <h1 className="text-[36px] md:text-[52px]">{t("title")}</h1>
        <p className="text-dim mt-4 text-lg max-w-[620px]">{t("sub")}</p>
        <ul className="mt-14 border-t border-line divide-y divide-white/10">
          {blogSlugs.map((slug) => {
            const m = blogMeta[slug];
            return (
              <li key={slug} className="py-8">
                <Link href={{ pathname: "/blog/[slug]", params: { slug } }} className="group block max-w-[760px]">
                  <div className="text-dim text-[13px]">{m.date} · {t("readTime", { minutes: m.minutes })}</div>
                  <h2 className="text-[24px] md:text-[30px] mt-2 group-hover:underline underline-offset-4">{t(`${m.key}t`)}</h2>
                  <p className="text-dim mt-2">{t(`${m.key}e`)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
