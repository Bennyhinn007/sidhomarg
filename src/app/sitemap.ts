import type { MetadataRoute } from "next";
import { routes } from "@/data/nav";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      changeFrequency: "monthly" as const,
      priority: href === "/" ? 1 : 0.7,
      alternates: { languages: languageAlternates(href) },
    }))
  );
}
