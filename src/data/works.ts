import type { LocalizedText, Photo } from "./types";

export type Pillar = "anna" | "akshara" | "arogya";

export type Work = {
  /** ISO date of the activity, e.g. "2025-11-14". Used for sorting and display. */
  date: string;
  pillar: Pillar;
  title: LocalizedText;
  summary: LocalizedText;
  place?: LocalizedText;
  photo?: Photo;
};

/**
 * "Our recent works" on the About page. Newest first is applied automatically.
 * Empty until the Trust shares real activities. Example entry:
 *
 * {
 *   date: "2025-11-14",
 *   pillar: "arogya",
 *   title: { en: "Free health check-up camp", kn: "ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಶಿಬಿರ" },
 *   summary: { en: "One or two sentences about what happened.", kn: "..." },
 *   place: { en: "Bhalki", kn: "ಭಾಲ್ಕಿ" },
 *   photo: { src: "/photos/works/health-camp.jpg", width: 1200, height: 800,
 *            alt: { en: "Doctors checking patients at the camp", kn: "..." } },
 * },
 */
export const works: Work[] = [];

/** Number of works shown on the About page. */
export const RECENT_WORKS_LIMIT = 6;
