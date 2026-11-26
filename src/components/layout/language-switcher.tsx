"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<Locale, "english" | "kannada"> = { en: "english", kn: "kannada" };

/**
 * English / Kannada switch. Plain links to the same page in the other language,
 * so it works without JavaScript. next-intl stores the choice in the
 * NEXT_LOCALE cookie, and the proxy uses it on the next visit.
 */
export function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")}>
      <ul className="flex rounded-full bg-sage-tint p-1 ring-1 ring-line">
        {routing.locales.map((l) => {
          const current = l === locale;
          return (
            <li key={l}>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                lang={l}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-10 min-w-11 items-center justify-center rounded-full px-2.5 text-[0.85rem] font-bold transition-colors sm:min-h-11 sm:px-3.5 sm:text-[0.9rem]",
                  current ? "bg-walnut text-cream" : "text-ink hover:bg-paper"
                )}
              >
                {t(labels[l])}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
