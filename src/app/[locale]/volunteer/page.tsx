import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHead } from "@/components/sections/primitives";
import { DemoForm } from "@/components/forms/demo-form";
import { volunteerFields } from "@/components/forms/fields";

export async function generateMetadata({ params }: PageProps<"/[locale]/volunteer">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "volunteer", "/volunteer");
}

const steps = [
  { title: "step1Title", text: "step1Text" },
  { title: "step2Title", text: "step2Text" },
  { title: "step3Title", text: "step3Text" },
] as const;

export default async function VolunteerPage({ params }: PageProps<"/[locale]/volunteer">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Volunteer");

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />
      <Container className="grid gap-8 py-10 md:grid-cols-2 md:items-start">
        <ol className="grid gap-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-2xl border border-line bg-paper p-5"
            >
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber text-lg font-extrabold text-ink"
              >
                {i + 1}
              </span>
              <div>
                <h2 className="text-[1.15rem] leading-snug">{t(s.title)}</h2>
                <p className="mt-1 text-[1.02rem] text-ink/85">{t(s.text)}</p>
              </div>
            </li>
          ))}
        </ol>
        <DemoForm
          formKey="volunteer"
          title={t("formTitle")}
          fields={volunteerFields}
          submitLabel="join"
        />
      </Container>
    </>
  );
}
