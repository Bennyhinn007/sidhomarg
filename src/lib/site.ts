/**
 * Central place for Trust details that are not translated text.
 *
 * Anything set to `null` is unknown today. The site shows a clear
 * "to be added" placeholder (or hides the item) instead of inventing it.
 * Fill these in when the Trust confirms the details.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const site = {
  logo: {
    src: "/logo/sidhomarg.jpg",
    width: 1280,
    height: 640,
  },

  contact: {
    email: null as string | null, // e.g. "info@example.org"
    phone: null as string | null, // e.g. "+91 98765 43210"
    address: { en: null as string | null, kn: null as string | null },
    hours: { en: null as string | null, kn: null as string | null },
  },

  /** Full profile URLs. Icons are shown only for links that are set. */
  social: {
    facebook: null as string | null,
    twitter: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
  },

  founder: {
    /** Path inside /public, e.g. "/photos/founder.jpg". */
    photo: null as string | null,
  },
} as const;

export type SocialNetwork = keyof typeof site.social;
