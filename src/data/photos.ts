import type { LocalizedText, Photo } from "./types";

/** A photo with an optional caption shown under it. */
export type CaptionedPhoto = Photo & { caption?: LocalizedText };

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

/**
 * Gallery page photos, stored in /public/photos/gallery/. Width and height are the real pixel size.
 * Add a `caption` (English and Kannada) to show a line of text under a photo, e.g. the event name and place.
 */
export const galleryPhotos: CaptionedPhoto[] = [
  {
    src: "/photos/gallery/gallery-01.jpg",
    width: 1280,
    height: 1280,
    alt: {
      en: "Speaking to a large audience of students in an auditorium",
      kn: "ಸಭಾಂಗಣದಲ್ಲಿ ದೊಡ್ಡ ಸಂಖ್ಯೆಯ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಉದ್ದೇಶಿಸಿ ಮಾತನಾಡುತ್ತಿರುವುದು",
    },
  },
  {
    src: "/photos/gallery/gallery-02.jpg",
    width: 720,
    height: 361,
    alt: {
      en: "Volunteers handing food packets to women outside roadside shelters",
      kn: "ರಸ್ತೆಬದಿಯ ಗುಡಿಸಲುಗಳ ಬಳಿ ಮಹಿಳೆಯರಿಗೆ ಸ್ವಯಂಸೇವಕರು ಆಹಾರದ ಪೊಟ್ಟಣಗಳನ್ನು ನೀಡುತ್ತಿರುವುದು",
    },
  },
  {
    src: "/photos/gallery/gallery-03.jpg",
    width: 1066,
    height: 710,
    alt: {
      en: "A group of guests holding copies of the book “The Way I Loved Her”",
      kn: "“The Way I Loved Her” ಪುಸ್ತಕದ ಪ್ರತಿಗಳನ್ನು ಹಿಡಿದಿರುವ ಅತಿಥಿಗಳ ಗುಂಪು",
    },
  },
  {
    src: "/photos/gallery/gallery-04.jpg",
    width: 1152,
    height: 979,
    alt: {
      en: "Speaking into a microphone while seated at a gathering",
      kn: "ಸಭೆಯಲ್ಲಿ ಕುಳಿತು ಮೈಕ್ ಹಿಡಿದು ಮಾತನಾಡುತ್ತಿರುವುದು",
    },
  },
  {
    src: "/photos/gallery/gallery-05.jpg",
    width: 1280,
    height: 960,
    alt: {
      en: "Two people holding copies of the book “The Way I Loved Her”",
      kn: "“The Way I Loved Her” ಪುಸ್ತಕದ ಪ್ರತಿಗಳನ್ನು ಹಿಡಿದಿರುವ ಇಬ್ಬರು",
    },
  },
  {
    src: "/photos/gallery/gallery-06.jpg",
    width: 1171,
    height: 836,
    alt: {
      en: "Presenting a book at a Government of India office",
      kn: "ಭಾರತ ಸರ್ಕಾರದ ಕಚೇರಿಯಲ್ಲಿ ಪುಸ್ತಕವನ್ನು ನೀಡುತ್ತಿರುವುದು",
    },
  },
  {
    src: "/photos/gallery/gallery-07.jpg",
    width: 960,
    height: 1280,
    alt: {
      en: "Speaking at a podium in front of a presentation in Kannada",
      kn: "ಕನ್ನಡ ಪ್ರಸ್ತುತಿಯ ಮುಂದೆ ವೇದಿಕೆಯಲ್ಲಿ ಮಾತನಾಡುತ್ತಿರುವುದು",
    },
  },
  {
    src: "/photos/gallery/gallery-08.jpg",
    width: 1024,
    height: 1024,
    alt: {
      en: "Smiling portrait against a dark background",
      kn: "ಕಪ್ಪು ಹಿನ್ನೆಲೆಯಲ್ಲಿ ನಗುಮುಖದ ಭಾವಚಿತ್ರ",
    },
  },
];

/** Number of placeholder tiles to show while a list is empty. */
export const PLACEHOLDER_SLOTS = 6;
