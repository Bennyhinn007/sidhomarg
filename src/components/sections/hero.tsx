import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { Pill } from "./primitives";

export async function Hero() {
  const t = await getTranslations("Home");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-2 mt-2 grid gap-7 overflow-hidden rounded-[1.5rem] bg-walnut px-5 pt-7 pb-9 text-cream sm:mx-5 sm:mt-3 sm:gap-10 sm:rounded-[var(--radius-panel)] sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-14 lg:py-16"
    >
      <div>
        <Pill tone="light">{t("pill")}</Pill>
        <h1 id="hero-title" className="mt-4 text-[clamp(1.85rem,7.4vw,4rem)] text-cream kn:text-[clamp(1.55rem,6.4vw,3.3rem)] sm:mt-5">
          {t.rich("title", {
            hl: (chunks) => <span className="text-amber-soft">{chunks}</span>,
          })}
        </h1>
        <p className="mt-4 max-w-[32em] text-base text-sand sm:mt-5 sm:text-[1.08rem]">{t("intro")}</p>
        <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
          <Link
            href="/volunteer"
            className="inline-flex min-h-12 items-center rounded-full bg-amber px-5 text-[0.95rem] font-bold sm:min-h-13 sm:px-7 sm:text-base text-ink shadow-[0_10px_24px_-8px_rgb(213_133_31/0.6)] transition hover:-translate-y-0.5 hover:bg-amber-soft"
          >
            {t("ctaVolunteer")}
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-12 items-center rounded-full px-5 text-[0.95rem] font-bold text-cream sm:min-h-13 sm:px-7 sm:text-base ring-2 ring-cream/50 transition hover:bg-cream/10"
          >
            {t("ctaStory")}
          </Link>
        </div>
      </div>

      {/* Big logo that "pops out" of the panel */}
      <div className="relative grid place-items-center py-1 sm:py-4">
        <div aria-hidden="true" className="absolute -top-6 -right-10 size-36 rounded-full sm:size-52 bg-sage/60 blur-[2px]" />
        <div aria-hidden="true" className="absolute -bottom-5 -left-3 size-24 rounded-full sm:size-32 bg-amber/80 blur-[2px]" />
        <div className="logo-card relative w-full max-w-[34rem] animate-float rounded-[1.6rem] bg-white p-1.5 shadow-[var(--shadow-logo)]">
          <Image
            src={site.logo.src}
            width={site.logo.width}
            height={site.logo.height}
            alt={t("logoAlt")}
            sizes="(min-width: 1024px) 34rem, 90vw"
            preload
            className="h-auto w-full rounded-[1.25rem]"
          />
        </div>
      </div>
    </section>
  );
}
