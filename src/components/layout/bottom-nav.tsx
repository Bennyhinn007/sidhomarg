"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/data/nav";
import { cn } from "@/lib/utils";
import { useActiveIndex } from "./use-active-nav";

/**
 * Mobile bottom bar (below 1024px). One amber highlight slides between tabs.
 * Tabs have equal width, so the highlight position is pure CSS: no measuring,
 * no resize listeners.
 */
export function BottomNav() {
  const t = useTranslations("Nav");
  const active = useActiveIndex();
  const count = navItems.length;

  return (
    <nav
      aria-label={t("main")}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="relative mx-auto max-w-md rounded-full bg-walnut p-1.5 shadow-[0_20px_40px_-12px_rgb(59_42_30/0.55)]">
        {active >= 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-amber shadow-[0_6px_16px_-4px_rgb(213_133_31/0.7)] transition-transform duration-[450ms] ease-[cubic-bezier(.65,0,.25,1)]"
            style={{
              width: `calc((100% - 0.75rem) / ${count})`,
              transform: `translateX(${active * 100}%)`,
            }}
          />
        )}
        <ul className="relative flex">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const current = i === active;
            return (
              <li key={item.key} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-full px-0.5 text-center text-[0.72rem] leading-tight font-semibold transition-colors",
                    current ? "text-ink" : "text-sand hover:text-cream"
                  )}
                >
                  <Icon aria-hidden="true" className="size-[1.35rem]" strokeWidth={1.9} />
                  {/* Long Kannada labels wrap onto two lines instead of being cut off */}
                  <span className="max-w-full truncate kn:overflow-visible kn:text-[0.68rem] kn:leading-[1.15] kn:whitespace-normal">
                    {t(item.key)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
