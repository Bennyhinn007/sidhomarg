import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { NavItem } from "@/data/nav";
import { site, siteUrl } from "./site";

type Href = NavItem["href"];
export type PageKey = NavItem["key"];

const ogLocale: Record<Locale, string> = { en: "en_IN", kn: "kn_IN" };

/** Absolute URL of a page in a given language, e.g. https://site/kn/about */
export function absoluteUrl(href: Href, locale: Locale) {
  const path = getPathname({ href, locale });
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

/** hreflang map for one page: en, kn and x-default (English). */
export function languageAlternates(href: Href) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(href, locale);
  languages["x-default"] = absoluteUrl(href, routing.defaultLocale);
  return languages;
}

export async function pageMetadata(
  locale: Locale,
  page: PageKey,
  href: Href
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Meta" });
  const siteName = t("siteName");
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const url = absoluteUrl(href, locale);

  return {
    // The home title already contains the site name, so it skips the template.
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(href) },
    openGraph: {
      type: "website",
      url,
      siteName,
      title: page === "home" ? title : `${title} | ${siteName}`,
      description,
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [
        {
          url: site.logo.src,
          width: site.logo.width,
          height: site.logo.height,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page === "home" ? title : `${title} | ${siteName}`,
      description,
      images: [site.logo.src],
    },
  };
}
