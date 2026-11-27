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
    email: "sidhomargco@gmail.com" as string | null,
    phone: "+91 81056 42464" as string | null,
    address: {
      en: "1st Floor, Patil Complex, Gandhi Chowk, Bhalki, Karnataka, India" as string | null,
      kn: "ಮೊದಲನೇ ಮಹಡಿ, ಪಾಟೀಲ್ ಕಾಂಪ್ಲೆಕ್ಸ್, ಗಾಂಧಿ ಚೌಕ್, ಭಾಲ್ಕಿ, ಕರ್ನಾಟಕ, ಭಾರತ" as string | null,
    },
    hours: {
      en: "Monday to Friday, 9 AM to 5 PM" as string | null,
      kn: "ಸೋಮವಾರದಿಂದ ಶುಕ್ರವಾರ, ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 5" as string | null,
    },
    /** Structured address for search engines (schema.org PostalAddress). */
    postal: {
      streetAddress: "1st Floor, Patil Complex, Gandhi Chowk",
      addressLocality: "Bhalki",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  },

  /** Full profile URLs. Icons are shown only for links that are set. */
  social: {
    facebook: null as string | null,
    twitter: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
  },

  /**
   * Official recruitment address used by every "Apply Now" button on /careers.
   * While null, the buttons are shown as unavailable instead of using a made-up address.
   */
  recruitmentEmail: null as string | null, // e.g. "careers@example.org"

  /**
   * Donations go straight to this UPI ID. No payment gateway is involved, so the
   * website can never confirm a payment; donors confirm it in their UPI app.
   */
  donate: {
    upiId: "ippbpranav@ybl",
    /** Shown in the donor's UPI app. Should match the bank account holder's name. */
    payeeName: "Sidhomarg Foundation",
    note: "Donation to Sidhomarg Foundation",
    amounts: [101, 201, 301, 401, 501],
    defaultAmount: 101,
    minAmount: 1,
    /** Common per-transaction UPI limit for person-to-person payments. */
    maxAmount: 100000,
    /**
     * Optional: path in /public to the official QR image (e.g. "/donate/upi-qr.png").
     * When null, a QR code is generated from upiId that also carries the selected amount.
     */
    qrImage: null as string | null,
  },

  founder: {
    /** Path inside /public, e.g. "/photos/founder.jpg". */
    photo: null as string | null,
  },
} as const;

export type SocialNetwork = keyof typeof site.social;
