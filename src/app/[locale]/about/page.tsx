import type { Metadata } from "next";
import { Check, Newspaper } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { founderEvents } from "@/data/photos";
import { Container, PageHead, Panel, Pill } from "@/components/sections/primitives";
import { AaaPillars } from "@/components/sections/aaa-pillars";
import { PhotoGrid } from "@/components/sections/photo-grid";
import { Members } from "@/components/sections/members";
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

      <Container className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
        <div>
          <p className="text-[1.1rem] leading-relaxed font-semibold text-walnut sm:text-[1.3rem]">{t("text")}</p>

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

      <Container className="py-8 sm:py-10">
        <section aria-labelledby="works-title">
          <Pill tone="amber">{t("worksPill")}</Pill>
          <h2 id="works-title" className="mt-3 text-[clamp(1.5rem,5.4vw,2.7rem)]">{t("worksTitle")}</h2>
          <p className="mt-2 mb-6 max-w-[36em] text-base sm:mb-8 sm:text-[1.05rem] text-ink/85">{t("worksIntro")}</p>
          <RecentWorks />
        </section>
      </Container>

      <Panel aria-labelledby="members-title" className="mt-2">
        <Container>
          <Pill>{t("membersPill")}</Pill>
          <h2 id="members-title" className="mt-3 text-[clamp(1.5rem,5.4vw,2.7rem)]">
            {t("membersTitle")}
          </h2>
          <p className="mt-2 mb-6 max-w-[36em] text-base sm:mb-8 sm:text-[1.05rem] text-ink/85">{t("membersIntro")}</p>
          <Members />
        </Container>
      </Panel>

      <Panel aria-labelledby="volunteers-title" className="mt-8">
        <Container>
          <Pill>{t("volunteersPill")}</Pill>
          <h2 id="volunteers-title" className="mt-3 text-[clamp(1.5rem,5.4vw,2.7rem)]">
            {t("volunteersTitle")}
          </h2>
          <p className="mt-2 mb-6 max-w-[36em] text-base sm:mb-8 sm:text-[1.05rem] text-ink/85">{t("volunteersIntro")}</p>
          <Volunteers />
        </Container>
      </Panel>

      <Panel aria-labelledby="corner-title" className="mt-8">
        <Container>
          <Pill>{t("cornerPill")}</Pill>
          <h2 id="corner-title" className="mt-3 max-w-[16em] text-[clamp(1.5rem,5.4vw,2.7rem)]">
            {t("cornerTitle")}
          </h2>
          <p className="mt-2 max-w-[36em] text-base sm:text-[1.05rem] text-ink/85">{t("cornerIntro")}</p>
          <Link
            href={{ pathname: "/events", hash: "articles" }}
            className="mt-4 mb-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-walnut px-6 text-[0.98rem] font-bold text-cream transition hover:-translate-y-0.5 hover:bg-walnut-dark sm:mb-8"
          >
            <Newspaper aria-hidden="true" className="size-5" />
            {t("cornerArticles")}
          </Link>
          <PhotoGrid photos={founderEvents} emptyText={t("cornerEmpty")} staggered />
        </Container>
      </Panel>
    </>
  );
}
