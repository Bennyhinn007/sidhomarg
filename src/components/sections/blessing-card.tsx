import Image from "next/image";
import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { Container } from "./primitives";

/**
 * "With the divine blessings of" card on the home page, above the founder section.
 * Text lives in messages/*.json (Home.blessing*); the photo is set in src/lib/site.ts.
 */
export async function BlessingCard() {
  const t = await getTranslations("Home");
  const { photo } = site.blessing;

  return (
    <Container className="pb-8 sm:pb-12">
      <section
        aria-labelledby="blessing-name"
        className="reveal relative mx-auto max-w-4xl overflow-hidden rounded-[1.5rem] border border-line bg-paper px-5 py-8 text-center shadow-[var(--shadow-soft)] sm:rounded-[var(--radius-panel)] sm:px-10 sm:py-10 md:grid md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:text-left"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(213_133_31/0.18),transparent)] md:inset-x-auto md:inset-y-0 md:left-0 md:h-auto md:w-80 md:bg-[radial-gradient(100%_60%_at_0%_50%,rgb(213_133_31/0.18),transparent)]"
        />

        <div className="relative mx-auto size-44 shrink-0 rounded-full bg-gradient-to-br from-amber-soft via-amber to-amber-deep p-1.5 shadow-[0_18px_40px_-18px_rgb(154_90_16/0.8)] sm:size-52 md:mx-0">
          <div className="relative size-full overflow-hidden rounded-full bg-cream ring-4 ring-paper">
            <Image
              src={photo.src}
              alt={t("blessingAlt")}
              fill
              sizes="(min-width: 640px) 13rem, 11rem"
              // Keep the face in the circle: the portrait is tall with the face in the upper third.
              className="object-cover object-[50%_24%]"
            />
          </div>
        </div>

        <div className="relative mt-6 md:mt-0">
          <p className="text-[0.95rem] font-semibold text-amber-deep italic sm:text-base">{t("blessingTitle")}</p>
          <h2 id="blessing-name" className="mt-1.5 text-[clamp(1.3rem,4.8vw,1.9rem)] leading-snug text-walnut">
            {t("blessingName")}
          </h2>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-muted">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {t("blessingPlace")}
          </p>
          <p className="mx-auto mt-4 max-w-[38em] border-t border-line pt-4 text-base leading-relaxed text-ink/85 sm:text-[1.05rem] md:mx-0">
            {t("blessingText")}
          </p>
        </div>
      </section>
    </Container>
  );
}
