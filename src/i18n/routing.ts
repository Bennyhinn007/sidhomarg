import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "kn"],
  defaultLocale: "en",
  // English has no prefix ("/about"), Kannada uses "/kn/about".
  localePrefix: "as-needed",
  // Remember a language the visitor picked by hand for one year.
  // Browser-language detection is switched off in src/proxy.ts.
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
  // hreflang link headers are generated in page metadata instead.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
