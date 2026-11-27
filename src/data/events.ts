import type { LocalizedText } from "./types";

export type TrustEvent = {
  /** ISO date, e.g. "2026-12-14". Events disappear from "Upcoming" the day after. */
  date: string;
  /** Free text in both languages, e.g. { en: "10 AM to 1 PM", kn: "ಬೆಳಿಗ್ಗೆ 10 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1" }. */
  time?: LocalizedText;
  title: LocalizedText;
  place?: LocalizedText;
  description?: LocalizedText;
};

/**
 * Upcoming events on /events. Empty until the Trust announces real events. Example:
 *
 * {
 *   date: "2026-12-14",
 *   time: { en: "10 AM to 1 PM", kn: "ಬೆಳಿಗ್ಗೆ 10 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1" },
 *   title: { en: "Free health check-up camp", kn: "ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಶಿಬಿರ" },
 *   place: { en: "Gandhi Chowk, Bhalki", kn: "ಗಾಂಧಿ ಚೌಕ್, ಭಾಲ್ಕಿ" },
 *   description: { en: "One or two sentences.", kn: "..." },
 * },
 */
export const events: TrustEvent[] = [];
