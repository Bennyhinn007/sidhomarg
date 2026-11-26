import type { Metadata } from "next";
import { Mail, Paperclip, Send } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { careerRoles } from "@/data/careers";
import { mailtoHref } from "@/lib/mailto";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Container, PageHead } from "@/components/sections/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "careers", "/careers");
}

const steps = ["how1", "how2", "how3"] as const;

export default async function CareersPage({ params }: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Careers");
  const email = site.recruitmentEmail;

  // Body template in the visitor's language; one empty line after each field to type into.
  const bodyFor = (role: string) => [
    t("emailGreeting"),
    "",
    t("emailIntro", { role }),
    "",
    t("emailName"),
    "",
    t("emailPhone"),
    "",
    t("emailEducation"),
    "",
    t("emailExperience"),
    "",
    t("emailPortfolio"),
    "",
    t("emailCv"),
    "",
    t("emailThanks"),
  ];

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />
      <Container className="pt-5">
        <p className="max-w-[40em] text-[1.08rem] text-ink/85">{t("intro")}</p>
      </Container>

      <Container className="py-10">
        <h2 id="roles-title" className="mb-5 text-2xl">{t("rolesTitle")}</h2>
        <ul aria-labelledby="roles-title" className="grid gap-4 md:grid-cols-3 md:gap-5">
          {careerRoles.map(({ key, subjectTitle, icon: Icon }) => {
            const title = t(`roles.${key}.title`);
            const titleId = `role-${key}`;
            return (
              <li key={key} className="flex">
                <article
                  aria-labelledby={titleId}
                  className="flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-7"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-walnut text-cream">
                    <Icon aria-hidden="true" className="size-7" strokeWidth={1.8} />
                  </span>
                  <h3 id={titleId} className="mt-5 text-[1.45rem] leading-snug">{title}</h3>
                  <p className="mt-2 flex-1 text-[1.03rem] text-ink/85">{t(`roles.${key}.description`)}</p>

                  {email ? (
                    <a
                      href={mailtoHref(
                        email,
                        `Application for ${subjectTitle} | Sidhomarg Foundation`,
                        bodyFor(title)
                      )}
                      aria-label={t("applyLabel", { role: title })}
                      className="mt-6 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-amber px-6 text-base font-bold text-ink shadow-[0_10px_24px_-10px_rgb(213_133_31/0.7)] transition hover:-translate-y-0.5 hover:bg-amber-soft"
                    >
                      <Send aria-hidden="true" className="size-5" />
                      {t("apply")}
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="mt-6 inline-flex min-h-13 items-center justify-center gap-2 rounded-full border-2 border-dashed border-field px-6 text-base font-bold text-muted"
                    >
                      <Mail aria-hidden="true" className="size-5" />
                      {t("unavailable")}
                    </span>
                  )}
                </article>
              </li>
            );
          })}
        </ul>

        {!email && (
          <p role="note" className="mt-5 rounded-2xl border border-line bg-sage-tint/70 p-4 text-[1rem] text-ink">
            {t("unavailableNote")}
          </p>
        )}
      </Container>

      <Container className="pb-6">
        <section
          aria-labelledby="how-title"
          className="grid gap-6 rounded-[var(--radius-card)] border border-line bg-sage-tint/60 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-start"
        >
          <div>
            <h2 id="how-title" className="text-2xl">{t("howTitle")}</h2>
            <ol className="mt-4 grid gap-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[1.03rem]">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber font-extrabold text-ink"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1">{t(s)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid gap-4">
            <p className="flex gap-3 rounded-2xl border-2 border-amber bg-amber/10 p-4 text-[1.02rem] font-semibold">
              <Paperclip aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-deep" />
              {t("attachReminder")}
            </p>
            {email && (
              <p className="text-[1rem] text-ink/85">
                {t.rich("orEmail", {
                  email,
                  link: (chunks) => (
                    <a
                      href={`mailto:${email}`}
                      className="font-semibold break-all underline decoration-amber decoration-2 underline-offset-4 hover:text-amber-deep"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
