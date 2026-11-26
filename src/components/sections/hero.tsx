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
      className="relative mx-3 mt-3 grid gap-10 overflow-hidden rounded-[var(--radius-panel)] bg-walnut px-5 pt-10 pb-12 text-cream sm:mx-5 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-14 lg:py-16"
    >
      <div>
        <Pill tone="light">{t("pill")}</Pill>
        <h1 id="hero-title" className="mt-5 text-[clamp(2.2rem,8vw,4rem)] text-cream kn:text-[clamp(2rem,7vw,3.3rem)]">
          {t.rich("title", {
            hl: (chunks) => <span className="text-amber-soft">{chunks}</span>,
          })}
        </h1>
        <p className="mt-5 max-w-[32em] text-[1.08rem] text-sand">{t("intro")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/volunteer"
            className="inline-flex min-h-13 items-center rounded-full bg-amber px-7 text-base font-bold text-ink shadow-[0_10px_24px_-8px_rgb(213_133_31/0.6)] transition hover:-translate-y-0.5 hover:bg-amber-soft"
          >
            {t("ctaVolunteer")}
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-13 items-center rounded-full px-7 text-base font-bold text-cream ring-2 ring-cream/50 transition hover:bg-cream/10"
          >
            {t("ctaStory")}
          </Link>
        </div>
      </div>

      {/* Big logo that "pops out" of the panel */}
      <div className="relative grid place-items-center py-4">
        <div aria-hidden="true" className="absolute -top-6 -right-10 size-52 rounded-full bg-sage/60 blur-[2px]" />
        <div aria-hidden="true" className="absolute -bottom-5 -left-3 size-32 rounded-full bg-amber/80 blur-[2px]" />
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
