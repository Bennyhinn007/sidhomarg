import type { LocalizedText, Photo } from "./types";

export type Member = {
  name: LocalizedText;
  role: LocalizedText;
  photo?: Photo;
};

/**
 * Trust members shown under the founder on the home page.
 * Empty until the Trust confirms names and roles. Example entry:
 *
 * {
 *   name: { en: "Full Name", kn: "ಪೂರ್ಣ ಹೆಸರು" },
 *   role: { en: "Secretary", kn: "ಕಾರ್ಯದರ್ಶಿ" },
 *   photo: { src: "/photos/members/name.jpg", width: 800, height: 1000,
 *            alt: { en: "Portrait of Full Name", kn: "..." } },
 * },
 */
export const members: Member[] = [
  {
    name: { en: "Pranav Patil", kn: "ಪ್ರಣವ್ ಪಾಟೀಲ್" },
    role: { en: "Co-Founder and VP", kn: "ಸಹ-ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ಉಪಾಧ್ಯಕ್ಷರು" },
    photo: {
      src: "/photos/members/pranav.jpg",
      width: 1280,
      height: 1248,
      alt: { en: "Portrait of Pranav Patil", kn: "ಪ್ರಣವ್ ಪಾಟೀಲ್ ಅವರ ಭಾವಚಿತ್ರ" },
    },
  },
];
