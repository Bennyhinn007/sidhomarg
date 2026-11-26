import type { LocalizedText, Photo } from "./types";

export type Volunteer = {
  name: LocalizedText;
  /** What they help with, e.g. "Health camps" / "ಆರೋಗ್ಯ ಶಿಬಿರಗಳು". */
  area: LocalizedText;
  /** Town or village, optional. */
  place?: LocalizedText;
  photo?: Photo;
};

/**
 * Volunteers shown on the About page. Empty until the Trust confirms names
 * (and has their permission to publish them). Example entry:
 *
 * {
 *   name: { en: "Full Name", kn: "ಪೂರ್ಣ ಹೆಸರು" },
 *   area: { en: "Food drives", kn: "ಆಹಾರ ವಿತರಣೆ" },
 *   place: { en: "Bhalki", kn: "ಭಾಲ್ಕಿ" },
 *   photo: { src: "/photos/volunteers/name.jpg", width: 800, height: 1000,
 *            alt: { en: "Portrait of Full Name", kn: "..." } },
 * },
 */
export const volunteers: Volunteer[] = [];
