import type { Metadata } from "next";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  FileText,
  MapPin,
  Newspaper,
  PenLine,
  Send,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { articles } from "@/data/articles";
import { events } from "@/data/events";
import { mailtoHref } from "@/lib/mailto";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Container, PageHead, PendingBox } from "@/components/sections/primitives";

// Re-render once a day so past events drop off "Upcoming" without a redeploy.
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<"/[locale]/events">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "events", "/events");
}

const guides = ["guide1", "guide2", "guide3", "guide4"] as const;

export default async function EventsPage({ params }: PageProps<"/[locale]/events">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Events");
  const email = site.contact.email;

  const intl = locale === "kn" ? "kn-IN" : "en-IN";
  const longDate = new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  const shortDate = new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  const asDate = (iso: string) => new Date(`${iso}T00:00:00+05:30`);
  const todayIst = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

  const upcoming = events.filter((e) => e.date >= todayIst).sort((a, b) => a.date.localeCompare(b.date));
  const published = [...articles].sort((a, b) => b.date.localeCompare(a.date));

  // Always in English so the Trust's inbox can be filtered; the body follows the page language.
  const submitHref = email
    ? mailtoHref(email, "Article submission | Sidhomarg Foundation", [
        t("emailGreeting"),
        "",
        t("emailIntro"),
        "",
        t("emailName"),
        "",
        t("emailPhone"),
        "",
        t("emailTitle"),
        "",
        t("emailLanguage"),
        "",
        t("emailArticle"),
        "",
        "",
        t("emailPhotos"),
        "",
        t("emailConsent"),
        "",
        t("emailThanks"),
      ])
    : null;

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />
      <Container className="pt-3 sm:pt-5">
        <p className="max-w-[40em] text-base text-ink/85 sm:text-[1.08rem]">{t("intro")}</p>
      </Container>

      {/* Upcoming events */}
      <Container className="py-8 sm:py-10">
        <section aria-labelledby="events-title">
          <h2 id="events-title" className="flex items-center gap-2.5 text-[clamp(1.4rem,5vw,2.2rem)]">
            <CalendarDays aria-hidden="true" className="size-6 shrink-0 text-amber-deep sm:size-7" />
            {t("eventsTitle")}
          </h2>
          <div className="mt-5">
            {upcoming.length === 0 ? (
              <PendingBox label={t("eventsEmpty")} className="min-h-32 gap-2">
                <CalendarDays aria-hidden="true" className="size-7 text-field" />
              </PendingBox>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2">
                {upcoming.map((e) => {
                  const d = asDate(e.date);
                  return (
                    <li key={`${e.date}-${e.title.en}`}>
                      <article className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-4 sm:p-5">
                        <div aria-hidden="true" className="grid w-16 shrink-0 place-items-center self-start rounded-2xl bg-walnut px-2 py-2.5 text-center text-cream">
                          <span className="text-2xl leading-none font-extrabold">
                            {new Intl.DateTimeFormat(intl, { day: "numeric", timeZone: "Asia/Kolkata" }).format(d)}
                          </span>
                          <span className="mt-1 text-[0.78rem] font-semibold">
                            {new Intl.DateTimeFormat(intl, { month: "short", timeZone: "Asia/Kolkata" }).format(d)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[1.15rem] leading-snug sm:text-[1.25rem]">{e.title[locale]}</h3>
                          <p className="mt-1.5 grid gap-1 text-[0.95rem] text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                              <time dateTime={e.date}>{longDate.format(d)}</time>
                            </span>
                            {e.time && (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock aria-hidden="true" className="size-4 shrink-0" />
                                {e.time[locale]}
                              </span>
                            )}
                            {e.place && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                                {e.place[locale]}
                              </span>
                            )}
                          </p>
                          {e.description && <p className="mt-2 text-base text-ink/85">{e.description[locale]}</p>}
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </Container>

      {/* Articles */}
      <section id="articles" aria-labelledby="articles-title" className="scroll-mt-20">
        <Container className="pb-8 sm:pb-10">
          <h2 id="articles-title" className="flex items-center gap-2.5 text-[clamp(1.4rem,5vw,2.2rem)]">
            <Newspaper aria-hidden="true" className="size-6 shrink-0 text-amber-deep sm:size-7" />
            {t("articlesTitle")}
          </h2>
          <div className="mt-5">
            {published.length === 0 ? (
              <PendingBox label={t("articlesEmpty")} className="min-h-32 gap-2">
                <Newspaper aria-hidden="true" className="size-7 text-field" />
              </PendingBox>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {published.map((a) => (
                  <li key={`${a.date}-${a.title.en}`} className="flex">
                    <article lang={a.language} className="flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper p-5">
                      <p className="text-[0.88rem] font-semibold text-muted">
                        <time dateTime={a.date}>{shortDate.format(asDate(a.date))}</time>
                      </p>
                      <h3 className="mt-2 text-[1.2rem] leading-snug">{a.title[locale]}</h3>
                      <p className="mt-1 text-[0.95rem] font-semibold text-sage-deep">{t("by", { author: a.author[locale] })}</p>
                      <p className="mt-2 flex-1 text-base text-ink/85">{a.summary[locale]}</p>
                      {a.href && (
                        <a
                          href={a.href}
                          {...(a.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="mt-4 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-walnut px-5 text-[0.95rem] font-bold text-cream hover:bg-walnut-dark"
                        >
                          <FileText aria-hidden="true" className="size-4" />
                          {t("readArticle")}
                        </a>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>

      {/* Submit an article */}
      <Container className="pb-4">
        <section
          id="submit"
          aria-labelledby="submit-title"
          className="scroll-mt-20 overflow-hidden rounded-[1.5rem] bg-walnut text-cream sm:rounded-[var(--radius-panel)]"
        >
          <div className="grid gap-6 p-6 sm:p-9 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-10">
            <div>
              <h2 id="submit-title" className="flex items-center gap-2.5 text-[clamp(1.4rem,5vw,2.2rem)] text-cream">
                <PenLine aria-hidden="true" className="size-6 shrink-0 text-amber-soft sm:size-7" />
                {t("submitTitle")}
              </h2>
              <p className="mt-3 text-base text-sand sm:text-[1.05rem]">{t("submitText")}</p>

              {submitHref && (
                <>
                  <a
                    href={submitHref}
                    aria-label={t("submitLabel")}
                    className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-amber px-7 text-[1.05rem] font-extrabold text-ink shadow-[0_12px_26px_-10px_rgb(213_133_31/0.8)] transition hover:-translate-y-0.5 hover:bg-amber-soft sm:w-auto"
                  >
                    <Send aria-hidden="true" className="size-5" />
                    {t("submitButton")}
                  </a>
                  <p className="mt-4 text-[0.95rem] text-sand/90">
                    {t.rich("orEmail", {
                      email: email ?? "",
                      link: (chunks) => (
                        <a href={`mailto:${email}`} className="font-semibold break-all text-cream underline decoration-amber decoration-2 underline-offset-4">
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
                </>
              )}
            </div>

            <div className="rounded-2xl bg-cream/10 p-5 ring-1 ring-cream/15">
              <h3 className="text-[1.1rem] text-cream">{t("guidelinesTitle")}</h3>
              <ul className="mt-3 grid gap-2.5">
                {guides.map((g) => (
                  <li key={g} className="flex gap-2.5 text-[0.98rem] text-sand">
                    <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-soft" />
                    {t(g)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
