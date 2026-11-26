import Image from "next/image";
import { Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { members } from "@/data/members";
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

/** Trust members. Reads src/data/members.ts; shows an honest placeholder while it is empty. */
export async function Members() {
  const t = await getTranslations("Home");
  const locale = (await getLocale()) as Locale;

  return (
    <section aria-labelledby="members-title" className="mt-12">
      <h3 id="members-title" className="text-[1.45rem] text-walnut">{t("membersTitle")}</h3>

      {members.length === 0 ? (
        <PendingBox label={t("membersEmpty")} className="mt-4 min-h-36 gap-2">
          <Users aria-hidden="true" className="size-7 text-field" />
        </PendingBox>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((m, i) => (
            <li key={m.name.en}>
              <figure>
                <div className={`relative grid aspect-[3/4] place-items-center overflow-hidden rounded-[1.25rem] ${tints[i % tints.length]}`}>
                  {m.photo ? (
                    <Image
                      src={m.photo.src}
                      width={m.photo.width}
                      height={m.photo.height}
                      alt={m.photo.alt[locale]}
                      sizes="(min-width: 1024px) 18rem, 45vw"
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" className="text-4xl font-extrabold text-cream/90">
                      {initials(m.name.en)}
                    </span>
                  )}
                </div>
                <figcaption className="mt-2.5 leading-snug">
                  <strong className="block text-base">{m.name[locale]}</strong>
                  <span className="text-[0.92rem] text-muted">{m.role[locale]}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
