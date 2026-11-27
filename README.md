# Sidhomarg Foundation website

Bilingual (English / Kannada) website for Sidhomarg Foundation, built with
Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, next-intl and Lucide React.

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (all pages are pre-rendered) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run check:i18n` | Checks that `messages/en.json` and `messages/kn.json` have the same keys, no empty values and matching placeholders |

## Pages and languages

| Page | English | Kannada |
|---|---|---|
| Home | `/` | `/kn` |
| Gallery | `/gallery` | `/kn/gallery` |
| Support Us (donate and/or volunteer) | `/support` | `/kn/support` |
| About (with Founders Corner) | `/about` | `/kn/about` |
| Events & Articles | `/events` | `/kn/events` |
| Careers | `/careers` | `/kn/careers` |
| Contact | `/contact` | `/kn/contact` |

- English is the default and has no prefix. Kannada uses `/kn`.
- The browser's language is ignored, so new visitors always start in English.
- When a visitor picks a language, it is saved in the `NEXT_LOCALE` cookie for a year.
  Visiting an English URL later redirects to the Kannada version until they switch back.
- The switcher keeps the visitor on the same page.

## Editing content

| What | Where |
|---|---|
| All text, both languages | `messages/en.json`, `messages/kn.json` (keep the keys identical) |
| Email, phone, address, office hours | `src/lib/site.ts` → `contact` |
| Facebook / Twitter / Instagram / LinkedIn links | `src/lib/site.ts` → `social` |
| Founder photo | Put the file in `public/photos/` and set `site.founder.photo` |
| About → Our members | `src/data/members.ts` |
| Founders Corner photos | `public/photos/events/` + `founderEvents` in `src/data/photos.ts` |
| About → Our recent works | `src/data/works.ts` (photos in `public/photos/works/`) |
| About → Our volunteers | `src/data/volunteers.ts` (photos in `public/photos/volunteers/`) |
| Upcoming events | `src/data/events.ts` (past events drop off automatically, page refreshes daily) |
| Published articles | `src/data/articles.ts` (PDFs in `public/articles/`). "Submit an Article" emails the Trust's address for review |
| Gallery photos | `public/photos/gallery/` + `galleryPhotos` in `src/data/photos.ts` |
| Recruitment email (Apply Now buttons) | `src/lib/site.ts` → `recruitmentEmail` |
| Career roles | `src/data/careers.ts` + `Careers.roles` in `messages/*.json` |
| Navigation order | `src/data/nav.ts` |

Anything left as `null` or an empty list shows a clear "to be added" placeholder.
Nothing about the Trust is invented.

## Forms

The contact form is a **demo**. They validate input and then tell the
visitor plainly that nothing was sent. To make them real, replace the `onSubmit`
handler in `src/components/forms/demo-form.tsx` (for example with a Server Action
that sends an email) and remove the demo notice text in `messages/*.json`.

## Careers

Each role card has an **Apply Now** `mailto:` link to `site.recruitmentEmail`. The subject is
`Application for <Role> | Sidhomarg Foundation` (always English, so the inbox can be filtered),
and the body is a short template in the visitor's language asking for full name, contact number,
qualifications, experience and portfolio/LinkedIn, with a reminder to attach a CV.
While `recruitmentEmail` is `null` the buttons show "Email coming soon" instead.

## Support Us (`/support`, `/kn/support`)

One form for donating, volunteering, or both: full name, mobile number, volunteer interest,
donation amount (₹101 default, ₹201–₹501, custom, or "volunteer only") and a consent checkbox.
Old `/donate` and `/volunteer` links redirect here.

On submit the form validates the fields, checks reCAPTCHA, creates a reference ID such as
`SM-261127-7K3QD`, and emails the details to the Trust with **EmailJS**. The email always says
**Pending Verification** for donations. The donor then taps **Pay** to open their UPI app; the UPI
note carries the reference, phone and name (ASCII only, max 50 characters) so the payment can be matched.

Duplicate protection: the button is disabled while sending, the form locks after success, the
same details are not re-sent in the same browser session, and a new submission is blocked for
10 seconds after a successful one. Retries after a failed send are allowed straight away and keep
the same reference ID.

### Setup (one time)

1. **reCAPTCHA v2**: at https://www.google.com/recaptcha/admin create a *v2 "I'm not a robot" Checkbox*
   key for your domain (and `localhost` for testing). Copy the **site key** and **secret key**.
2. **EmailJS** (free plan: 200 emails/month): at https://dashboard.emailjs.com
   - Add an email service (e.g. Gmail for sidhomargco@gmail.com) → note the **Service ID**.
   - Create a template from `docs/emailjs-support-template.html` (recipient and subject are in that file)
     → note the **Template ID**. In the template's *Settings*, enable reCAPTCHA V2 and paste the **secret key**.
   - Account → **Public Key**. Account → Security: add your domain to the allow-list.
3. Set these in Vercel (Settings → Environment Variables) and in `.env.local`:
   `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`,
   `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Redeploy.

Until all four are set, the form shows "being set up" and the page falls back to a direct
**Donate Now** UPI button, the QR code and the UPI ID.

## Donations (UPI settings)

Direct UPI payments with no gateway, API keys or backend. Settings live in `src/lib/site.ts` → `donate`
(UPI ID, receiver name, note, preset amounts, default, min/max).

- **Donate Now** is a `upi://pay` link (`pa`, `pn`, `am`, `cu=INR`, `tn`) that opens Google Pay, PhonePe,
  Paytm or another UPI app on phones.
- The QR code is generated in the browser from the same link, so it carries the selected amount.
  To show the official QR image instead, put it in `public/` and set `donate.qrImage`.
- The site cannot verify payments, so it never shows a success message; donors confirm in their UPI app.

## Visit counter

The footer shows the total number of website visits, shared by English and Kannada pages.

- Storage: Upstash Redis, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (server-side only).
- `POST /api/visit` counts a new browsing session; `GET /api/visit` only reads the total.
- A visit is counted once per session: a `sessionStorage` flag stops repeat requests, an httpOnly
  `sm_visit` cookie stops repeat counting, and Redis remembers a hash of IP + browser for 30 minutes
  (raw IPs are never stored). The increment is a single atomic Redis script.
- Bots, link previews, prefetches and cross-site requests are not counted.
- If the variables are missing or Redis is down, the counter is simply hidden. Pages still load.

## Project structure

```
messages/                 en.json, kn.json
public/                   logo/, photos/
scripts/check-i18n.mjs    translation completeness check
src/
  app/
    [locale]/             layout + one folder per page
    sitemap.ts robots.ts  icon.png apple-icon.png
  components/
    layout/               header, desktop nav, bottom nav, language switcher, footer
    sections/             hero, vision & mission, founder, members, photo grid, ...
    forms/                demo form + field definitions
    seo/                  NGO structured data (JSON-LD)
    ui/                   shadcn/ui components
  data/                   members, photos, careers, navigation
  i18n/                   next-intl routing, navigation, request config
  lib/                    site config, SEO helpers, mailto helper, visit counter, utils
  app/api/visit/          visit counter endpoint
  proxy.ts                language routing (Next.js 16 "proxy", formerly middleware)
```

### Adding a page (e.g. events, donations, announcements, annual reports)

1. Create `src/app/[locale]/<name>/page.tsx` (copy `gallery/page.tsx` as a template).
2. Add its text to both `messages/en.json` and `messages/kn.json`, plus `Meta.<name>` for SEO.
3. Add `PageKey` in `src/lib/seo.ts`. To show it in the menus, add it to `src/data/nav.ts`
   (the sitemap picks up everything in `nav.ts` automatically).
4. Put any lists of content in `src/data/<name>.ts`.
5. Run `npm run check:i18n && npm run typecheck && npm run build`.

## SEO

Each page has its own title, description, canonical URL, `hreflang` links (en, kn,
x-default) and Open Graph / Twitter tags. The home page includes schema.org `NGO` data.
`/sitemap.xml` and `/robots.txt` are generated. All absolute URLs come from
`NEXT_PUBLIC_SITE_URL`. Set `NEXT_PUBLIC_ALLOW_INDEXING=false` on preview deployments.

## Accessibility

17px base text, 44px+ touch targets, visible amber focus rings, a skip link, one `h1`
per page, labelled landmarks, `aria-current` on the active page, accessible form errors,
reduced-motion support, and colour pairs checked against WCAG AA. Kannada uses
Noto Sans Kannada with taller line height.

## Deploying

Works on Vercel with no extra configuration. Set `NEXT_PUBLIC_SITE_URL` in the
project's environment variables.
