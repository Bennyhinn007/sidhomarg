import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { AaaPillars } from "./aaa-pillars";

const roles = ["writer", "activist", "socialWorker", "educationalist"] as const;

/** Profile card for the founder, Sidrameshwar S. Wale. */
export async function FounderProfile({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const t = await getTranslations("Founder");
  const tCommon = await getTranslations("Common");
  const tHome = await getTranslations("Home");
  const Heading = headingLevel;
  const photo = site.founder.photo;

  return (
    <article
      aria-labelledby="founder-name"
      className="reveal grid gap-5 rounded-[1.5rem] border border-line bg-paper p-3 sm:gap-7 sm:rounded-[1.75rem] sm:p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-10"
    >
      <div className="relative mx-auto grid aspect-[4/5] w-full max-w-[15rem] place-items-center overflow-hidden rounded-[1.25rem] bg-walnut sm:max-w-xs md:max-w-none">
        {photo ? (
          <Image
            src={photo}
            alt={t("photoAlt")}
            fill
            sizes="(min-width: 768px) 40vw, 92vw"
            className="object-cover"
          />
        ) : (
          <>
            <span aria-hidden="true" className="text-5xl font-extrabold text-cream/85 sm:text-7xl">SW</span>
            <span className="absolute inset-x-0 bottom-0 bg-ink/55 px-3 py-2 text-center text-[0.9rem] text-cream">
              {tCommon("photoComing")}
            </span>
          </>
        )}
      </div>

      <div className="px-1 pb-2">
        <span className="tracking-label inline-block rounded-full bg-amber px-3.5 py-1.5 text-[0.8rem] font-bold text-ink">
          {t("role")}
        </span>
        <Heading id="founder-name" className="mt-3 text-[clamp(1.45rem,5.4vw,2.6rem)]">
          {t("name")}
        </Heading>
        <p className="mt-1 font-medium text-muted">{t("born")}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {roles.map((r) => (
            <li key={r} className="rounded-full bg-sage-tint px-3 py-1 text-[0.85rem] font-semibold text-sage-deep sm:px-3.5 sm:py-1.5 sm:text-[0.9rem]">
              {t(r)}
            </li>
          ))}
        </ul>

        <figure className="mt-5 border-l-4 border-amber pl-4">
          <blockquote className="text-[1.1rem] font-bold text-walnut sm:text-xl">{t("motto")}</blockquote>
          <figcaption className="mt-1 text-[0.95rem] text-muted">{t("mottoMeaning")}</figcaption>
        </figure>

        <div className="mt-4 grid gap-3 text-base text-ink/85 sm:text-[1.05rem]">
          <p>{t("bio1")}</p>
          <p>{t("bio2")}</p>
        </div>

        <AaaPillars className="mt-6" label={tHome("aaaLabel")} />

        <div className="mt-5 rounded-2xl bg-walnut px-5 py-4 text-cream">
          <p className="tracking-label text-[0.78rem] font-bold text-amber-soft">{t("philosophyTitle")}</p>
          <p className="mt-1 text-[1.05rem] leading-snug font-bold sm:text-lg">{t("philosophy")}</p>
        </div>
      </div>
    </article>
  );
}
