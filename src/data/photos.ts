import type { LocalizedText, Photo } from "./types";

export type CaptionedPhoto = Photo & { caption: LocalizedText };

/**
 * Founders Corner (About page): photos of the founder at events.
 * Put files in /public/photos/events/ and add an entry per photo. Example:
 *
 * {
 *   src: "/photos/events/health-camp-2025.jpg", width: 1200, height: 1500,
 *   alt: { en: "The founder speaking at a health camp", kn: "..." },
 *   caption: { en: "Health camp, Bhalki", kn: "..." },
 * },
 */
export const founderEvents: CaptionedPhoto[] = [];

/** Gallery page photos. Same format as above, stored in /public/photos/gallery/. */
export const galleryPhotos: CaptionedPhoto[] = [];

/** Number of placeholder tiles to show while a list is empty. */
export const PLACEHOLDER_SLOTS = 6;
