/**
 * EmailJS + reCAPTCHA settings for the Support Us form.
 *
 * These values are designed to be public (they ship to the browser). Security comes from:
 * - EmailJS dashboard: allow-list the site's domain, enable reCAPTCHA v2 on the template,
 *   and set the recipient (sidhomargco@gmail.com) inside the template, never from the browser.
 * - reCAPTCHA v2: the token is verified by EmailJS with the secret key stored in its dashboard.
 *
 * Each value must be read as `process.env.NEXT_PUBLIC_…` literally so Next.js can inline it.
 */
export const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "",
};

/** The form only sends when every value is present. Otherwise it explains that it is being set up. */
export const supportFormConfigured = Object.values(emailjsConfig).every((v) => v.trim().length > 0);
