"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { Link as LocalizedLink, getPathname } from "@/i18n/navigation";
import { internationalPublicPath } from "@/lib/market";
import { useInternationalMarket } from "./MarketContext";

type Props = ComponentProps<typeof LocalizedLink>;

/** Keeps Moldova's localized routes while emitting direct, unprefixed English URLs on wtech.to. */
export function MarketLink({ href, locale, ...props }: Props) {
  const international = useInternationalMarket();

  if (!international) return <LocalizedLink href={href} locale={locale} {...props} />;

  const localized = getPathname({ href: href as Parameters<typeof getPathname>[0]["href"], locale: "en" });
  return <NextLink href={internationalPublicPath(localized)} {...props} />;
}

export { MarketLink as Link };
