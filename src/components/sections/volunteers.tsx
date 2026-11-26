import Image from "next/image";
import { HandHeart, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { volunteers } from "@/data/volunteers";
import type { Locale } from "@/i18n/routing";
import { PendingBox } from "./primitives";

const tints = ["bg-walnut", "bg-sage-deep", "bg-amber-deep", "bg-ink"];

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/** Volunteers of the Trust. Reads src/data/volunteers.ts and always offers a way to join. */
export async function Volunteers() {
  const t = await getTranslations("About");
  const locale = (await getLocale()) as Locale;

  return (
    <div>
      {volunteers.length === 0 ? (
        <PendingBox label={t("volunteersEmpty")} className="min-h-36 gap-2">
          <HandHeart aria-hidden="true" className="size-7 text-field" />
        </PendingBox>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {volunteers.map((v, i) => (
            <li key={v.name.en}>
              <figure>
                <div
                  className={`relative grid aspect-[3/4] place-items-center overflow-hidden rounded-[1.25rem] ${tints[i % tints.length]}`}
                >
                  {v.photo ? (
                    <Image
                      src={v.photo.src}
                      width={v.photo.width}
                      height={v.photo.height}
                      alt={v.photo.alt[locale]}
                      sizes="(min-width: 1024px) 16rem, (min-width: 640px) 30vw, 45vw"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" className="text-4xl font-extrabold text-cream/90">
                      {initials(v.name.en)}
                    </span>
                  )}
                </div>
                <figcaption className="mt-2.5 leading-snug">
                  <strong className="block text-base">{v.name[locale]}</strong>
                  <span className="text-[0.92rem] text-muted">{v.area[locale]}</span>
                  {v.place && (
                    <span className="mt-0.5 flex items-center gap-1 text-[0.88rem] text-muted">
                      <MapPin aria-hidden="true" className="size-3.5" />
                      {v.place[locale]}
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[1.03rem] font-semibold text-walnut">{t("volunteersCtaText")}</p>
        <Link
          href="/volunteer"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-amber px-6 font-bold text-ink transition hover:-translate-y-0.5 hover:bg-amber-soft"
        >
          {t("volunteersCta")}
        </Link>
      </div>
    </div>
  );
}
