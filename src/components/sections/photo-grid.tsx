import Image from "next/image";
import { Camera } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { PLACEHOLDER_SLOTS, type CaptionedPhoto } from "@/data/photos";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Each tint is paired with a text colour that keeps at least 4.5:1 contrast.
const placeholderTints = [
  "bg-walnut text-cream",
  "bg-sage/45 text-ink",
  "bg-amber/45 text-ink",
  "bg-ink text-cream",
  "bg-sage-tint text-ink ring-1 ring-line",
  "bg-sand text-ink",
];

/**
 * Responsive photo grid used by the Gallery page and Founders Corner.
 * With no photos configured it shows clearly labelled placeholder tiles.
 */
export async function PhotoGrid({
  photos,
  emptyText,
  staggered = false,
}: {
  photos: CaptionedPhoto[];
  emptyText: string;
  staggered?: boolean;
}) {
  const locale = (await getLocale()) as Locale;
  const tCommon = await getTranslations("Common");
  const stagger = staggered ? "md:[&>li:nth-child(3n+2)]:mt-8 md:[&>li:nth-child(3n)]:mt-16" : "";

  if (photos.length === 0) {
    return (
      <div>
        <p className="mb-5 flex items-center gap-2 text-[1.02rem] text-muted">
          <Camera aria-hidden="true" className="size-5 shrink-0" />
          {emptyText}
        </p>
        <ul aria-hidden="true" className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4", stagger)}>
          {Array.from({ length: PLACEHOLDER_SLOTS }, (_, i) => (
            <li key={i}>
              <div
                className={cn(
                  "grid place-items-center rounded-[1.25rem] p-3 text-center text-[0.9rem] font-semibold",
                  i % 3 === 0 ? "aspect-square" : "aspect-[4/5]",
                  placeholderTints[i % placeholderTints.length]
                )}
              >
                {tCommon("photoComing")}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4", stagger)}>
      {photos.map((p) => (
        <li key={p.src}>
          <figure className="group">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-walnut">
              <Image
                src={p.src}
                width={p.width}
                height={p.height}
                alt={p.alt[locale]}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-2 text-[0.95rem] font-semibold">{p.caption[locale]}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
