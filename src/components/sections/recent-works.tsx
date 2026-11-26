import Image from "next/image";
import { BookOpen, CalendarDays, ClipboardList, HeartPulse, MapPin, Utensils } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { RECENT_WORKS_LIMIT, works, type Pillar } from "@/data/works";
import type { Locale } from "@/i18n/routing";
import { PendingBox } from "./primitives";

const pillarIcon = { anna: Utensils, akshara: BookOpen, arogya: HeartPulse } as const;
const pillarTone: Record<Pillar, string> = {
  anna: "bg-amber/15 text-amber-deep",
  akshara: "bg-sage-tint text-sage-deep",
  arogya: "bg-walnut text-cream",
};

/** Latest activities of the Trust. Reads src/data/works.ts. */
export async function RecentWorks() {
  const t = await getTranslations("About");
  const tAaa = await getTranslations("AAA");
  const locale = (await getLocale()) as Locale;

  const items = [...works].sort((a, b) => b.date.localeCompare(a.date)).slice(0, RECENT_WORKS_LIMIT);

  if (items.length === 0) {
    return (
      <PendingBox label={t("worksEmpty")} className="min-h-40 gap-2">
        <ClipboardList aria-hidden="true" className="size-7 text-field" />
      </PendingBox>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(locale === "kn" ? "kn-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((w) => {
        const Icon = pillarIcon[w.pillar];
        return (
          <li key={`${w.date}-${w.title.en}`} className="flex">
            <article className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
              {w.photo && (
                <Image
                  src={w.photo.src}
                  width={w.photo.width}
                  height={w.photo.height}
                  alt={w.photo.alt[locale]}
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                  className="aspect-[3/2] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[0.85rem] font-bold ${pillarTone[w.pillar]}`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {tAaa(w.pillar)}
                </span>
                <h3 className="mt-3 text-[1.25rem] leading-snug">{w.title[locale]}</h3>
                <p className="mt-2 flex-1 text-[1rem] text-ink/85">{w.summary[locale]}</p>
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.92rem] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    <time dateTime={w.date}>{dateFormat.format(new Date(`${w.date}T00:00:00`))}</time>
                  </span>
                  {w.place && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-4" />
                      {w.place[locale]}
                    </span>
                  )}
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
