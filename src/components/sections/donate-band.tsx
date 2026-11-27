import { HeartHandshake } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "./primitives";

/** Short call-to-action on the home page that leads to /donate. */
export async function DonateBand() {
  const t = await getTranslations("Donate");

  return (
    <Container className="py-8 sm:py-12">
      <section
        aria-labelledby="donate-band-title"
        className="relative overflow-hidden rounded-[1.5rem] bg-walnut p-6 text-cream sm:rounded-[var(--radius-panel)] sm:p-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-16 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(213_133_31/0.55),transparent)]"
        />
        <div className="relative grid gap-5 md:grid-cols-[1.4fr_auto] md:items-center">
          <div>
            <h2 id="donate-band-title" className="text-[clamp(1.5rem,5.4vw,2.4rem)] text-cream">
              {t("bandTitle")}
            </h2>
            <p className="mt-2 max-w-[34em] text-base text-sand sm:text-[1.05rem]">{t("bandText")}</p>
          </div>
          <Link
            href="/donate"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-amber px-7 text-[1.05rem] font-extrabold text-ink shadow-[0_12px_26px_-10px_rgb(213_133_31/0.8)] transition hover:-translate-y-0.5 hover:bg-amber-soft"
          >
            <HeartHandshake aria-hidden="true" className="size-5" />
            {t("donateNow")}
          </Link>
        </div>
      </section>
    </Container>
  );
}
