import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHead } from "@/components/sections/primitives";
import { DonateWidget } from "@/components/donate/donate-widget";
import { AaaPillars } from "@/components/sections/aaa-pillars";

export async function generateMetadata({ params }: PageProps<"/[locale]/donate">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "donate", "/donate");
}

export default async function DonatePage({ params }: PageProps<"/[locale]/donate">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Donate");
  const tHome = await getTranslations("Home");

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />
      <Container className="pt-3 sm:pt-5">
        <p className="max-w-[40em] text-base text-ink/85 sm:text-[1.08rem]">{t("intro")}</p>
        <AaaPillars className="mt-5 max-w-md" label={tHome("aaaLabel")} />
      </Container>

      <Container className="py-8 sm:py-10">
        <DonateWidget />
      </Container>

      <Container className="pb-4">
        <section
          aria-labelledby="donate-how"
          className="rounded-[var(--radius-card)] border border-line bg-paper p-5 sm:p-7"
        >
          <h2 id="donate-how" className="text-[1.25rem] sm:text-2xl">{t("howTitle")}</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            {(["how1", "how2", "how3"] as const).map((k, i) => (
              <li key={k} className="flex gap-3 text-base">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber font-extrabold text-ink"
                >
                  {i + 1}
                </span>
                <span className="pt-1">{t(k)}</span>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}
