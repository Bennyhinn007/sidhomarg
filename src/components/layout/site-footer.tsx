import Image from "next/image";
import { ArrowRight, ArrowUp } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/data/nav";
import { site, type SocialNetwork } from "@/lib/site";
import { socialIcons, socialNames } from "@/components/icons/social-icons";
import { VisitCounter } from "./visit-counter";

const networks = Object.keys(site.social) as SocialNetwork[];

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tCommon = await getTranslations("Common");
  const locale = await getLocale();
  const year = new Date().getFullYear();
  const email = site.contact.email;
  const anySocial = networks.some((n) => site.social[n]);

  return (
    <footer className="mt-16 overflow-hidden bg-walnut pb-32 text-sand lg:pb-6">
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-base text-cream">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-amber" />
            {t("badge")}
          </span>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-base text-sand hover:text-amber-soft"
          >
            {t("toTop")}
            <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>

        <section aria-labelledby="footer-about" className="mt-10 max-w-3xl">
          <h2 id="footer-about" className="text-3xl font-light text-cream sm:text-5xl">
            {t("aboutTitle")}
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-sand">{t("aboutText")}</p>
        </section>

        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-base text-sand/90">{t("reach")}</p>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="group mt-1 inline-flex min-h-11 items-center gap-2 text-xl font-semibold break-all text-cream hover:text-amber-soft"
              >
                {email}
                <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
            ) : (
              <p className="mt-1 text-xl font-semibold text-cream">{tCommon("placeholder")}</p>
            )}
          </div>

          <nav aria-label={t("links")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-base font-semibold text-sand hover:text-amber-soft"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-6xl items-center justify-center gap-6 px-5 pt-6 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -bottom-20 h-72 w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(213_133_31/0.55),transparent)] blur-xl"
        />
        <Image
          src={site.logo.src}
          width={site.logo.width}
          height={site.logo.height}
          alt=""
          sizes="140px"
          className="relative hidden h-[70px] w-auto rounded-xl opacity-90 md:block"
        />
        <p
          aria-hidden="true"
          className="relative text-[clamp(3.2rem,15vw,9.5rem)] leading-none font-extrabold tracking-tighter text-cream/20 kn:tracking-normal"
          lang={locale}
        >
          {t("brand")}
        </p>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-cream/15 px-5 pt-5 sm:px-8">
        <div className="grid gap-1">
          <p className="text-[0.95rem] text-sand/90">{t("copyright", { year })}</p>
          <VisitCounter label={t("visits")} locale={locale} />
        </div>

        <div>
          <ul
            aria-label={anySocial ? t("social") : undefined}
            aria-hidden={anySocial ? undefined : true}
            className="flex gap-2.5"
          >
            {networks.map((network) => {
              const Icon = socialIcons[network];
              const url = site.social[network];
              return (
                <li key={network}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialNames[network]}
                      className="grid size-12 place-items-center rounded-full text-cream ring-[1.5px] ring-cream/35 transition hover:-translate-y-0.5 hover:bg-amber hover:text-ink hover:ring-0"
                    >
                      <Icon className="size-5" />
                    </a>
                  ) : (
                    <span
                      aria-hidden="true"
                      title={socialNames[network]}
                      className="grid size-12 place-items-center rounded-full text-cream/45 ring-[1.5px] ring-cream/20"
                    >
                      <Icon className="size-5" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          {!anySocial && <p className="mt-2 text-sm text-sand/90">{t("socialPending")}</p>}
        </div>
      </div>
    </footer>
  );
}
