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
| Volunteer | `/volunteer` | `/kn/volunteer` |
| About (with Founders Corner) | `/about` | `/kn/about` |
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
| Members | `src/data/members.ts` |
| Founders Corner photos | `public/photos/events/` + `founderEvents` in `src/data/photos.ts` |
| Gallery photos | `public/photos/gallery/` + `galleryPhotos` in `src/data/photos.ts` |
| Recruitment email (Apply Now buttons) | `src/lib/site.ts` → `recruitmentEmail` |
| Career roles | `src/data/careers.ts` + `Careers.roles` in `messages/*.json` |
| Navigation order | `src/data/nav.ts` |

Anything left as `null` or an empty list shows a clear "to be added" placeholder.
Nothing about the Trust is invented.

## Forms

The contact and volunteer forms are **demos**. They validate input and then tell the
visitor plainly that nothing was sent. To make them real, replace the `onSubmit`
handler in `src/components/forms/demo-form.tsx` (for example with a Server Action
that sends an email) and remove the demo notice text in `messages/*.json`.

## Careers

Each role card has an **Apply Now** `mailto:` link to `site.recruitmentEmail`. The subject is
`Application for <Role> | Sidhomarg Foundation` (always English, so the inbox can be filtered),
and the body is a short template in the visitor's language asking for full name, contact number,
qualifications, experience and portfolio/LinkedIn, with a reminder to attach a CV.
While `recruitmentEmail` is `null` the buttons show "Email coming soon" instead.

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
