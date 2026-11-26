import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { DesktopNav } from "./desktop-nav";
import { LanguageSwitcher } from "./language-switcher";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-1.5 sm:gap-4 sm:py-2.5 sm:px-6">
        <Link
          href="/"
          aria-label={t("homeLink")}
          className="flex min-h-12 shrink-0 items-center rounded-md"
        >
          <span className="logo-crop">
            <Image
              src={site.logo.src}
              width={site.logo.width}
              height={site.logo.height}
              alt=""
              sizes="180px"
              loading="eager"
            />
          </span>
        </Link>

        <DesktopNav />

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/volunteer"
            className="hidden min-h-12 items-center rounded-full bg-walnut px-5 text-[0.95rem] font-bold text-cream transition-colors hover:bg-walnut-dark xl:inline-flex"
          >
            {t("volunteerCta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
