import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { founderEvents } from "@/data/photos";
import { Container, PageHead, Panel, Pill } from "@/components/sections/primitives";
import { AaaPillars } from "@/components/sections/aaa-pillars";
import { PhotoGrid } from "@/components/sections/photo-grid";
import { RecentWorks } from "@/components/sections/recent-works";
import { Volunteers } from "@/components/sections/volunteers";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "about", "/about");
}

const programmes = [
  "programSchoolFeeding",
  "programLiteracy",
  "programHealth",
  "programVocational",
] as const;

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("About");
  const tHome = await getTranslations("Home");

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />

      <Container className="grid gap-10 py-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-[1.3rem] leading-relaxed font-semibold text-walnut">{t("text")}</p>

          <section aria-labelledby="motto-title" className="mt-8 border-l-4 border-amber pl-4">
            <h2 id="motto-title" className="text-xl">{t("mottoTitle")}</h2>
            <p className="mt-1 text-[1.05rem] text-ink/85">{t("mottoText")}</p>
          </section>

          <AaaPillars className="mt-8 max-w-md" label={tHome("aaaLabel")} />
        </div>

        <section
          aria-labelledby="programmes-title"
          className="self-start rounded-[var(--radius-card)] border border-line bg-paper p-6"
        >
          <h2 id="programmes-title" className="text-2xl">{t("programsTitle")}</h2>
          <ul className="mt-4 grid gap-3">
            {programmes.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[1.05rem]">
                <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-sage-deep" />
                {t(p)}
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <Container className="py-10">
        <section aria-labelledby="works-title">
          <Pill tone="amber">{t("worksPill")}</Pill>
          <h2 id="works-title" className="mt-3 text-[clamp(1.9rem,5.5vw,2.7rem)]">{t("worksTitle")}</h2>
          <p className="mt-3 mb-8 max-w-[36em] text-[1.05rem] text-ink/85">{t("worksIntro")}</p>
          <RecentWorks />
        </section>
      </Container>

      <Panel aria-labelledby="volunteers-title" className="mt-2">
        <Container>
          <Pill>{t("volunteersPill")}</Pill>
          <h2 id="volunteers-title" className="mt-3 text-[clamp(1.9rem,5.5vw,2.7rem)]">
            {t("volunteersTitle")}
          </h2>
          <p className="mt-3 mb-8 max-w-[36em] text-[1.05rem] text-ink/85">{t("volunteersIntro")}</p>
          <Volunteers />
        </Container>
      </Panel>

      <Panel aria-labelledby="corner-title" className="mt-8">
        <Container>
          <Pill>{t("cornerPill")}</Pill>
          <h2 id="corner-title" className="mt-3 max-w-[16em] text-[clamp(1.9rem,5.5vw,2.7rem)]">
            {t("cornerTitle")}
          </h2>
          <p className="mt-3 mb-8 max-w-[36em] text-[1.05rem] text-ink/85">{t("cornerIntro")}</p>
          <PhotoGrid photos={founderEvents} emptyText={t("cornerEmpty")} staggered />
        </Container>
      </Panel>
    </>
  );
}
