import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";

/**
 * schema.org NGO data for search engines. Only confirmed facts are included;
 * contact details and social profiles appear automatically once set in src/lib/site.ts.
 */
export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Meta" });
  const tFounder = await getTranslations({ locale, namespace: "Founder" });
  const sameAs = Object.values(site.social).filter((u): u is string => Boolean(u));

  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteUrl}/#organization`,
    name: t("siteName"),
    alternateName: locale === "en" ? "ಸಿದ್ಧೋಮಾರ್ಗ ಫೌಂಡೇಶನ್" : "Sidhomarg Foundation",
    url: absoluteUrl("/", locale),
    logo: `${siteUrl}${site.logo.src}`,
    description: t("defaultDescription"),
    inLanguage: locale,
    slogan: "सर्वे जनाः सुखिनो भवन्तु",
    founder: {
      "@type": "Person",
      name: tFounder("name"),
      birthPlace: { "@type": "Place", name: "Bhalki" },
    },
    ...(site.contact.email && { email: site.contact.email }),
    ...(site.contact.phone && { telephone: site.contact.phone.replace(/\s/g, "") }),
    address: { "@type": "PostalAddress", ...site.contact.postal },
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to keep the script tag closed.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
