import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { blogSlugs, blogMeta, type BlogSlug } from "@/lib/blog";
import { getPost } from "@/content/blog";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/Schema";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!blogSlugs.includes(slug as BlogSlug)) return {};
  const t = await getTranslations({ locale, namespace: "blog" });
  const m = blogMeta[slug as BlogSlug];
  return { title: t(`${m.key}t`), description: t(`${m.key}e`), alternates: await alternatesFor({ pathname: "/blog/[slug]", params: { slug } }, locale as Locale) };
}

export default async function Post({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!blogSlugs.includes(slug as BlogSlug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const m = blogMeta[slug as BlogSlug];
  const post = getPost(locale as Locale, slug as BlogSlug);
  const url = SITE_URL + getPathname({ href: { pathname: "/blog/[slug]", params: { slug } }, locale: locale as Locale });
  return (
    <article className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x max-w-[820px]">
        <Link href="/blog" className="text-dim text-[14px] hover:text-ink">← {t("back")}</Link>
        <div className="text-dim text-[13px] mt-8">{m.date} · {t("readTime", { minutes: m.minutes })} · <span className="text-coral">{t("review")}</span></div>
        <h1 className="text-[34px] md:text-[48px] mt-3">{t(`${m.key}t`)}</h1>
        <p className="text-dim text-lg mt-4">{t(`${m.key}e`)}</p>
        <div className="mt-10 space-y-6 text-[17px] leading-relaxed [&_h2]:text-[26px] [&_h2]:mt-10 [&_h2]:font-medium [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2">
          {post.map((block, i) =>
            block.h ? <h2 key={i}>{block.h}</h2> : block.ul ? <ul key={i}>{block.ul.map((li, j) => <li key={j}>{li}</li>)}</ul> : <p key={i}>{block.p}</p>,
          )}
        </div>
      </div>
      <ArticleSchema title={t(`${m.key}t`)} description={t(`${m.key}e`)} url={url} date={m.date} locale={locale as Locale} />
      <BreadcrumbSchema items={[{ name: "wtech.md", url: SITE_URL + getPathname({ href: "/", locale: locale as Locale }) }, { name: t("title"), url: SITE_URL + getPathname({ href: "/blog", locale: locale as Locale }) }, { name: t(`${m.key}t`), url }]} />
    </article>
  );
}
