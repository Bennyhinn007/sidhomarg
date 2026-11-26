import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Container, PageHead } from "@/components/sections/primitives";
import { DemoForm } from "@/components/forms/demo-form";
import { contactFields } from "@/components/forms/fields";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "contact", "/contact");
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const tCommon = await getTranslations("Common");
  const { email, phone, address, hours } = site.contact;

  const rows: { icon: LucideIcon; label: string; value: string | null; href?: string }[] = [
    { icon: MapPin, label: t("office"), value: address[locale] },
    { icon: Phone, label: t("phone"), value: phone, href: phone ? `tel:${phone.replace(/\s/g, "")}` : undefined },
    { icon: Mail, label: t("email"), value: email, href: email ? `mailto:${email}` : undefined },
    { icon: Clock, label: t("hours"), value: hours[locale] },
  ];

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />
      <Container className="grid gap-8 py-10 md:grid-cols-2 md:items-start">
        <section aria-labelledby="details-title">
          <h2 id="details-title" className="sr-only">{t("detailsTitle")}</h2>
          <dl className="grid gap-3">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-2xl border border-line bg-paper p-5">
                <dt className="tracking-label flex items-center gap-3 text-[0.8rem] font-bold text-sage-deep">
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  {label}
                </dt>
                <dd className="mt-1 pl-8 text-[1.08rem] font-medium">
                    {value ? (
                      href ? (
                        <a href={href} className="underline decoration-amber decoration-2 underline-offset-4 hover:text-amber-deep">
                          {value}
                        </a>
                      ) : (
                        value
                      )
                    ) : (
                      <span className="text-muted italic">{tCommon("placeholder")}</span>
                    )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <DemoForm formKey="contact" title={t("formTitle")} fields={contactFields} submitLabel="send" />
      </Container>
    </>
  );
}
