import type { LocalizedText } from "./types";

export type Article = {
  /** ISO date the Trust published it, e.g. "2026-12-01". Newest is shown first. */
  date: string;
  title: LocalizedText;
  author: LocalizedText;
  summary: LocalizedText;
  /** Language the article is written in. */
  language: "en" | "kn";
  /**
   * Where to read it: a PDF placed in /public/articles/ (e.g. "/articles/my-article.pdf")
   * or a full link to another site. Optional.
   */
  href?: string;
};

/**
 * Articles shown on /events after the Trust has reviewed them. Empty until the first one
 * is approved. Example:
 *
 * {
 *   date: "2026-12-01",
 *   title: { en: "Why every child needs a midday meal", kn: "..." },
 *   author: { en: "Siddrameshwar S. Wale", kn: "ಸಿದ್ಧರಾಮೇಶ್ವರ ಎಸ್. ವಾಲೆ" },
 *   summary: { en: "Two or three sentences about the article.", kn: "..." },
 *   language: "kn",
 *   href: "/articles/midday-meal.pdf",
 * },
 */
export const articles: Article[] = [];
