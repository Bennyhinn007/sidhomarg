import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { VisionMission } from "@/components/sections/vision-mission";
import { FounderProfile } from "@/components/sections/founder-profile";
import { Container, Panel, Pill } from "@/components/sections/primitives";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { DonateBand } from "@/components/sections/donate-band";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "home", "/");
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Home");

  return (
    <>
      <OrganizationJsonLd locale={locale as Locale} />
      <Hero />
      <VisionMission />

      <Panel aria-labelledby="founders-title">
        <Container>
          <Pill>{t("leadership")}</Pill>
          <h2 id="founders-title" className="mt-3 mb-8 text-[clamp(1.5rem,5.4vw,2.7rem)]">
            {t("founderTitle")}
          </h2>
          <FounderProfile />
        </Container>
      </Panel>

      <DonateBand />
    </>
  );
}
