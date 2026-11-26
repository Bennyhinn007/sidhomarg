"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/data/nav";
import { cn } from "@/lib/utils";
import { useActiveIndex } from "./use-active-nav";

/** Top navigation for tablets and desktops (1024px and wider). */
export function DesktopNav() {
  const t = useTranslations("Nav");
  const active = useActiveIndex();

  return (
    <nav aria-label={t("main")} className="hidden lg:block">
      <ul className="flex items-center gap-0.5 xl:gap-1">
        {navItems.map((item, i) => {
          const current = i === active;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-12 items-center rounded-full px-3 text-[0.95rem] font-semibold xl:px-4 transition-colors",
                  current
                    ? "bg-amber text-ink"
                    : "text-ink hover:bg-sage-tint"
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
