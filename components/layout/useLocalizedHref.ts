"use client";

import { useParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceFromSlug, serviceSlugs } from "@/lib/services";
import type { ComponentProps } from "react";
import type { Link } from "@/i18n/navigation";

type Href = ComponentProps<typeof Link>["href"];

/**
 * The same page in another locale. Dynamic routes need their params back (usePathname returns the template),
 * and service slugs are different per language.
 */
export function useLocalizedHref(current: Locale) {
  const pathname = usePathname();
  const params = useParams<{ slug?: string }>();
  return (target: Locale): Href => {
    if (pathname === "/servicii/[slug]" && params?.slug) {
      const key = serviceFromSlug(current, params.slug);
      return { pathname: "/servicii/[slug]", params: { slug: key ? serviceSlugs[key][target] : params.slug } };
    }
    if (pathname === "/blog/[slug]" && params?.slug) {
      return { pathname: "/blog/[slug]", params: { slug: params.slug } };
    }
    return pathname as Href;
  };
}
