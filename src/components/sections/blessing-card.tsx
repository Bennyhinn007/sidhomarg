import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { Container } from "./primitives";

/** "With Divine Blessings" card shown on the home page above the founder section. */
export async function BlessingCard() {
  const t = await getTranslations("Home");
  const locale = (await getLocale()) as Locale;
  const { photo, name } = site.blessing;
  const shownName = name[locale];

  return (
    <Container className="pb-8 sm:pb-12">
      <section
        aria-labelledby="blessing-title"
        className="reveal relative mx-auto max-w-xl overflow-hidden rounded-[1.5rem] border border-line bg-paper px-6 py-8 text-center shadow-[var(--shadow-soft)] sm:rounded-[var(--radius-panel)] sm:px-10 sm:py-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(213_133_31/0.18),transparent)]"
        />
        <h2
          id="blessing-title"
          className="relative text-[clamp(1.35rem,5vw,2rem)] text-walnut"
        >
          {t("blessingTitle")}
        </h2>

        <div className="relative mx-auto mt-6 size-44 rounded-full bg-gradient-to-br from-amber-soft via-amber to-amber-deep p-1.5 shadow-[0_18px_40px_-18px_rgb(154_90_16/0.8)] sm:size-52">
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

        {shownName && <p className="relative mt-5 text-[1.15rem] font-bold text-ink sm:text-xl">{shownName}</p>}
      </section>
    </Container>
  );
}
